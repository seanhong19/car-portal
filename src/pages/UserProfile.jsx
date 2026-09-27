import { useState, useEffect } from 'react'
import { getUserById, updateUser } from '../services/userService';
import { getCarByUserId, deleteCar } from '../services/carService';
import CarCardDetails from "../components/CarCardDetails";
import { Link } from "react-router-dom";
import { useToast } from '../context/ToastContext';

function UserProfile() {

    const { showToast } = useToast();
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
            showToast("Profile updated successfully!", "success");
            setIsEditing(false);
        } catch (e) {
            console.log("Upadate Profile Error: " + e.message);
            showToast(e.message || "Failed to update profile. Please try again.", "error");
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
                showToast("Listing deleted successfully", "success");
                setCars(prevCars => prevCars.filter(car => car.id !== id));
            }
        } catch (e) {
            showToast(e.message || "Unable to delete listing. Please try again.", "error");
            console.log(e);
        }
    }


    return (
        <div className='profile-container'>

            <div className='profile-section'>
                <h2>Profile Management</h2>
                <p className='section-subtitle'>
                    Identity details are verified from your login provider. You can edit your phone number and address below.
                </p>

                <form onSubmit={handleUpdateProfile} style={{ margin: 0, padding: 0, maxWidth: '100%', boxShadow: 'none' }}>
                    <div className='form-row'>
                        <div>
                            <label htmlFor='first_name'>
                                First Name:
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                id="first_name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                readOnly disabled
                            />
                        </div>
                        <div>
                            <label htmlFor='last_name'>
                                Last Name:
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                id="last_name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                readOnly disabled
                            />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div>
                            <label htmlFor='username'>Username: </label>
                            <input
                                type="text"
                                name="username"
                                id="username"
                                value={userData.username || ""}
                                readOnly disabled
                            />
                        </div>
                        <div>
                            <label htmlFor='email'>Email: </label>
                            <input
                                type="text"
                                name="email"
                                id="email" value={userData.email || ""}
                                readOnly disabled
                            />
                        </div>
                    </div>
                    <div className='form-row'>
                        <div>
                            <label htmlFor='phone'>Phone: </label>
                            <input
                                type="tel"
                                name="phone"
                                id="phone"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                min="8"
                                disabled={!isEditing}
                            />
                        </div>
                        <div>
                            <label htmlFor='address'>Mailing Address: </label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>

                    <div className='form-actions'>
                        <button
                            type='button'
                            className='btn-secondary'
                            onClick={() => setIsEditing(!isEditing)}>
                            {isEditing ? "Cancel" : "Edit"}
                        </button>
                        {isEditing && (
                            <button type="submit">
                                Save Changes
                            </button>
                        )}
                    </div>
                </form>
            </div>


            <div className='profile-section'>
                <h2>Your Listed Car ({filteredCars.length})</h2>
                <p className='section-subtitle'>Manage or remove the vehicles you have posted on AutoSphere Motors.</p>

                <div className='filter-toolbar'>
                    <input
                        type="text"
                        className='filter-search'
                        placeholder="Search your listings..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    <div className='filter-price-group'>
                        <label htmlFor="profile-min-price">Min:</label>
                        <input
                            type="number"
                            id="profile-min-price"
                            name="profile-min-price"
                            placeholder="0"
                            min="0"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                        <span>-</span>
                        <label htmlFor="profile-max-price">Max:</label>
                        <input
                            type="number"
                            id="profile-max-price"
                            name="profile-max-price"
                            placeholder="0"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>
                </div>

                {filteredCars.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: 'var(--text-muted' }}>
                        <p>You haven't listed any cars yet matching this criteria.</p>
                        <Link to="/add-car">
                            <button type="button" style={{ marginTop: '0.5rem' }}>
                                + Add a Car Listing
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className='car-grid'>
                        {filteredCars.map(car => (
                            <div key={car.id} className='user-car-card'>
                                <CarCardDetails car={car} />
                                <div className='user-car-actions'>
                                    <Link to={`/edit-car/${car.id}`}>
                                        <button type='button' className='btn-secondary' style={{ width: '100%' }}>
                                            Edit
                                        </button>
                                    </Link>
                                    <button
                                        type='button'
                                        className='btn-danger'
                                        onClick={() => handleDelete(car.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default UserProfile;