import { useState, useEffect } from 'react'
import { getUserById } from '../services/userService';
import { getCarByUserId, deleteCar } from '../services/carService';
import CarCard from "../components/CarCard";
import { Link } from "react-router-dom";

function UserProfile() {

    const user = JSON.parse(localStorage.getItem("user"));

    const userId = user.id;

    const [userData, setUserData] = useState({});
    const [cars, setCars] = useState([]);

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


            <div>
                {cars.map(car => (
                    <div key={car.id}>
                        <CarCard car={car} />
                        <button><Link to={`/edit-car/${car.id}`}>Edit</Link></button>
                        <button onClick={() => handleDelete(car.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default UserProfile;