import { useNavigate } from "react-router-dom";
import { supabase } from '../utils/supabaseClient';

function Login({ setIsLoggedIn }) {

    const navigate = useNavigate();

    async function handleOAuthLogin(provider) {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: provider,
                options: {
                    redirectTo: `${window.location.origin}/car-listing`
                }
            })

            if (error) throw error;
        } catch (e) {
            console.log("OAuth Error: ", e);
            alert(`Failed to sign in with ${provider}: ${e.message}`)
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email: formValues.email,
                password: formValues.password,
            });

            if (error) throw error;

            alert("Login Success");

            form.reset();

            setIsLoggedIn(true);

            navigate("/car-listing");

        } catch (e) {
            console.log(e)
            alert(e.message || "Email or Password is not correct!");
        }

    }

    return (
        <>
            <h1>This is Login Page</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" placeholder="Enter your email" />
                <br />
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" placeholder="Enter your password" />
                <br />
                <button type="submit">Login</button>
            </form>
            <hr />
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                <button onClick={() => handleOAuthLogin('github')}>Sign in with GitHub</button>
                <br />
                <button onClick={() => handleOAuthLogin('google')}>Sign in with Google</button>
                <br />
                <button onClick={() => handleOAuthLogin('discord')}>Sign in with Discord</button>
            </div>
        </>
    )
}

export default Login;