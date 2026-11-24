import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDownRight, ArrowUpRight, Minus } from 'lucide-react';
import { endpoints } from '../services/api';

const money = new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', minimumFractionDigits: 2, maximumFractionDigits: 2,
});

function latestHistoricalClose(payload) {
  const rows = Array.isArray(payload) ? payload : (payload?.content || payload?.data || []);
  if (!Array.isArray(rows) || !rows.length) return null;
  const valid = rows.filter((row) => Number.isFinite(Number(row?.close)) && Number(row.close) > 0);
  if (!valid.length) return null;
  // History is normally returned oldest-first. Sorting by its documented date
  // field also makes the baseline reliable if an API response arrives unordered.
  valid.sort((a, b) => String(a.date || '').localeCompare(String(b.date || '')));
  return Number(valid[valid.length - 1].close);
}

export default function StockTicker({ stocks = [], prices = {} }) {
  const [historicalCloses, setHistoricalCloses] = useState({});

  useEffect(() => {
    let active = true;
    if (!stocks.length) return undefined;
    Promise.allSettled(stocks.map(async (stock) => {
      const response = await endpoints.history(stock.symbol);
      return [stock.symbol, latestHistoricalClose(response.data)];
    })).then((results) => {
      if (!active) return;
      setHistoricalCloses((previous) => {
        const next = { ...previous };
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value[1] != null) {
            next[result.value[0]] = result.value[1];
          }
        });
        return next;
      });
    });
    return () => { active = false; };
  }, [stocks]);

  const items = useMemo(() => stocks
    .filter((stock) => stock?.symbol && prices[stock.symbol] && Number.isFinite(Number(prices[stock.symbol].currentPrice)))
    .slice()
    .sort((a, b) => a.symbol.localeCompare(b.symbol)), [stocks, prices]);

  if (!stocks.length) return null;

  const renderItem = (stock, duplicate = false) => {
    const price = Number(prices[stock.symbol]?.currentPrice);
    const baseline = historicalCloses[stock.symbol];
    const change = baseline > 0 ? ((price - baseline) / baseline) * 100 : null;
    const hasChange = Number.isFinite(change);
    const positive = hasChange && change > 0;
    const negative = hasChange && change < 0;
    const Icon = positive ? ArrowUpRight : negative ? ArrowDownRight : Minus;
    return <Link
      key={`${duplicate ? 'copy-' : ''}${stock.symbol}`}
      to={`/app/stocks/${encodeURIComponent(stock.symbol)}`}
      className="stock-ticker-item"
      tabIndex={duplicate ? -1 : 0}
      aria-label={`${stock.symbol}, simulated price ${money.format(price)}${hasChange ? `, ${change.toFixed(2)} percent from latest historical close` : ', percentage change unavailable'}`}
    >
      <span className="stock-ticker-symbol">{stock.symbol}</span>
      <strong className="stock-ticker-price">{money.format(price)}</strong>
      {hasChange ? <span className={`stock-ticker-change ${positive ? 'positive' : negative ? 'negative' : 'neutral'}`}><Icon size={13} strokeWidth={2.6}/>{change > 0 ? '+' : ''}{change.toFixed(2)}%</span> : <span className="stock-ticker-change unavailable">—</span>}
    </Link>;
  };

  return <section className="stock-ticker" aria-label="Simulated stock prices">
    <div className="stock-ticker-heading"><span className="stock-ticker-pulse"/> MARKET WATCH <small>SIMULATED</small></div>
    <div className="stock-ticker-viewport">
      {items.length ? <div className="stock-ticker-track">
        <div className="stock-ticker-sequence">{items.map((stock) => renderItem(stock))}</div>
        <div className="stock-ticker-sequence" aria-hidden="true">{items.map((stock) => renderItem(stock, true))}</div>
      </div> : <div className="stock-ticker-empty">Fetching simulated prices from your stock catalog…</div>}
    </div>
    <span className="stock-ticker-footnote">Price movement vs. latest available historical close</span>
  </section>;
}
