import { getUserByEmail } from "../services/userService";
import { useNavigate } from "react-router-dom";

function Login({ setIsLoggedIn }) {

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        try {
            const response = await getUserByEmail(formValues.email);
            if (response.data.length > 0) {
                if (formValues.password === response.data[0].password) {
                    alert("Login Success");
                    form.reset();
                    const { password, ...userData } = response.data[0];
                    localStorage.setItem("user", JSON.stringify(userData));
                    setIsLoggedIn(true);
                    navigate("/car-listing");
                } else {
                    alert("Email or Password is not correct!")
                }
            } else {
                alert("Email or Password is not correct!")
            }
        } catch (e) {
            console.log(e)
            alert("Email or Password is not correct!")
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
        </>
    )
}

export default Login;