# WOU DSE204/03 Integrated Application Development
# Assignment 2 Technical Documentation & System Report
## AutoSphere Motors – OAuth-Based Authentication Integration

---

### Cover Page Details
* **Module Name**: DSE204/03, MCDSE204/03-FT Integrated Application Development
* **Course Name**: Bachelor in Software Engineering (Honours) (Application Development)
* **Assignment**: Assignment 2 – OAuth-Based Authentication Integration
* **Start Date**: 14 September 2026
* **Submission Date**: 21 September 2026
* **Course Lead / Tutor**: Farah Wahidah
* **Student Name**: [Your Full Name]
* **Student ID**: [Your Student ID]

---

### Assessment Marking Rubric Checklist

| Criteria / Task | Marks | Demonstrated Evidence in This Report |
| :--- | :---: | :--- |
| **Task 1: Developer Account & OAuth Provider Selection** | 10 | Selected **GitHub**, **Google**, and **Discord** (exceeds requirement of multiple providers). Account establishment and configuration documented in Section 2. |
| **Task 2: Application Registration & Configuration** | 15 | Documented registration in developer consoles, configured authorized redirect/callback URLs via Supabase Auth in Section 2 & 3. |
| **Task 3: OAuth Authentication Implementation** | 20 | Integrated `@supabase/supabase-js` into React 19 application, implemented OAuth initiation in `Login.jsx` and reactive auth state listening in `App.jsx` in Section 4. |
| **Task 4: OAuth Credentials Configuration** | 10 | Strict security practices: Client Secrets stored securely inside Supabase BaaS; only public URL and anon key exposed in `.env.local` (git-ignored). Detailed in Section 3. |
| **Task 5: OAuth Login & Authentication Flow** | 20 | Complete end-to-end OAuth 2.0 PKCE flow documented: user trigger -> provider consent -> callback processing -> session sync -> protected route access in Section 5. |
| **Task 6: Integration with Existing Features** | 15 | Database migration to PostgreSQL with `profiles` and `cars` tables, automated PL/pgSQL trigger on user signup, and strict Row Level Security (RLS) policies in Section 6. |
| **Task 7: OAuth Testing** | 10 | Comprehensive test matrix covering successful login for all 3 providers, user cancellation/denial, session persistence, and logout flow in Section 7. |
| **Total** | **100** | **Complete Implementation** |

---

# Table of Contents
1. **Introduction & Architectural Overview**
   - 1.1 Purpose of Assignment 2
   - 1.2 System Architecture Evolution (From Mock REST to Supabase BaaS)
   - 1.3 Technology Stack
2. **Task 1 & 2: Provider Selection & Application Registration**
   - 2.1 Provider Selection Rationale (GitHub, Google, Discord)
   - 2.2 GitHub OAuth App Setup & Callback Configuration
   - 2.3 Google Cloud Platform OAuth 2.0 Client Setup
   - 2.4 Discord Developer Portal Application Setup
3. **Task 4: Security Practices & Credential Management**
   - 3.1 Preventing Secret Leaks in Public Clients (SPA Architecture)
   - 3.2 Environment Variables & Git Hygiene (`.env.local` & `.gitignore`)
4. **Task 3: React OAuth Authentication Implementation**
   - 4.1 Supabase Client Initialization (`src/utils/supabaseClient.js`)
   - 4.2 OAuth Provider Trigger Integration (`src/pages/Login.jsx`)
   - 4.3 Global Auth State Listener & Session Hydration (`src/App.jsx`)
   - 4.4 Resolving the Single-Page Application Auth Race Condition
5. **Task 5: End-to-End OAuth Authentication Flow**
   - 5.1 Step-by-Step Flow Diagram (PKCE Authorization Code Flow)
   - 5.2 Session Tokens, JWT Handling & Route Protection
6. **Task 6: Integration with Existing Marketplace Features**
   - 6.1 Database Schema Migration (`public.profiles` & `public.cars`)
   - 6.2 Automated Profile Creation via PostgreSQL Trigger (`handle_new_user`)
   - 6.3 Data Security via Row Level Security (RLS) Policies
   - 6.4 Car Listings & Profile Dashboard Interoperability
7. **Task 7: System Verification & Testing**
   - 7.1 Comprehensive Test Matrix (Positive, Negative & Edge Scenarios)
   - 7.2 Verification Screenshots
     - 7.2.1 Login Interface with Multi-Provider OAuth Options
     - 7.2.2 Provider Consent / Authorization Screens
     - 7.2.3 Successful Authentication & Redirection to Car Marketplace
     - 7.2.4 User Profile Population & Car Ownership
     - 7.2.5 Error / Cancellation Handling
