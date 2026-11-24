import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Money } from './UI';

const palette = ['#3268e8', '#13a884', '#8b75e8', '#e8a33a', '#e16b84', '#54a6c8', '#9baf53', '#64748b'];

export function AllocationChart({ data = [] }) {
  const chartData = data.map((item) => ({ name: item.symbol, value: Number(item.currentValue || 0), percentage: Number(item.allocationPercentage || 0) }));
  if (!chartData.length) return <div className="chart-empty">Your allocation will appear when you own stocks.</div>;
  return <div className="allocation-layout"><div className="donut-wrap"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius="67%" outerRadius="92%" paddingAngle={3} stroke="none">{chartData.map((entry, index) => <Cell key={entry.name} fill={palette[index % palette.length]}/>)}</Pie><Tooltip formatter={(value) => [<Money value={value}/>, 'Value']}/></PieChart></ResponsiveContainer><div className="donut-center"><strong>{chartData.length}</strong><span>Holdings</span></div></div><div className="allocation-legend">{chartData.slice(0, 6).map((item, index) => <div className="legend-row" key={item.name}><span className="legend-dot" style={{ background: palette[index % palette.length] }}/><span className="legend-name">{item.name}</span><strong>{item.percentage.toFixed(1)}%</strong></div>)}</div></div>;
}

export function HistoryChart({ data = [] }) {
  const chartData = data.map((item) => ({ ...item, closeValue: Number(item.close), label: item.date }));
  if (!chartData.length) return <div className="chart-empty">No historical price data is available for this stock.</div>;
  const first = chartData[0].closeValue;
  const last = chartData[chartData.length - 1].closeValue;
  const color = last >= first ? '#13a884' : '#df6672';
  return <div className="history-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={chartData} margin={{ top: 12, right: 10, left: -16, bottom: 0 }}><defs><linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.2}/><stop offset="95%" stopColor={color} stopOpacity={0}/></linearGradient></defs><CartesianGrid stroke="#edf0f5" vertical={false}/><XAxis dataKey="label" tickFormatter={(value) => value?.slice(5)} tickLine={false} axisLine={false} tick={{ fill: '#8b95a7', fontSize: 11 }}/><YAxis domain={['auto', 'auto']} tickLine={false} axisLine={false} tick={{ fill: '#8b95a7', fontSize: 11 }} tickFormatter={(value) => `₹${value}`}/><Tooltip contentStyle={{ border: '1px solid #e9edf3', borderRadius: 12, boxShadow: '0 8px 24px rgba(24,39,75,.08)' }} formatter={(value) => [`₹${Number(value).toFixed(2)}`, 'Close']} labelFormatter={(label) => `Date: ${label}`}/><Area type="monotone" dataKey="closeValue" stroke={color} strokeWidth={2.2} fill="url(#priceFill)" activeDot={{ r: 4, strokeWidth: 0 }}/></AreaChart></ResponsiveContainer></div>;
}
