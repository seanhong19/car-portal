import CarCard from "../components/CarCard";
import { getCar } from "../services/carService";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function CarListing() {

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
        async function fetchCars() {
            try {
                const response = await getCar();
                setCars(response.data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchCars();
    }, []);


    return (
        <>
            <h1>Car Listing: </h1>
            <input type="text" placeholder="Search for Make, Model and Year" value={search} onChange={(e) => setSearch(e.target.value)} />
            <div>
                <label htmlFor="min-price">Min: </label>
                <input type="number" id="min-price" name="min-price" placeholder="0" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <p> - </p>
                <label htmlFor="max-price">Max: </label>
                <input type="number" id="max-price" name="max-price" placeholder="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <div className="car-grid">
                {filteredCars.map(car => (
                    <Link key={car.id} to={`/car-details/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <CarCard
                            car={car}
                        />
                    </Link>
                ))}
            </div>
        </>
    )
}

export default CarListing;