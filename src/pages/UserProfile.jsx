import { useState, useEffect } from 'react'
import { getUserById, updateUser } from '../services/userService';
import { getCarByUserId, deleteCar } from '../services/carService';
import CarCardDetails from "../components/CarCardDetails";
import { Link } from "react-router-dom";

function UserProfile() {

    const user = JSON.parse(localStorage.getItem("user"));

    const userId = user?.id;

    const [userData, setUserData] = useState({});
    const [cars, setCars] = useState([]);
    const [search, setSearch] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [isEditing, setIsEditing] = useState(false);

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

    async function handleUpdateProfile(e) {
        e.preventDefault();

        try {
            await updateUser(userId, { phone: phone, address: address });
            alert("Profile updated successfully!");
            setIsEditing(false);
        } catch (e) {
            console.log("Upadate Profile Error: " + e.message);
            alert("Update Profile Failed: " + e.message);
        }
    }

    useEffect(() => {
        async function fetchUserData() {
            try {
                const data = await getUserById(userId);
                setUserData(data);
                setFirstName(data.first_name || "");
                setLastName(data.last_name || "");
                setPhone(data.phone || "");
                setAddress(data.address || "");
            } catch (e) {
                console.log(e);
            }
        }

        async function fetchCarData() {
            try {
                const data = await getCarByUserId(userId);
                setCars(data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchUserData();
        fetchCarData();

    }, [userId]);

    async function handleDelete(id) {
        try {
            if (window.confirm("Are you sure you want to delete this car listing?")) {
                await deleteCar(id);
                alert("Car deleted successfully");
                setCars(prevCars => prevCars.filter(car => car.id !== id));
            }
        } catch (e) {
            alert("Car delete failed");
            console.log(e);
        }
    }


    return (
        <>
            <form onSubmit={handleUpdateProfile}>
                <label htmlFor='first_name'>First Name: </label>
                <input type="text" name="first_name" id="first_name" value={firstName} onChange={(e) => setFirstName(e.target.value)} readOnly disabled />
                <br />
                <label htmlFor='last_name'>Last Name: </label>
                <input type="text" name="last_name" id="last_name" value={lastName} onChange={(e) => setLastName(e.target.value)} readOnly disabled />
                <br />
                <label htmlFor='username'>Username: </label>
                <input type="text" name="username" id="username" value={userData.username || ""} readOnly disabled />
                <br />
                <label htmlFor='email'>Email: </label>
                <input type="text" name="email" id="email" value={userData.email || ""} readOnly disabled />
                <label htmlFor='phone'>Phone: </label>
                <input type="tel" name="phone" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} min="8" disabled={!isEditing} />
                <br />
                <label htmlFor='address'>Address: </label>
                <input type="text" name="address" id="address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={!isEditing} />
                <button type='button' onClick={() => setIsEditing(!isEditing)}>{isEditing ? "Cancel" : "Edit"}</button>
                {isEditing && <button type="submit">Save</button>}
            </form>

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