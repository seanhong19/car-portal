# Senior Engineer Mentorship & Project Log

This document serves as our persistent engineering reference for the **AutoSphere Motors Used Car Marketplace Portal** project. It outlines the mentorship parameters, current architecture, code evolution history, and key software engineering concepts discussed. It will be continuously updated as we work together.

---

## 1. Mentorship Role & Operating Protocols

* **Role**: Senior Software Engineer & Mentor.
* **Core Principles**:
  1. **Guidance & Mentorship Only**: Focus on system design, architecture, code reviews, and reasoning. Never provide full source-code solutions or write the code for you.
  2. **Hint Gating**: Provide conceptual explanations and leading questions initially; technical hints are unlocked only after you ask about the same topic twice.
  3. **Code Review Standards**: Treat all code with production-grade engineering scrutiny (readability, error boundaries, performance, accessibility, and security).

---

## 2. Project Architecture & Assignment Scope

* **Course**: DSE204/03, MCDSE204/03-FT Integrated Application Development
* **Client / Scenario**: AutoSphere Motors Sdn. Bhd. (Used Car Marketplace Portal)
* **Tech Stack**:
  * **Frontend**: React 19, Vite, React Router v7 (`react-router-dom`)
  * **HTTP Client**: Axios (configured via centralized instance)
  * **Mock REST Backend**: `json-server` running on port 5000 (`db.json`)
* **Core Modules Required**:
  1. Registration (`/registration`)
  2. Login (`/login`)
  3. Car Listing & Search/Filter (`/car-listing`)
  4. Car Details (`/car-details/:id`)
  5. Add Car Listing (`/add-car`)
  6. Edit Car Listing (`/edit-car/:id`)
  7. User Profile (`/user-profile`)
  8. Home Page (`/`)

---

## 3. What the Codebase Is Currently Doing

### Routing (`src/App.jsx`)
* Declares standard routing with `<BrowserRouter>`, `<Routes>`, and `<Route>` covering all primary page views.

### API & Service Layer (`src/api/` & `src/services/`)
* **`src/api/axios.js`**: Centralized Axios client instance configured with `baseURL: "http://localhost:5000"` and standard `Content-Type: application/json` headers.
* **`src/services/userService.js`**: Houses user endpoints (`getUsers`, `getUserByEmail`, `addUser`, `updateUser`).
* **`src/services/carService.js`**: Houses car CRUD endpoints (`getCar`, `getCarById`, `addCar`, `updateCar`, `deleteCar`).

### Registration Page (`src/pages/Registration.jsx`)
* Extracts form values using native `FormData` and `Object.fromEntries()`.
* Compares `password` and `confirmPassword` using early guard clauses.
* Strips `confirmPassword` from the database payload via rest destructuring: `const { confirmPassword, ...userData } = formValues;`.
* Asynchronously queries the backend via `getUserByEmail` to check for existing accounts before writing.
* Calls `addUser(userData)` on the service layer, provides feedback, resets the form, and redirects to `/login` using `useNavigate()`.
* Implements accessible labels linked via matching `htmlFor` and `id` attributes.

### Login Page (`src/pages/Login.jsx`)
* Collects `email` and `password`.
* Queries `getUserByEmail(formValues.email)`.
* Verifies credentials against the first returned record (`response.data[0].password`).
* Handles success feedback and navigation to `/car-listing`.

### Database (`db.json`)
* Managed via `json-server --watch db.json --port 5000` with `users` and `cars` collections.

---

## 4. History of Code Evolution & Iterations

| Milestone | Initial Implementation | Refactored Senior Pattern | Rationale |
| :--- | :--- | :--- | :--- |
| **Form Data Extraction** | Uncontrolled without state | `new FormData(e.target)` + `Object.fromEntries()` | Avoided unnecessary state re-renders for read-only form submission. |
| **Axios Initialization** | `axios.get({ baseURL: ... })` | `axios.create({ baseURL, headers })` | `.get()` triggers an immediate HTTP call; `.create()` configures a reusable instance. |
| **Service Layering** | Direct Axios calls considered | Dedicated `userService.js` & `carService.js` | Meets Assignment Task 4 for reusable, organized REST communication. |
| **Payload Sanitization** | Full form values including confirmation | `const { confirmPassword, ...userData } = formValues` | Security best practice: never store confirmation fields in database records. |
| **Async Operations** | Synchronous execution without `await` | `async handleSubmit(e)` + `await` on all promises | Prevents premature execution and allows `try...catch` to catch real network failures. |
| **Control Flow Architecture** | Deeply nested `if/else` pyramid | Guard clauses with early `return;` | Flattened indentation and vastly improved maintainability. |
| **React Hook Rules** | `useNavigate()` called inside event handler | `const navigate = useNavigate()` at component root | Adheres to React's lifecycle rules where hooks cannot be called in inner callbacks. |
| **Label Accessibility** | Only `name` attributes present | Added corresponding `id` matching `htmlFor` | Links screen readers and allows clicking label text to focus the input. |
| **Query Result Parsing** | Attempted `response.data.password` | Corrected to `response.data[0].password` | Learned that REST filter parameters (`?email=...`) return an array of matches, not an object. |

