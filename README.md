# Slooze - Commodities Management System

A production-ready, role-based access control (RBAC) frontend application built with Next.js, TypeScript, Tailwind CSS, and Apollo Client for managing commodities inventory.

## 🚀 Features Implemented

### ✅ Core Features
- **Authentication System** with role-based login
- **Role-Based Access Control (RBAC)** with two user roles:
  - **Manager**: Full access to dashboard and products
  - **Store Keeper**: Access to products only
- **Protected Routes** with automatic redirects based on authentication and role
- **Dashboard** (Manager-only) with real-time statistics:
  - Total products count
  - Low stock items alert
  - Product categories count
  - Total inventory value
- **Product Management** (Both roles):
  - View all products with search and filter
  - Add new products
  - Edit existing products
  - Delete products
  - Role-based field restrictions (Store Keeper can only edit stock)
- **Slooze AI Assistant**: Integrated AI chatbot for system guidance and inventory support:
  - Role-based assistance (RBAC explanations)
  - Inventory workflow guidance
  - Real-time streaming responses
  - File upload support for documents
- **Dark/Light Mode** with system preference detection and localStorage persistence
- **Responsive Design** optimized for mobile, tablet, and desktop

### 🎨 UI/UX Enhancements
- Beautiful gradient designs and animations
- Smooth transitions and hover effects
- Loading states and error handling
- Toast notifications for user actions
- Custom scrollbar styling
- Accessible and semantic HTML

### 🔒 Security Features
- JWT token simulation
- Protected route guards
- Role-based UI restrictions
- Client-side validation
- Secure localStorage handling

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **GraphQL Client**: Apollo Client (with mocked backend)
- **Fonts**: Inter (Google Fonts)

## 📂 Project Structure

```
slooze-rbac-frontend/
├── app/                          # Next.js App Router pages
│   ├── dashboard/               # Manager-only dashboard
│   │   └── page.tsx
│   ├── login/                   # Login page
│   │   └── page.tsx
│   ├── products/                # Products management page
│   │   └── page.tsx
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Home page (redirects)
├── components/                   # Reusable React components
│   ├── Navbar.tsx               # Navigation with role-based menu
│   ├── N8nChat.tsx              # Slooze AI Assistant component
│   ├── ProductModal.tsx         # Add/Edit product modal
│   └── ProtectedRoute.tsx       # Route protection HOC
├── context/                      # React Context providers
│   ├── AuthContext.tsx          # Authentication state
│   └── ThemeContext.tsx         # Theme (dark/light) state
├── graphql/                      # GraphQL queries and mocks
│   ├── mockData.ts              # Mock product data
│   └── queries.ts               # GraphQL queries/mutations
├── lib/                          # Utility libraries
│   └── apolloClient.ts          # Apollo Client with mock link
├── types/                        # TypeScript type definitions
│   └── index.ts                 # All type definitions
├── next.config.js               # Next.js configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
└── README.md                    # This file
```

## 🔐 Role-Based Access Control

### Manager Role
- **Access**: Dashboard + Products
- **Permissions**:
  - View dashboard statistics
  - View all products
  - Create new products
  - Edit all product fields
  - Delete products
- **Dashboard Menu**: Visible
- **Redirect After Login**: `/dashboard`

### Store Keeper Role
- **Access**: Products only
- **Permissions**:
  - View all products
  - Create new products
  - Edit **stock quantity only** (other fields disabled)
  - Delete products
- **Dashboard Menu**: Hidden (route also protected)
- **Redirect After Login**: `/products`

### Route Protection
All routes except `/login` are protected. Unauthorized access attempts result in automatic redirects:
- Unauthenticated users → `/login`
- Store Keeper accessing `/dashboard` → `/products`
- Manager accessing restricted routes → `/dashboard`

## 🧪 Test Credentials

### Manager Account
```
Email: manager@slooze.com
Password: manager123
```

### Store Keeper Account
```
Email: keeper@slooze.com
Password: keeper123
```

**Note**: Any email containing "manager" will be assigned the Manager role. All other emails will be assigned the Store Keeper role.

## 🚦 How to Run Locally

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation Steps

1. **Clone the repository** (or extract the project files)
   ```bash
   cd e:\project\Slooze-RBAC
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

5. **Login with test credentials**
   Use one of the test accounts provided above

### Build for Production

```bash
npm run build
npm start
```

## 🎯 Key Implementation Details

### Authentication Flow
1. User enters email and password on `/login`
2. Mock authentication determines role based on email
3. JWT token and user data stored in localStorage
4. User redirected based on role
5. Protected routes verify authentication on every navigation

### GraphQL Mocking
- Apollo Client configured with custom mock link
- Simulates 500ms network delay for realistic UX
- In-memory data store for CRUD operations
- All queries and mutations fully functional

### Theme System
- Detects system preference on first load
- Persists user choice in localStorage
- Applies Tailwind's `dark` class to `<html>` element
- Smooth transitions between themes

### Role-Based UI
- Navbar dynamically shows/hides menu items
- Product modal disables fields based on role
- Dashboard route completely hidden from Store Keepers
- All restrictions enforced both in UI and routing

### Slooze AI Assistant
- **Integration**: Powered by n8n Chat Trigger and AI Agent nodes
- **Features**:
  - **Streaming**: Real-time response generation for a better UX
  - **Context Aware**: Specialized in Slooze RBAC and inventory workflows
  - **UI**: Custom-built floating chat widget with toggle and close functionality
  - **Visibility**: Automatically hidden on login and welcome pages to maintain focus
  - **Branding**: Customized theme matching the Slooze design system (Rupee currency, primary blue)

## 📋 Assumptions

1. **Backend API**: All backend responses are mocked using Apollo Client's mock link
2. **Authentication**: JWT tokens are simulated; no actual backend validation
3. **Data Persistence**: Data resets on page refresh (in-memory storage)
4. **Role Assignment**: Based on email pattern (contains "manager" or not)
5. **Low Stock Threshold**: Products with stock < 10 are considered low stock
6. **Permissions**: Store Keepers can delete products (business requirement assumption)
7. **Field Restrictions**: Store Keepers can only edit stock when updating existing products

## 🎨 Design Decisions

1. **Tailwind CSS**: Chosen for rapid development and consistent design system
2. **Context API**: Sufficient for this app's state management needs
3. **App Router**: Leveraging Next.js 14's latest routing paradigm
4. **Mock Link**: Allows full GraphQL functionality without backend dependency
5. **localStorage**: Simple persistence for auth and theme (production would use httpOnly cookies)
6. **Animations**: Subtle CSS animations for better UX without performance impact

## 🔄 Future Enhancements

- [x] Slooze AI Assistant integration
- [ ] Real backend integration with NestJS + GraphQL
- [ ] Pagination for products list
- [ ] Advanced filtering and sorting
- [ ] Product images upload
- [ ] Audit logs for Manager
- [ ] Export data to CSV/Excel
- [ ] Real-time notifications
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

## 📝 Notes

- All code is production-ready with proper error handling
- TypeScript ensures type safety throughout the application
- Responsive design tested on multiple screen sizes
- Dark mode fully implemented across all pages
- No external UI libraries used (pure Tailwind CSS)
- Clean, commented, and maintainable code structure

## 📄 License

This project is created as a take-home assignment for Slooze.

---

**Built with ❤️ using Next.js, TypeScript, Tailwind CSS, and Apollo Client**