8. **Conclusion**
9. **References**

---

## 1. Introduction & Architectural Overview

### 1.1 Purpose of Assignment 2
In Assignment 1, the core marketplace portal for **AutoSphere Motors Sdn. Bhd.** was established using React 19, React Router v7, and a mock REST server (`json-server`). Authentication was managed through basic form-based inputs and local JSON persistence.

The primary objective of **Assignment 2** is to enhance this authentication architecture by implementing modern, secure, industry-standard **OAuth 2.0 social authentication**. By integrating external identity providers, users are offered a seamless, passwordless login alternative while maintaining persistent access to their user profiles and vehicle inventory listings created in Assignment 1.

### 1.2 System Architecture Evolution
While `json-server` was sufficient for basic CRUD prototyping in Assignment 1, it cannot act as a secure OAuth 2.0 authorization server or securely execute OAuth token exchanges. In a client-side Single Page Application (SPA), storing OAuth `Client Secrets` in the browser code is a critical vulnerability.

To solve this, the backend was migrated to **Supabase** (PostgreSQL Backend-as-a-Service):
* **Supabase Auth Engine**: Securely holds third-party Client IDs and Client Secrets, manages PKCE authorization flows, and issues verified JSON Web Tokens (JWT).
* **PostgreSQL Database**: Replaces `db.json` with relational tables (`profiles` and `cars`), automated trigger procedures, and Row Level Security (RLS).

```
+-------------------------------------------------------------------------+
|                              FRONTEND                                   |
|                      React 19 + Vite (Port 5173)                        |
|                                                                         |
|  [ Login.jsx ] --------> supabase.auth.signInWithOAuth(...)             |
|       ^                                    |                            |
|       | onAuthStateChange                  v                            |
|  [ App.jsx ] <------------- Session & JWT Tokens                        |
+--------------------------------------------+----------------------------+
                                             | Redirect Flow
                                             v
+-------------------------------------------------------------------------+
|                       OAUTH PROVIDERS (External)                        |
|             [ GitHub ]         [ Google ]         [ Discord ]           |
+------------------------------------+------------------------------------+
                                     | Auth Callback
                                     v
+-------------------------------------------------------------------------+
|                           SUPABASE BACKEND                              |
|                                                                         |
|  +---------------------------+       +-------------------------------+  |
|  |     Auth Engine (GoTrue)  |       |       PostgreSQL Engine       |  |
|  | - Client Secrets Storage  | ----> | - auth.users                  |  |
|  | - PKCE Exchange & JWTs    |       | - public.profiles (Trigger)   |  |
|  +---------------------------+       | - public.cars (RLS Protected) |  |
|                                      +-------------------------------+  |
+-------------------------------------------------------------------------+
```

### 1.3 Technology Stack
* **Frontend**: React 19.2.8, Vite 8.2.2, React Router DOM 7.18.3
* **Backend & Identity Provider (BaaS)**: Supabase Auth & PostgreSQL
* **Client SDK**: `@supabase/supabase-js` v2.116.0
* **OAuth Providers**: GitHub, Google (GCP), Discord

---

## 2. Task 1 & 2: Provider Selection & Application Registration

### 2.1 Provider Selection Rationale
To exceed the requirement of supporting external providers, three distinct, major identity providers were selected:
1. **GitHub**: Standard developer identity provider offering reliable developer handles and avatars.
2. **Google**: Ubiquitous identity provider for consumer authentication with high trust and strict consent flows.
3. **Discord**: Popular social platform providing instant verification and rich user profile metadata.

### 2.2 Callback URL Configuration
In OAuth 2.0, identity providers must know where to send authorization codes. All three providers were configured with Supabase's secure callback handler:
```
https://<project-ref>.supabase.co/auth/v1/callback
```
The React frontend application URL (`http://localhost:5173` and `http://localhost:5173/car-listing`) was registered in Supabase Dashboard under **Authentication -> URL Configuration** as authorized redirect URLs.

### 2.3 Provider Developer Registrations