---

## 5. Key Engineering Lessons Covered

### A. React Rules of Hooks
* Hooks (`useState`, `useEffect`, `useNavigate`) rely on predictable call orders during render cycles.
* They **must always** be placed at the top level of functional components, never inside conditions, loops, or event callbacks.

### B. REST API Query Filters vs. Direct Lookups
* `GET /users/:id` $\rightarrow$ Target by unique primary key $\rightarrow$ Returns a single Object `{ ... }`.
* `GET /users?email=...` $\rightarrow$ Collection filter $\rightarrow$ Always returns an Array `[ { ... } ]`, requiring array index or iteration access.

### C. `name` vs. `id` in Web Forms
* `name`: Payload key used by `FormData` and form submission.
* `id`: Unique DOM identifier used for accessibility (`<label htmlFor="...">`), styling, and scripts.

### D. Professional Git Practices
* **Branching**: Never commit directly to `main`. Create descriptive feature branches (`feat/user-registration`, `feat/auth-login`).
* **Atomic Commits**: Commits are measured by **logical completeness**, not file counts. A commit should encapsulate a tested, working milestone that leaves the build green.
* **Conventional Commits**: Format messages imperatively with types (`feat`, `fix`, `refactor`, `chore`).

### E. What Defines Senior Software Engineering
* It is not syntax memorization (seniors Google and check docs daily).
* It is **systemic thinking**: anticipating failure modes (unhappy path, network latency, edge cases), maintaining architecture, security considerations, and understanding runtime mechanics.

### F. Authentication State & Conditional Navigation
* **Post-Login Routing UX**: Rather than forcing users to a transactional page (like `/add-car`), redirecting to Home (`/`) or Marketplace (`/car-listing`) with an authenticated Navbar creates an intuitive user journey.
* **Session Persistence**: React needs a mechanism (e.g. `localStorage` or `Context`) so that sibling/parent components like a shared `Navbar` know a user is logged in.

### G. Web Security: Is `localStorage` Safe for User Data?
* **Why Client Storage is Needed**: JavaScript memory (React state) is wiped on every browser refresh. Persistent storage keeps the user logged in across page reloads.
* **Security Risks of `localStorage`**: Vulnerable to Cross-Site Scripting (XSS). Any third-party script running on the page can inspect `localStorage`. Sensitive data (passwords, credit cards) should **never** be stored there.
* **Production Standard (HttpOnly Cookies)**: Real-world production apps use server-managed cookies with `HttpOnly` and `SameSite` flags, making authentication tokens completely inaccessible to JavaScript.
* **Academic/Mock Context**: In `json-server` mock environments, storing basic non-sensitive profile info (e.g., `{ id, username }`) in `localStorage` is standard practice for simulating session persistence.

### H. SQL Injection vs. IDOR (Insecure Direct Object Reference)
* **SQL Injection**: Occurs when raw backend SQL queries concatenate un-sanitized user strings. Prevented on the backend using parameterized queries and ORMs.
* **IDOR / Client Impersonation**: The real risk of storing plain `id` in `localStorage`. If the backend doesn't verify cryptographically signed tokens (e.g. JWT), a user could alter their stored `id` in DevTools to impersonate another user.

### I. React Props, State, and `localStorage` Reactivity
* **Props Destructuring**: React functional components receive a single `props` object. To read individual properties, use object destructuring: `function Navbar({ isLoggedIn })`.
* **The Reactivity Problem with `localStorage`**: `localStorage` is not reactive; changes to `localStorage` do not automatically trigger a React component re-render. A component re-renders only when **state** or **props** change.

