import { addCar } from '../services/carService'
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

function AddCarListing() {

    const navigate = useNavigate();

    const [isOpen, setIsOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState("--Select car registration state--");
    const states = [
        "Pulau Pinang",
        "Kuala Lumpur",
        "Terengganu",
        "Kelantan",
        "Perlis",
        "Johor",
        "Sarawak",
        "Sabah",
        "Kedah",
        "Perak",
        "Pahang",
        "Negeri Sembilan",
        "Melaka",
        "Selangor"
    ];

    const handleSelect = (state) => {
        setSelectedItem(state);
        setIsOpen(false);
    };

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        const user = JSON.parse(localStorage.getItem("user"));

        if (selectedItem === "--Select car registration state--") {
            alert("Please select a registration state!");
            return;
        }

        const carData = {
            make: formValues.make,
            model: formValues.model,
            color: formValues.color,
            year: parseInt(formValues.year, 10),
            registration: selectedItem,
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
                <label htmlFor="registration">Registration: </label>
                <div name="registration" id="registration" required>
                    <button type="button" onClick={() => setIsOpen(!isOpen)}>
                        {selectedItem}
                    </button>

                    {isOpen && (
                        <ul>
                            {states.map((state, index) => (
                                <button type="button" key={index} onClick={() => handleSelect(state)}>
                                    <li>{state}</li>
                                </button>
                            ))}
                        </ul>
                    )}
                </div>
                <label htmlFor="price">Price: </label>
                <input type="number" id="price" name="price" min="0" step="0.01" placeholder="e.g. 300,000" required />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default AddCarListing;