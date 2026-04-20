# Portfolio Manager

A comprehensive portfolio tracking application inspired by Moneycontrol's portfolio features. Track investments across multiple asset classes, manage transactions, monitor SIPs, and analyze your portfolio performance.

## Features

### Asset Class Tracking
- **Stocks** - Equity investments
- **Mutual Funds** - SIP and lump-sum investments
- **Gold & Silver** - Commodity holdings
- **ULIPs** - Insurance-linked investments
- **Bank Deposits** - Fixed deposits
- **Recurring Deposits** - RDs
- **PPF** - Public Provident Fund
- **NSC** - National Savings Certificate
- **KVP** - Kisan Vikas Patra
- **Corporate Deposits** - Company fixed deposits
- **Property** - Real estate investments
- **Loans** - Loan tracking

### Portfolio Dashboard
- Total portfolio value
- Total invested amount
- **Daily P/L** - Day-wise profit/loss with percentage
- **Overall P/L** - Total profit/loss with percentage
- Holdings count
- Day change percentage

### Holdings Management
- Add/edit/delete holdings
- Track quantity, average price, and current price
- View profit/loss per holding
- Multiple asset class support

### Transaction History
- Buy/Sell transactions
- Dividend payments
- Bonus issues
- Stock splits
- Filter by asset class and date

### SIP Management
- Create recurring SIPs
- Set frequency (daily, weekly, monthly, quarterly, yearly)
- Track installment history
- Monitor next investment date

### Watchlist
- Create multiple watchlists
- Track shortlisted stocks, funds, and commodities
- Monitor prices before investing

### Dividends
- Track dividend income
- Record payment dates
- Mark reinvested dividends

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Database**: SQLite with Drizzle ORM
- **Package Manager**: Bun

## Setup

### Prerequisites

- [Bun](https://bun.sh) - JavaScript runtime

### Installation

```bash
# Install dependencies
bun install

# Generate database migrations
bun db:generate
```

### Development

```bash
# Run development server
bun run dev
```

### Build

```bash
# Build for production
bun run build

# Start production server
bun run start
```

### Code Quality

```bash
# Type checking
bun run typecheck

# ESLint
bun run lint
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx         # Main portfolio page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/          # React components
├── db/
│   ├── index.ts        # Database client
│   ├── schema.ts      # Table definitions
│   ├── migrate.ts   # Migration script
│   └── migrations/   # SQL migrations
├── lib/
│   ├── types.ts      # TypeScript types
│   └── portfolio.ts  # Database operations
```

## Database Schema

| Table | Description |
|-------|-------------|
| `asset_classes` | Asset class definitions |
| `holdings` | Investment holdings |
| `transactions` | Buy/sell transactions |
| `dividends` | Dividend records |
| `sips` | SIP installations |
| `sip_installments` | SIP installment history |
| `watchlists` | Watchlist definitions |
| `watchlist_items` | Watchlist items |
| `accounts` | Multiple accounts |
| `portfolio_history` | Daily portfolio snapshots |

## Environment Variables

When deployed to the sandbox, the following environment variables are automatically provided:
- `DB_URL` - Database connection URL
- `DB_TOKEN` - Database authentication token

## License

MIT