### J. How React Passes Props Under the Hood
* When you write `<Navbar isLoggedIn={true} />`, React does **not** call `Navbar(true)`.
* React calls `Navbar({ isLoggedIn: true })`. Every JSX prop is gathered into a single object (`props`).
* Writing `function Navbar(isLoggedIn)` names the object parameter `isLoggedIn`—making it an object `{ isLoggedIn: true }` instead of a boolean.
* Destructuring `{ isLoggedIn }` extracts the boolean property directly from that object.

### K. The Reactivity Gap: Plain Variable vs. `useState`
* Writing `const isLoggedIn = Boolean(localStorage.getItem("user"));` calculates the value **only when `App` renders**.
* When `Login.jsx` or `Logout.jsx` mutates `localStorage`, React has no idea.
* **The Rule**: In React, a component only re-renders when its **state** (`useState`) or its **props** change. To make login/logout reactive in real time without refreshing, `isLoggedIn` (or `user`) must be held in a state hook with a setter function passed to the components that change it.

### L. Passing State Setters via Props (Callback Props)
* Setters returned from `useState` (`setIsLoggedIn`) are standard JavaScript functions.
* They can be passed down as props to child components just like strings or booleans:
  `<Login setIsLoggedIn={setIsLoggedIn} />`
* Child components accept them in their props destructuring (`function Login({ setIsLoggedIn })`) and invoke them (`setIsLoggedIn(true)`) to notify the parent when an action occurs.

### M. Unidirectional Data Flow (Lifting State Up) Validated
* **The Mental Model**: State lives at the highest common ancestor (`App.jsx`).
* **Triggering Changes**: When `Login` or `Logout` calls `setIsLoggedIn(...)`, it invokes the setter directly on `App.jsx`.
* **Re-render Cycle**: `App.jsx` re-renders with the new state $\rightarrow$ passes updated `isLoggedIn` prop down to `<Navbar />` $\rightarrow$ `Navbar` evaluates ternary $\rightarrow$ UI updates seamlessly.

### N. Functions as References: Why Callbacks Bypass Intermediate Components
* **Passing by Reference**: In JavaScript, passing a function as a prop does not create a chain of intermediaries. You are passing a direct **memory reference (pointer)** to `App.jsx`'s setter.
* **Direct Execution**: When `Logout` executes `setIsLoggedIn(false)`, it executes the function in `App`'s context directly. `Navbar` does not intercept, relay, or know that the function was just invoked.
* **Prop Drilling**: Passing a prop through intermediate components (like `Navbar`) solely so a grandchild (`Logout`) can access it is called "Prop Drilling".

### O. Deep Nesting & The Problem with Prop Drilling at Scale
* **What 10-Level Nesting Looks Like**: In large enterprise applications (e.g. e-commerce dashboards), a leaf component like `LogoutButton` might sit inside `App -> Layout -> Header -> Nav -> Menu -> Dropdown -> Section -> Item -> Button`.
* **The Problem**: 7 intermediate components must accept and forward `setIsLoggedIn`, even though they never use it. This introduces code clutter, coupling, and maintenance friction.
* **The Solution (React Context / Global Stores)**:
  * **React Context (`createContext`, `useContext`)**: Acts like a "Wi-Fi broadcast." The root component provides data to the airwaves, and any child at any depth tunes in directly using `useContext()`, bypassing all middlemen.
  * **When to use what**: For 1–2 levels (`App -> Navbar -> Logout`), prop drilling is simple and ideal. For deeply nested or app-wide shared state, Context/Zustand/Redux is preferred.

### P. State Initialization on Refresh & Next Milestones
* **Surviving Browser Refresh**: Hardcoding `useState(false)` resets the auth state on every page refresh. Initializing with `useState(Boolean(localStorage.getItem("user")))` ensures persistent login across reloads.
* **Next Module**: Moving to `AddCarListing.jsx` or `CarListing.jsx` to establish the car inventory CRUD operations as per Assignment Task 6.

### Q. Relational Data Modeling in Mock REST APIs (Owner Association)
* **Foreign Key Concept**: In `db.json`, each car record should contain a field (e.g. `userId` or `sellerId`) referencing the `id` of the user who created it.
* **Attaching Owner Data**: During car submission, read the stored user from `localStorage`, parse it with `JSON.parse()`, and attach `userId: currentUser.id` into the payload before sending it to `addCar()`.
* **Downstream Benefits**:
  * **User Profile**: Enables filtering user-specific inventory via `GET /cars?userId=...`.
  * **Authorization**: Enables edit/delete access control by verifying `car.userId === currentUser.id`.

