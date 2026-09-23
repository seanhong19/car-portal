import { addCar } from '../services/carService'
import { useNavigate } from 'react-router-dom';

function AddCarListing() {

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        const user = JSON.parse(localStorage.getItem("user"));

        const carData = {
            make: formValues.make,
            model: formValues.model,
            color: formValues.color,
            year: parseInt(formValues.year, 10),
            price: parseFloat(formValues.price),
            user_id: user.id
        }

        try {
            await addCar(carData);
            alert("Car added successfully!");
            form.reset();
            navigate("/car-listing")
        } catch (e) {
            console.log("Failed to add car: ", e);
            alert(`Error: ${e.message || "There is an error. Please try again!"}`)
        }
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="make">Make: </label>
                <input type="text" id="make" name="make" placeholder="Enter car make" required />
                <br />
                <label htmlFor="model">Model: </label>
                <input type="text" id="model" name="model" placeholder="Enter car model" required />
                <br />
                <label htmlFor="color">Color: </label>
                <input type="text" id="color" name="color" placeholder="Enter car color" required />
                <br />
                <label htmlFor="year">Year: </label>
                <input type="number" id="year" name="year" min="1990" max="2026" placeholder="e.g. 2020" required />
                <br />
                <label htmlFor="price">Price: </label>
                <input type="number" id="price" name="price" min="0" step="0.01" placeholder="e.g. 300,000" required />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default AddCarListing;