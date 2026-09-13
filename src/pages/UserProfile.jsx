import { useState, useEffect } from 'react'
import { getUserById } from '../services/userService';
import { getCarByUserId, deleteCar } from '../services/carService';
import CarCardDetails from "../components/CarCardDetails";
import { Link } from "react-router-dom";

function UserProfile() {

    const user = JSON.parse(localStorage.getItem("user"));

    const userId = user.id;

    const [userData, setUserData] = useState({});
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const filteredCars = cars.filter(car => {

        const matchesSearch = !search || (
            car.make.toLowerCase().includes(search.toLowerCase()) ||
            car.model.toLowerCase().includes(search.toLowerCase()) ||
            car.color.toLowerCase().includes(search.toLowerCase()) ||
            car.year.toString().includes(search)
        );

        const matchesMinPrice = !minPrice || (
            Number(car.price) >= Number(minPrice)
        );

        const matchesMaxPrice = !maxPrice || (
            Number(car.price) <= Number(maxPrice)
        );

        return matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    useEffect(() => {
        async function fetchUserData() {
            try {
                const response = await getUserById(userId);
                setUserData(response.data);
            } catch (e) {
                console.log(e);
            }
        }

        async function fetchCarData() {
            try {
                const response = await getCarByUserId(userId);
                console.log(response.data)
                setCars(response.data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchUserData();
        fetchCarData();

    }, []);

    async function handleDelete(id) {
        try {
            await deleteCar(id);
            alert("Car deleted successfully");
            setCars(prevCars => prevCars.filter(car => car.id !== id));
        } catch (e) {
            alert("Car delete failed");
            console.log(e);
        }
    }


    return (
        <>
            <h1>Username: {userData.username}</h1>
            <p>Email: {userData.email}</p>

            <h2>Your Car List: </h2>

            <input
                type="text"
                placeholder="Search for make, model, color and year"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            <div>
                <label htmlFor="min-price">Min: </label>
                <input
                    type="text"
                    id="min-price"
                    name="min-price"
                    placeholder="0"
                    min="0"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                />
                <p> - </p>
                <label htmlFor="max-price">Max: </label>
                <input
                    type="text"
                    id="max-price"
                    name="max-price"
                    placeholder="0"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                />
            </div>

            <div>
                {filteredCars.map(car => (
                    <div key={car.id}>
                        <CarCardDetails car={car} />
                        <button><Link to={`/edit-car/${car.id}`}>Edit</Link></button>
                        <button onClick={() => handleDelete(car.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default UserProfile;