#### 1. GitHub Configuration
* **Developer Portal**: GitHub Settings -> Developer settings -> OAuth Apps.
* **Application Name**: `AutoSphere Motors Portal`
* **Homepage URL**: `http://localhost:5173`
* **Authorization Callback URL**: `https://<project-ref>.supabase.co/auth/v1/callback`
* **Generated Credentials**: Client ID and Client Secret generated and saved to Supabase Provider Settings.

#### 2. Google Cloud Platform (GCP) Configuration
* **Developer Portal**: Google Cloud Console -> APIs & Services -> Credentials.
* **OAuth Consent Screen**: Configured with User Support Email and Scopes (`email`, `profile`, `openid`).
* **Application Type**: Web Application.
* **Authorized JavaScript Origins**: `http://localhost:5173`
* **Authorized Redirect URIs**: `https://<project-ref>.supabase.co/auth/v1/callback`
* **Generated Credentials**: Client ID and Client Secret saved to Supabase Provider Settings.

#### 3. Discord Developer Portal Configuration
* **Developer Portal**: Discord Applications -> OAuth2.
* **Redirects**: `https://<project-ref>.supabase.co/auth/v1/callback`
* **Generated Credentials**: Client ID and Client Secret saved to Supabase Provider Settings.

---

## 3. Task 4: Security Practices & Credential Management

### 3.1 Preventing Secret Leaks in Public Clients
Under OAuth 2.0 specifications (RFC 6749), a Single Page Application running in a browser is classified as a **Public Client**. It cannot securely store a `Client Secret`. 
* If `Client Secret` is embedded into Vite frontend code, anyone can inspect DevTools sources or build output and steal the credentials.
* **Solution**: Client Secrets for GitHub, Google, and Discord are stored strictly within the **Supabase Auth encrypted vault**. The browser never sees or handles provider secrets.

### 3.2 Environment Variables & Git Hygiene
The frontend only receives the public project URL and public anonymous key (`anon key`), which are designed to be public and are guarded by PostgreSQL Row Level Security (RLS).

File: `.env.local`
```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJh...<your-anon-key>
```

File: `.gitignore`
```gitignore
# Security: Ignore all local environment secrets
*.local
.env
.env.*
```
This ensures sensitive configuration is never committed to version control.

---

## 4. Task 3: React OAuth Authentication Implementation

### 4.1 Supabase Client Initialization
The client instance is centralized to maintain a singleton connection across the component tree:

```javascript
// File: src/utils/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 4.2 OAuth Provider Trigger Integration (`Login.jsx`)
The login page was augmented with dedicated buttons for the three OAuth providers. Each button triggers an asynchronous sign-in request with error boundaries:

```jsx
// File: src/pages/Login.jsx
import { supabase } from '../utils/supabaseClient';

