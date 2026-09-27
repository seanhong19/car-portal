import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import Registration from './pages/Registration';
import UserProfile from './pages/UserProfile';
import CarListing from './pages/CarListing';
import CarDetails from './pages/CarDetails';
import AddCarListing from './pages/AddCarListing';
import EditCarListing from './pages/EditCarListing';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { supabase } from './utils/supabaseClient';
import { ToastProvider } from './context/ToastContext';

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("user")));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  if (loading) {
    return <div>Loading authentication...</div>;
  }

  return (
    <ToastProvider>
      <Router>
        <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/registration" element={<Registration />} />
          <Route
            path="/user-profile"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/car-listing"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CarListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/car-details/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <CarDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-car"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <AddCarListing />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit-car/:id"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <EditCarListing />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </ToastProvider>
  )
}

export default App