### R. Protected Routes & Route Guards (DRY Pattern)
* **The Anti-Pattern**: Copy-pasting `if (!user) navigate('/login')` inside every restricted page component.
* **The Senior Pattern (Protected Route Wrapper)**: A reusable component (e.g., `<ProtectedRoute>`) that inspects auth status in one central place. If authenticated, it renders `children`; if not, it redirects using React Router's `<Navigate to="/login" replace />`.

### S. React `children` Prop & Browser History `replace`
* **`children` Prop (Component Composition)**: In React, any JSX placed between opening and closing tags (e.g., `<Wrapper><Page /></Wrapper>`) is automatically passed into `Wrapper` as a prop called `children`. Returning `children` renders the wrapped page without the wrapper needing to know what page it is.
* **`replace` in Browser History Stack**:
  * Default navigation (`push`): Adds a new entry to the browser's back/forward history.
  * Without `replace`: User goes `Home -> /add-car -> /login`. Clicking browser "Back" goes to `/add-car`, which immediately redirects back to `/login` (the "Back Button Trap").
  * With `replace`: `/add-car` is overwritten by `/login` in history (`Home -> /login`). Clicking "Back" cleanly returns to `Home`.

### T. The "Single Props Object" Rule in React Signatures
* React components **only ever receive one argument**: the `props` object.
* Writing `function Component({ a }, b)` treats `b` as a second function argument (which React does not provide, making `b` `undefined`).
* Both `isLoggedIn` and `children` exist inside that **same single props object**: `function Component({ isLoggedIn, children })`.

### U. Fetching Data on Mount: `useEffect` & Asynchronous State
* **The Promise Trap**: Calling `const cars = getCar()` directly in the component body assigns an unresolved `Promise` to `cars`. Invoking `cars.map()` crashes with `cars.map is not a function`.
* **The React Pattern**: Fetching data on component load is a **side effect**. It belongs inside `useEffect(() => { ... }, [])`. Data is fetched asynchronously and saved into a `useState([])` state variable.
* **Property Naming**: In `db.json`, the user record key is `user.id`, not `user.userId`.
* **Feature Scope (Marketplace vs. Profile)**:
  * `CarListing.jsx`: The marketplace displaying **all cars** (`getCar()`) with search/filter.
  * `UserProfile.jsx`: Displays **user-specific cars** (`getCarByUserId(user.id)`).

### V. Why React Components Cannot Be `async` & The `useEffect` Pattern
* **Why Component Functions Cannot Be `async`**:
  * An `async function` automatically returns a `Promise`.
  * React client components must return synchronous JSX (`<div>...</div>`). React cannot render a Promise.
* **The Infinite Re-Render Trap**: Calling `setCars(...)` directly in the component body triggers a re-render $\rightarrow$ which runs the body again $\rightarrow$ calls `setCars(...)` again $\rightarrow$ infinite loop crash.
* **The Standard Pattern**:
  * Keep the component function synchronous.
  * Place a `useEffect(() => { ... }, [])` hook inside.
  * Inside `useEffect`, define a helper function (`async function fetchCars() { ... }`), call it, and update state (`setCars(response.data)`).

### W. The 3 Stages of React Data Fetching (Memory vs. Timing)
1. **Stage 1 (No Hooks)**: `const cars = getCar()` $\rightarrow$ Fails because `cars` is a Promise, not an Array. `.map()` crashes synchronously.
2. **Stage 2 (`useState` only)**: `setCars(response.data)` in render body $\rightarrow$ Infinite re-render loop. Every state update triggers a re-render that triggers another state update.
3. **Stage 3 (`useState` + `useEffect`)**:
   * **`useState` provides Memory**: Holds data across renders and triggers UI updates when populated.
   * **`useEffect` provides Timing**: Decouples network I/O from rendering and ensures data is fetched only once on mount (`[]`).

### X. Semantic Navigation (`<button>` vs. `<Link>`) & Dynamic Routing
* **`<button>` vs. `<Link>`**:
  * Use `<button>` for in-page actions (submit, delete, modal toggle).
  * Use `<Link>` from `react-router-dom` for navigation to a URL. This preserves accessibility, browser history, and right-click "Open in new tab".
