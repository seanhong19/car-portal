import { addUser } from "../services/userService";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../utils/supabaseClient";
import { useState } from "react";
import { useToast } from "../context/ToastContext";

function Registration() {

    const navigate = useNavigate();
    const { showToast } = useToast();
    const [errorMessage, setErrorMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMessage("");

        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        if (formValues.confirmPassword !== formValues.password) {
            setErrorMessage("Passwords do not match!");
            return;
        }


        function validatePassword(password) {
            if (password.length < 8) {
                return "Password must be at least 8 characters long.";
            }
            if (!/[A-Z]/.test(password)) {
                return "Password must include at least one uppercase letter (A-Z).";
            }
            if (!/[a-z]/.test(password)) {
                return "Password must include at least one lowercase letter (a-z).";
            }
            if (!/[0-9]/.test(password)) {
                return "Password must include at least one number (0-9).";
            }
            if (!/[^A-Za-z0-9]/.test(password)) {
                return "Password must include at least one special symbol (!@#$%^&* etc.).";
            }
            return null; // Valid!
        }

        const passwordError = validatePassword(formValues.password);
        if (passwordError) {
            setErrorMessage(passwordError);
            return;
        }

        const userData = { ...formValues };
        delete userData.confirmPassword;

        try {
            const response = await addUser(userData);

            if (response?.user?.identities && response.user.identities.length === 0) {
                setErrorMessage("An account with this email already exists! Please login instead.");
                navigate("/login");
                return
            }

            await supabase.auth.signOut();
            showToast("Registration successful! Please log in with your credentials.", "success");
            form.reset();
            navigate("/login");

        } catch (e) {
            console.log(e);
            setErrorMessage(e.message || "Registration failed. Please try again!");
        }
    }

    return (
        <div className="auth-wrapper">
            <div className="auth-card" style={{ maxWidth: '500px' }}>
                <div className="auth-header">
                    <h2>Create an Account</h2>
                    <p className="auth-subtitle">Join AutoSphere Motors marketplace today</p>
                </div>

                {errorMessage && (
                    <div className="auth-error-banner">
                        <span>{errorMessage}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ margin: 0, padding: 0, maxWidth: '100%', boxShadow: 'none' }}>
                    <div>
                        <label htmlFor="firstName">First Name: </label>
                        <input type="text" id="firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div>
                        <label htmlFor="lastName">Last Name: </label>
                        <input type="text" id="lastName" name="lastName" placeholder="Doe" required />
                    </div>
                    <div>
                        <label htmlFor="username">Username: </label>
                        <input type="text" id="username" name="username" placeholder="johndoe123" required />
                    </div>
                    <div>
                        <label htmlFor="email">Email: </label>
                        <input type="email" id="email" name="email" placeholder="johndoe@example.com" required />
                    </div>
                    <div>
                        <label htmlFor="password">Password: </label>
                        <input type="password" id="password" name="password" placeholder="Create your password" required />
                    </div>
                    <div>
                        <label htmlFor="confirmPassword">Confirm Password: </label>
                        <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Repeat your password" required />
                    </div>

                    <button type="submit" style={{ width: '100%', marginTop: '0.5rem' }}>Create account</button>
                </form>
                <div className="auth-footer">
                    Already have an account? <Link to="/login">Sign in here</Link>
                </div>
            </div>
        </div>
    )

}
export default Registration;