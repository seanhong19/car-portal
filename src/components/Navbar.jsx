import { Link } from "react-router-dom";
import Logout from "./Logout";

function Navbar({ isLoggedIn, setIsLoggedIn }) {
    return (
        <nav className="navbar">
            <Link to="/" className="nav-brand">
                AutoSphere
            </Link>
            {isLoggedIn ?
                (
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/car-listing">Car Listing</Link></li>
                        <li><Link to="/add-car">Add Car</Link></li>
                        <li><Link to="/user-profile">Profile</Link></li>
                        <li><Logout setIsLoggedIn={setIsLoggedIn} /></li>
                    </ul>
                ) : (
                    <ul className="nav-links">
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/login">Login</Link></li>
                        <li><Link to="/registration">Register</Link></li>
                    </ul>
                )
            }
        </nav>
    )
}

export default Navbar;