* **Dynamic Route Parameters (`/car-details/:id`)**:
  * Wrap the card or a "View Details" anchor with `<Link to={`/car-details/${car.id}`}>`.
  * The receiving page (`CarDetails.jsx`) extracts the parameter using React Router's `useParams()` hook (`const { id } = useParams()`).

### Y. Dynamic Parameter Re-fetching: `useEffect` Dependency Array (`[id]`)
* **The Dependency Array in Action**: When navigating between dynamic routes (e.g. `/car-details/1` to `/car-details/2`), React does not unmount and remount the component.
* **Why `[id]` Matters**: Placing `[id]` in `useEffect(..., [id])` tells React to re-run the effect whenever the URL parameter changes, fetching the new car's data and keeping the view synchronized.
* **Loading States**: During the initial asynchronous fetch, state is empty `{}`. Adding a guard (`if (!carDetails.id) return <p>Loading...</p>`) prevents rendering empty templates before network resolution.

### Z. User Profile as the Management Hub & Form Pre-population (Edit Flow)
* **The Edit Architecture**:
  1. Extract `:id` via `useParams()`.
  2. Fetch existing data on mount with `getCarById(id)`.
  3. Pre-fill form inputs with the fetched data.
  4. Submit updates via `updateCar(id, updatedData)` (HTTP `PATCH` or `PUT`).
* **Why User Profile First**:
  * `UserProfile.jsx` acts as the Seller Dashboard.
  * Queries `getCarByUserId(user.id)` to show only the logged-in user's cars.
  * Provides the intuitive UI entry points: an **"Edit"** link (`/edit-car/:id`) and a **"Delete"** button (`deleteCar(id)`).

### AA. REST Endpoint Design: Path Param (`/users/:id`) vs Query Filter (`/users?id=`)
* **Path Parameter (`/users/${id}`)**: Requests a single distinct resource by primary key. Returns a single Object `{ id, username, ... }`.
* **Query Parameter (`/users?id=${id}`)**: Treats the request as a collection search/filter. Returns an Array `[ { ... } ]`. Setting array to `userData` causes `userData.username` to evaluate to `undefined`.
* **Console Logging Trap**: `console.log("data: " + response.data)` converts the object to string (`"[object Object]"`). Always use a comma (`console.log("data: ", response.data)`) to inspect real data structures in DevTools.

### AB. User Profile Triad Bug Review: Foreign Key Query, Initial State, & Arrow Return
1. **Foreign Key Filter in `carService.js`**: Calling `GET /cars/${userId}` looks for a car whose primary key is `userId` (returns 404). To find all cars belonging to an owner, query by foreign key: `GET /cars?userId=${userId}`.
2. **Initial State for Lists**: Initializing `cars` as `{}` crashes `.map()`. Lists must initialize as `useState([])`.
3. **Arrow Function Body `{}` vs. Expression `()`**:
   * Curly braces `{}` require an explicit `return`: `cars.map(car => { return <Link... />; })`.
   * Parentheses `()` provide an implicit return: `cars.map(car => ( <Link... /> ))`. Without `return`, `.map()` returns `undefined`.

### AC. Pre-populating Edit Forms: `defaultValue` vs. Controlled Inputs
* **The Edit Logic Validated**: Extract `id` with `useParams` $\rightarrow$ fetch with `getCarById(id)` in `useEffect` $\rightarrow$ pre-fill form $\rightarrow$ submit via `updateCar(id, carData)`.
* **Technique 1 (`defaultValue` with Loading Guard)**:
  * Keep the form uncontrolled with `new FormData(e.target)`.
  * Supply `defaultValue={car.make}` on inputs.
  * Essential Guard: If `!car.id`, render `<p>Loading car data...</p>`. This ensures the inputs do not mount until the fetched data is ready.
* **Technique 2 (Controlled Form with `value` & `onChange`)**:
  * Inputs bind to `value={car.make}` and update on every keystroke via `setCar({ ...car, make: e.target.value })`.

### AD. HTTP PATCH Semantics & ID Preservation
* **How `PATCH /cars/:id` Works**: In REST (and `json-server`), a `PATCH` request targets a specific resource by its URL `:id`. The server updates only the fields provided in the body (`model`, `price`, etc.) and **preserves the existing primary key `id`**.
* **Verification via Git Diff**: Checking the database diff shows that modifying a car (e.g. `model: "F19"` $\rightarrow$ `"F18"`) keeps `id: "Gbuk1XlvGTo"` completely unchanged.

