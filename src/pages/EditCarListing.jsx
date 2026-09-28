import { useParams, useNavigate } from 'react-router-dom';
import { getCarById, updateCar } from '../services/carService';
import { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';

function EditCarListing() {

    const { id } = useParams();
    const [carData, setCarData] = useState({});
    const navigate = useNavigate();
    const { showToast } = useToast();

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


    useEffect(() => {
        async function fetchCarData() {
            try {
                const data = await getCarById(id);
                setCarData(data);

                if (data?.registration) {
                    setSelectedItem(data.registration)
                }
            } catch (e) {
                console.log(e);
            }
        }

        fetchCarData();
    }, [id])

    async function handleSubmit(e) {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);
        const formValues = Object.fromEntries(formData.entries());

        const user = JSON.parse(localStorage.getItem("user"));

        if (selectedItem === "--Select car registration state--") {
            showToast("Please select a vehicle registration state before saving.", "info");
            return;
        }

        const updateCarData = {
            make: formValues.make,
            model: formValues.model,
            color: formValues.color,
            year: parseInt(formValues.year, 10),
            price: parseFloat(formValues.price),
            registration: selectedItem,
            user_id: user.id
        }

        try {
            await updateCar(id, updateCarData);
            showToast("Listing updated successfully!", "success");
            navigate("/user-profile");
        } catch (e) {
            console.log(e);
            showToast("Failed to update listing. Please try again.", "error");
        }
    }

    if (!carData.id) {
        return <p>Loading car data...</p>
    }

    return (
        <>
            <form onSubmit={handleSubmit}>
                <label htmlFor="make">Make: </label>
                <input type="text" id="make" name="make" defaultValue={carData.make} required />
                <br />
                <label htmlFor="model">Model: </label>
                <input type="text" id="model" name="model" defaultValue={carData.model} required />
                <br />
                <label htmlFor="color">Color: </label>
                <input type="text" id="color" name="color" defaultValue={carData.color} required />
                <br />
                <label htmlFor="year">Year: </label>
                <input type="number" id="year" name="year" min="1990" max="2026" defaultValue={carData.year} required />
                <br />
                <label htmlFor='registration'>Registration: </label>
                <div className="custom-dropdown" name="registration" id="registration" required>
                    <button type="button" onClick={() => setIsOpen(!isOpen)}>
                        {selectedItem}
                    </button>

                    {isOpen && (
                        <ul>
                            {states.map((state, index) => (
                                <button type="button" defaultValue={carData.registration} key={index} onClick={() => handleSelect(state)}>
                                    <li>{state}</li>
                                </button>
                            ))}
                        </ul>
                    )}
                </div>
                <br />
                <label htmlFor="price">Price: </label>
                <input type="number" id="price" name="price" min="0" step="0.01" defaultValue={carData.price} required />
                <button type="submit">Save</button>
            </form>
        </>
    )
}

export default EditCarListing;