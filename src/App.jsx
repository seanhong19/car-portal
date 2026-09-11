import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
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

function App() {

  const [isLoggedIn, setIsLoggedIn] = useState(Boolean(localStorage.getItem("user")));

  return (
    <>
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
    </>
  )
}

export default App