### AE. Assignment 1 Pre-Styling Audit & Gap Analysis
Before finalizing CSS styling, an audit against the **Assignment 1 Brief** reveals two missing functional requirements:
1. **Task 5 (HTTP DELETE Method)**: The brief mandates demonstrating **all 4 HTTP methods** (GET, POST, PUT/PATCH, and **DELETE**). `deleteCar(id)` is in `carService.js`, but needs a "Delete" button in `UserProfile.jsx` to demonstrate deletion.
2. **Task 6f & Scenario (Search/Filter Interface)**: The brief explicitly requires: *"search for available cars based on Make, Model, Year of Registration, and Price Range"*. This needs a filter form/input on `CarListing.jsx`.
3. **Task 6a (Home Page)**: Needs a basic landing hero with CTA navigation.

### AF. UI Synchronization on DELETE (`Array.filter`) & HTML Nesting
* **Synchronizing UI State on Delete**: Deleting a record from `db.json` via `deleteCar(id)` updates the database, but does not update React's memory. To remove the item from the screen instantly without page reload, filter the state: `setCars(prevCars => prevCars.filter(car => car.id !== id))`.
* **HTML Accessibility Rule**: Avoid nesting `<Link>` inside `<button>` (`<button><Link>...</Link></button>`). Both are interactive elements. Use a styled `<Link className="...">` instead.

### AG. Deep Dive: Functional State Updates & React Immutability
* **Direct Passing vs. Updater Function**:
  * `setCars(cars.filter(...))`: Relies on the closure's snapshot of `cars`. If multiple updates queue, it may use stale state.
  * `setCars(prev => ...)`: Guarantees React supplies the latest, authoritative state value at the exact moment of execution.
* **The Rule of Immutability in React**:
  * In React, state must never be mutated in-place (avoid `splice()`, `push()`, `pop()`).
  * React relies on **Reference Equality** (`oldArray === newArray`). Mutating in-place keeps the same reference, causing React to skip re-renders.
  * `.filter()` returns a **new array in memory**, signaling to React that state has changed and triggering an instant UI re-render.

### AH. The Full Journey: From `db.json` to `prevCars`
1. **Initial Load (`useEffect`)**:
   * `getCarByUserId()` fetches the array from `db.json`.
   * `setCars(response.data)` puts that `db.json` array into React's state memory.
2. **On Delete (`handleDelete`)**:
   * Calling `setCars(prevCars => ...)` asks React for what's currently in state.
   * React automatically injects the array from Step 1 into `prevCars`.
3. **The `.filter()` Loop**:
   * `.filter()` is an internal `for` loop. It visits every car in `prevCars`, tests `car.id !== id`, and collects the survivors into a new array.

### AI. Multi-Criteria Search & Filter Interface (Task 6f)
* **Single vs. Composite Predicates**: Filtering by one field checks one condition. Filtering across multiple criteria (Make, Model, Year, Price Range) uses composite boolean logic:
  * Each filter is optional: if empty/blank, it passes (`true`).
  * If populated, it must satisfy the comparison (e.g. `Number(car.price) >= minPrice`).
* **The "Pass-Through" Rule**:
  * Make: `!make || car.make.toLowerCase().includes(make.toLowerCase())`
  * Model: `!model || car.model.toLowerCase().includes(model.toLowerCase())`
  * Price Range: `(!minPrice || Number(car.price) >= minPrice) && (!maxPrice || Number(car.price) <= maxPrice)`
* **Component Encapsulation**: A dedicated `<FilterBar />` or inline filter controls keep `CarListing.jsx` organized.

### AJ. Global Search (Omnibar) vs. Range Filtering (UX Trade-offs)
* **Global Omnibar (Text Matches)**: One unified search input checking `car.make || car.model || car.year`. High convenience, low visual clutter.
* **The Range Constraint (Price Range)**: Text search checks string inclusion, but "Price Range" is a mathematical inequality (`price <= maxPrice`). A user typing "50000" in text search only finds cars with the exact string "50000", not cars under $50,000.
* **The Hybrid Solution (Best of Both Worlds)**:
  1. One primary Search input (handles Make, Model, Year).
  2. One Max Price input or dropdown (handles Price Range inequality).































