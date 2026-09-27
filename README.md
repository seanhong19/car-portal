# AutoSphere Motors – Used Car Marketplace Portal
**Full-Stack Integration Project**  
*Course:* DSE204/03, MCDSE204/03-FT Integrated Application Development  
*Institution:* Wawasan Open University  

---

## 1. Project Overview
AutoSphere Motors is a modern, responsive, full-stack Used Car Marketplace Portal built with **React 19**, **Vite**, and **Supabase (PostgreSQL & GoTrue Auth)**. The application allows users to browse, search, and filter vehicle inventory, authenticate securely via multiple OAuth 2.0 identity providers or email credentials, manage their user profiles, and publish, update, or remove car listings protected by Row Level Security (RLS).

---

## 2. Key Features

- **Authentication & OAuth 2.0**:
  - Multi-provider social login (**Google**, **GitHub**, **Discord**) via Supabase Auth (PKCE flow).
  - Standard email/password registration with strict client-side password strength validation (minimum 8 characters, uppercase, lowercase, numbers, and special symbols).
  - Protected route wrappers ensuring authenticated-only access to private portal views.
- **Profile Management**:
  - Secure profile dashboard reflecting verified identity details (name, email) as read-only.
  - In-place editable contact information (phone number, home address) saved to the database.
- **Car Inventory & Advanced Multi-Criteria Filtering**:
  - Real-time filtering across **Make**, **Model**, **Year**, **Registration State**, and **Price Range** (min/max).
  - Dedicated listing details view showing complete vehicle specifications.
- **Listing Lifecycle Management (CRUD)**:
  - Add, edit, and delete car listings with ownership verification and PostgreSQL foreign key cascade.
- **Modern Responsive UI & UX**:
  - Custom zero-dependency **Toast Notification System** (`ToastContext`) floating in the bottom-right corner.
  - Mobile-friendly responsive grid layout with CSS custom properties (design tokens) and zero external CSS libraries.

---

## 3. Technology Stack

- **Frontend**: React 19, Vite, React Router v7 (`react-router-dom`)
- **Backend / Database**: Supabase (PostgreSQL, GoTrue Auth Engine, Row Level Security)
- **API Client**: Supabase JS SDK (`@supabase/supabase-js`)
- **Styling**: Vanilla CSS with CSS Grid, Flexbox, Design Tokens (`:root`), and Responsive Media Queries

---

## 4. Project Directory Structure

```text
car-portal/
├── src/
│   ├── api/            # Centralized API clients
│   ├── components/     # Reusable UI components (Navbar, CarCard, CarCardDetails, ProtectedRoute)
│   ├── context/        # React Context providers (ToastContext)
│   ├── pages/          # Application views (Home, Login, Registration, CarListing, CarDetails, UserProfile, etc.)
│   ├── services/       # Service layer abstractions (carService.js, userService.js)
│   ├── utils/          # Supabase client initialization
│   ├── App.jsx         # Root router configuration & auth state listener
│   ├── index.css       # Unified design system & responsive styling
│   └── main.jsx        # React application entry point
├── .env.example        # Environment variable template
├── package.json        # Project dependencies and npm scripts
└── README.md           # Project setup and documentation
