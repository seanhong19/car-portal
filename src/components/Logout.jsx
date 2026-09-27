import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { useToast } from '../context/ToastContext';

function Logout({ setIsLoggedIn }) {

    const navigate = useNavigate();
    const { showToast } = useToast();

    async function handleLogout() {
        await supabase.auth.signOut();
        localStorage.removeItem("user");
        setIsLoggedIn(false);
        showToast("Logged out successfully!", "info");
        navigate("/");
    }

    return (
        <button onClick={handleLogout}>Logout</button>
    )
}

export default Logout;