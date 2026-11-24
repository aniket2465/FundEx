# FundEx Frontend

A React + Vite frontend for the existing FundEx Spring Boot API.

## Requirements

- Node.js 20.19+ or 22.12+
- npm
- FundEx Spring Boot backend running on `http://localhost:8080`
- MySQL database configured for the backend

## Run locally

1. Open this folder in VS Code.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the Spring Boot backend on port `8080`.
4. Start the frontend:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:5173`.

The Vite development server proxies `/api` requests to `http://localhost:8080`, so local development does not require a backend CORS change.

## Environment configuration

Copy `.env.example` to `.env` if you want to configure a different API origin.

- Local development: leave `VITE_API_BASE_URL` empty; the Vite proxy handles `/api`.
- Deployment: set `VITE_API_BASE_URL` to the deployed backend origin, for example `https://your-api.example.com`.

For a deployed frontend and backend on different origins, configure CORS on the backend to allow the deployed frontend origin. Do not use `*` with credentials or expose secrets in frontend environment variables.

## Main features

- Public landing page
- Registration and login using the existing JWT endpoints
- Role-aware USER and ADMIN routes using the JWT `role` claim
- User dashboard with portfolio summary, wallet, watchlist, recent trades, and allocation
- Stock explorer, stock detail, simulated live price, and historical chart
- Watchlist, wallet, holdings, transactions, and portfolio pages
- Admin dashboard, stock catalog, and stock creation form
- INR formatting, loading states, empty states, and API error handling

## Backend API contract used

The frontend uses the existing endpoints:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/user/me`
- `GET /api/stocks`
- `GET /api/stocks/{symbol}`
- `GET /api/stocks/search?name=...`
- `GET /api/stocks/{symbol}/history`
- `GET /api/stocks/{symbol}/live-price`
- `POST /api/stocks` (ADMIN)
- `GET /api/watchlist`, `POST /api/watchlist/{symbol}`, `DELETE /api/watchlist/{symbol}`
- `GET /api/wallet`
- `GET /api/holdings`
- `GET /api/transactions`, `POST /api/transactions/buy/{symbol}`, `POST /api/transactions/sell/{symbol}`
- `GET /api/portfolio/summary`
- `GET /api/portfolio/allocation`

The frontend does not create mock transactions, balances, holdings, or portfolio values.

## Important backend integration note

In the backend ZIP inspected for this frontend, `LiveStockPriceInitializer` initializes live prices only at application startup. `StockService.createStock()` generates historical prices but does not initialize a live-price row for a stock created while the backend is already running. As a result, a newly created stock may not have a live price until the backend is restarted. Existing catalog stocks with live-price rows are unaffected. Before demonstrating stock creation end-to-end, either restart the backend after creating a stock or add a small backend initialization call to the stock-creation flow.

All market prices and historical series are synthetic and should be presented as simulated data, not genuine live NSE/BSE quotes.

## FundEx branding and simulated market ticker

- The supplied FundEx bull-market logo is integrated into the shared brand component and is used across the public site, authentication screens, investor workspace, and admin workspace. The favicon uses the same mark.
- The investor home dashboard includes a continuous right-to-left stock ticker built with CSS keyframe animation and a duplicated sequence for a seamless loop. It pauses on hover, supports reduced-motion preferences, remains usable on mobile, and each item links to its stock detail page.
- Ticker prices come from `GET /api/stocks/{symbol}/live-price` and refresh with the dashboard's existing 10-second price refresh.
- Percentage movement is calculated only when the stock has a valid latest historical `close` from `GET /api/stocks/{symbol}/history`: `(simulated current price - latest historical close) / latest historical close * 100`. If a baseline is unavailable, the ticker displays `—` rather than inventing a percentage.
- All ticker values are simulated educational data. The ticker does not show fabricated NIFTY, SENSEX, or GIFT NIFTY values.
