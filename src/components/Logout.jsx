import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';

function Logout({ setIsLoggedIn }) {

    const navigate = useNavigate();

    async function handleLogout() {
        await supabase.auth.signOut();
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