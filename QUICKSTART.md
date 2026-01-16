# Quick Start Guide - Slooze RBAC Frontend

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Test Accounts

### Manager (Full Access)
- **Email**: manager@slooze.com
- **Password**: manager123
- **Access**: Dashboard + Products

### Store Keeper (Limited Access)
- **Email**: keeper@slooze.com  
- **Password**: keeper123
- **Access**: Products only (can only edit stock)

## Features to Test

1. **Login** - Try both accounts
2. **Dashboard** - Manager only, shows statistics
3. **Products** - Both roles can access
4. **Add Product** - Both roles can add
5. **Edit Product** - Store Keeper can only edit stock
6. **Dark Mode** - Toggle in navbar
7. **Search & Filter** - On products page
8. **Role-based Menu** - Dashboard hidden for Store Keeper

## Project Structure

```
app/
├── dashboard/      # Manager-only dashboard
├── login/          # Login page
├── products/       # Products management
components/         # Reusable components
context/           # Auth & Theme contexts
graphql/           # Queries & mock data
lib/               # Apollo Client setup
types/             # TypeScript definitions
```

## Key Technologies

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Apollo Client (mocked GraphQL)
- Context API (Auth & Theme)

## Notes

- All data is mocked and resets on refresh
- JWT tokens are simulated
- 500ms delay added to simulate network requests
- Low stock threshold: < 10 units
