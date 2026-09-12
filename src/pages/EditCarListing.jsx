import { useParams, useNavigate } from 'react-router-dom';
import { getCarById, updateCar } from '../services/carService';
import { useState, useEffect } from 'react';

function EditCarListing() {

    const { id } = useParams();
    const [carData, setCarData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchCarData() {
            try {
                const response = await getCarById(id);
                setCarData(response.data);
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

        const carData = { ...formValues, userId: user.id }

        try {
            await updateCar(id, carData);
            alert("Car edited successfully!");
            navigate("/user-profile");
        } catch (e) {
            console.log(e);
            alert("There is an error. Please try again!");
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
                <label htmlFor="price">Price: </label>
                <input type="number" id="price" name="price" min="0" step="0.01" defaultValue={carData.price} required />
                <button type="submit">Save</button>
            </form>
        </>
    )
}

export default EditCarListing;