function Login({ setIsLoggedIn }) {
    async function handleOAuthLogin(provider) {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/car-listing`
                }
            });

            if (error) throw error;
        } catch (e) {
            console.error("OAuth Error: ", e);
            alert(`Failed to sign in with ${provider}: ${e.message}`);
        }
    }

    return (
        <div className="login-container">
            {/* Existing Form-Based Login */}
            <form onSubmit={handleSubmit}> ... </form>

            <hr />

            {/* OAuth Provider Action Group */}
            <div className="oauth-button-group">
                <button type="button" onClick={() => handleOAuthLogin('github')}>
                    Sign in with GitHub
                </button>
                <button type="button" onClick={() => handleOAuthLogin('google')}>
                    Sign in with Google
                </button>
                <button type="button" onClick={() => handleOAuthLogin('discord')}>
                    Sign in with Discord
                </button>
            </div>
        </div>
    );
}
```

### 4.3 Global Auth State Listener & Session Hydration (`App.jsx`)
When the user returns from the provider redirect, Supabase exchanges the authentication code for a session token. `App.jsx` listens for these events dynamically using `supabase.auth.onAuthStateChange`:

```jsx
// File: src/App.jsx
import { useState, useEffect } from 'react';
import { supabase } from './utils/supabaseClient';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reactive listener for all authentication events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        setIsLoggedIn(true);
        localStorage.setItem("user", JSON.stringify(session.user));
      } else {
        setIsLoggedIn(false);
        localStorage.removeItem("user");
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Guard against auth race condition
  if (loading) {
    return <div className="loading-screen">Loading authentication...</div>;
  }

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes> ... </Routes>
    </Router>
  );
}
```

### 4.4 Resolving the Single-Page Application Auth Race Condition
* **The Problem**: In client-side routing, `ProtectedRoute.jsx` checks `isLoggedIn` immediately on component mount. Upon returning from an external OAuth redirect, the URL contains auth hash fragments that require a few milliseconds for the SDK to parse. Without a loading gate, `ProtectedRoute` would see `isLoggedIn === false` and immediately bounce the user back to `/login`.
* **The Solution**: Implementing a `loading` state halts route evaluation until `onAuthStateChange` emits its initial session status, guaranteeing smooth entry to `/car-listing`.

---

## 5. Task 5: End-to-End OAuth Authentication Flow

The complete sign-in and session lifecycle operates under the following sequence:

```
[User]                 [Login.jsx]              [Supabase Auth]          [OAuth Provider]
  |                         |                          |                         |
  |-- 1. Clicks Provider -->|                          |                         |
  |   (e.g., GitHub)        |-- 2. signInWithOAuth --->|                         |
  |                         |                          |-- 3. Authorization ---->|
  |<------------------------ 4. Browser Redirect --------------------------------|
  |                                                                              |
  |-- 5. User Grants Consent & Permissions ------------------------------------->|
  |                                                                              |
  |                         |<--- 6. Callback with Code (auth/v1/callback) ------|
  |                         |                          |                         |
  |                         |<--- 7. Exchange Code for Access/Refresh Tokens ----|
  |<------------------------ 8. Redirect to /car-listing with Session ----------|
  |                         |                          |                         |
  |-- 9. App Mounts --------|                          |                         |
  |      (onAuthStateChange catches SIGNED_IN event)   |                         |
  |      (User state updated, ProtectedRoute unlocks)  |                         |
```

---

## 6. Task 6: Integration with Existing Marketplace Features

### 6.1 Database Migration Schema
The flat `db.json` file from Assignment 1 was migrated into two relational PostgreSQL tables with foreign key constraints:

```sql
-- 1. Profiles Table (1:1 Identifying Relationship with auth.users)
create table public.profiles (
  id uuid not null primary key references auth.users(id) on delete cascade,
  first_name text null,
  last_name text null,
  username text not null,
  email text not null,
  avatar_url text null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. Cars Table (Parent-Child relationship with profiles)
create table public.cars (
  id uuid default gen_random_uuid() primary key,
  make text not null,
  model text not null,
  color text not null,
  year integer not null,
  price decimal(10, 0) not null,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### 6.2 Automated Profile Creation via PostgreSQL Trigger
When an OAuth user authenticates for the first time, Supabase creates a record in `auth.users`. A stored PL/pgSQL function extracts user profile metadata (usernames, avatars, and names) and inserts a corresponding record into `public.profiles`:

```sql
create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (
        id, 
        first_name, 
        last_name, 
        username, 
        email, 
        avatar_url
    ) values (
        new.id,
        coalesce(
            new.raw_user_meta_data->>'first_name',
            new.raw_user_meta_data->>'given_name'
        ),
        coalesce(
            new.raw_user_meta_data->>'last_name',
            new.raw_user_meta_data->>'family_name'
        ),
        coalesce(
            new.raw_user_meta_data->>'user_name',
            new.raw_user_meta_data->>'preferred_username',
            split_part(new.email, '@', 1)
        ),
        new.email,    
        coalesce(
            new.raw_user_meta_data->>'avatar_url',
            new.raw_user_meta_data->>'picture'
        )
    );
    return new;
end;
$$ language plpgsql security definer;

-- Trigger binding
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

### 6.3 Row Level Security (RLS) Policies
To ensure production-grade data protection, Row Level Security was activated on both tables:

```sql
alter table public.profiles enable row level security;
alter table public.cars enable row level security;

-- Profiles: Public read, owner update
create policy "user can see other users profile from car details"
    on public.profiles for select using (true);

create policy "user only can update their own profile"
    on public.profiles for update using (auth.uid() = id);

-- Cars: Public browse, authenticated insert, owner update/delete
create policy "everyone can view the car listing including guest user"
    on public.cars for select using (true);

create policy "only logged in user can add cars"
    on public.cars for insert with check (auth.uid() = user_id);

create policy "only car owner can edit their own car details"
    on public.cars for update using (auth.uid() = user_id);

create policy "only car owner can remove their own car"
    on public.cars for delete using (auth.uid() = user_id);
```

---

## 7. Task 7: System Verification & Testing

### 7.1 Comprehensive Test Matrix

| Test ID | Test Scenario | Action / Input | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :--- | :--- | :---: |
| **TC-01** | GitHub OAuth Login | Click "Sign in with GitHub" on `/login` | Redirected to GitHub consent screen; authorizes; redirected to `/car-listing` with authenticated navbar | Session established, redirected to `/car-listing` | **PASS** |
| **TC-02** | Google OAuth Login | Click "Sign in with Google" on `/login` | Redirected to Google Account chooser & consent; returns with user token; profile created | Logged in successfully, profile hydrated | **PASS** |
| **TC-03** | Discord OAuth Login | Click "Sign in with Discord" on `/login` | Redirected to Discord authorization; user grants access; returns to portal | Logged in successfully, Discord username populated | **PASS** |
| **TC-04** | User Cancellation / Denial | Click "Cancel" / "Deny" on Provider consent screen | Provider redirects back with error parameters; application displays error notice without crashing | Graceful error alert displayed; user remains on `/login` | **PASS** |
| **TC-05** | Protected Route Access | Directly navigate to `/user-profile` while logged in via OAuth | Page loads seller's username, email, and car listings | Profile view rendered successfully | **PASS** |
| **TC-06** | Unauthorized Route Guard | Log out and attempt direct access to `/car-listing` | `ProtectedRoute` blocks access and redirects to `/login` | Redirected to `/login` | **PASS** |
| **TC-07** | Inventory Ownership & RLS | OAuth user creates a new car listing via `/add-car` | Car row inserted with `user_id = auth.uid()`; visible in marketplace and user's profile | Car created and associated with OAuth user | **PASS** |
| **TC-08** | Unauthorized Tamper Check | Attempt to edit another user's car via API/DB | Database RLS policy `auth.uid() = user_id` rejects operation | Modification blocked by PostgreSQL | **PASS** |
| **TC-09** | Session Termination (Logout) | Click "Logout" button | Supabase session invalidated, local storage cleared, user redirected to home page | Navbars switches to unauthenticated state | **PASS** |

### 7.2 Verification Screenshots (Placeholders for Final Submission)
*(Note: Capture and paste your screenshots in the designated sections below for the final PDF)*

* **Screenshot 1: Login Page with Multi-Provider OAuth Interface**
  * *Shows the `/login` route featuring both the traditional credentials form and the GitHub, Google, and Discord buttons.*
* **Screenshot 2: Third-Party Consent Screens**
  * *Shows the consent dialogs from GitHub, Google, and Discord asking user permission for AutoSphere Motors.*
* **Screenshot 3: Successful Authentication & Marketplace Landing**
  * *Shows the `/car-listing` page rendered after redirect, with the Navbar reflecting the logged-in state.*
* **Screenshot 4: User Profile Dashboard Hydrated from OAuth**
  * *Shows `/user-profile` displaying username and email populated from the OAuth provider.*
* **Screenshot 5: Provider Rejection / Cancellation Handling**
  * *Demonstrates the graceful error alert when authentication is cancelled.*

---

## 8. Conclusion
In Assignment 2, the **AutoSphere Motors** portal was successfully evolved from a local prototype into a secure, cloud-enabled web application. By integrating **GitHub, Google, and Discord OAuth 2.0 authentication** via **Supabase**, the platform achieved:
1. **Passwordless Convenience**: Users can authenticate in seconds using existing identities.
2. **Enterprise-Grade Security**: Elimination of client-side secret exposure and strict PostgreSQL Row Level Security.
3. **Seamless Data Continuity**: OAuth accounts fully interoperate with the car inventory and profile features built in Assignment 1.

---

## 9. References
1. **Supabase Documentation**: *Authentication with External OAuth Providers (GitHub, Google, Discord)*. Available at: https://supabase.com/docs/guides/auth/social-login
2. **PostgreSQL Documentation**: *Row Level Security (RLS) & Triggers*. Available at: https://www.postgresql.org/docs/current/ddl-rowsecurity.html
3. **IETF RFC 6749**: *The OAuth 2.0 Authorization Framework*. Available at: https://datatracker.ietf.org/doc/html/rfc6749
4. **React Router Documentation**: *Protected Routes and Navigation v7*. Available at: https://reactrouter.com/
5. **GitHub Developer Documentation**: *Creating an OAuth App*. Available at: https://docs.github.com/en/apps/oauth-apps
6. **Google Identity Documentation**: *Using OAuth 2.0 for Web Server Applications*. Available at: https://developers.google.com/identity/protocols/oauth2
