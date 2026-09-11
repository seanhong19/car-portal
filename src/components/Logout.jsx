import { useNavigate } from 'react-router-dom';

function Logout({ setIsLoggedIn }) {

    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        alert("Logout successfully!");
        navigate("/");
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    )
}

export default Logout;