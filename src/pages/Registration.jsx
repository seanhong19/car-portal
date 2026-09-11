import { getUserByEmail, addUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Registration() {

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        if (formValues.confirmPassword !== formValues.password) {
            alert("Password not match!");
            return;
        }

        try {
            const response = await getUserByEmail(formValues.email);
            if (response.data.length > 0) {
                alert("User already exists!");
                return;
            }

            const { confirmPassword, ...userData } = formValues;
            await addUser(userData);
            alert("User registered successfully!");
            form.reset();
            navigate("/login");

        } catch (error) {
            console.log(error);
            alert("Registration failed. Please try again!");
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="firstName">First Name: </label>
                <input type="text" id="firstName" name="firstName" placeholder="Enter your first name" required />
                <br />
                <label htmlFor="lastName">Last Name: </label>
                <input type="text" id="lastName" name="lastName" placeholder="Enter your last name" required />
                <br />
                <label htmlFor="username">Username: </label>
                <input type="text" id="username" name="username" placeholder="Enter your username" required />
                <br />
                <label htmlFor="email">Email: </label>
                <input type="email" id="email" name="email" placeholder="Enter your email" required />
                <br />
                <label htmlFor="password">Password: </label>
                <input type="password" id="password" name="password" placeholder="Enter your password" required />
                <br />
                <label htmlFor="confirmPassword">Confirm Password: </label>
                <input type="password" id="confirmPassword" name="confirmPassword" placeholder="Confirm your password" required />
                <br />
                <button type="submit">Register</button>
            </form>
        </>
    )

}
export default Registration;