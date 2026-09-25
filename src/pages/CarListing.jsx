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
            car.year.toString().includes(search) ||
            car.registration?.toLowerCase().includes(search.toLowerCase())
        );

        const matchesMinPrice = !minPrice || (
            Number(car.price) >= Number(minPrice)
        );

        const matchesMaxPrice = !maxPrice || (
            Number(car.price) <= Number(maxPrice)
        );

        return matchesSearch && matchesMinPrice && matchesMaxPrice;
    });

    function handleClearFilter() {
        setSearch("");
        setMinPrice("");
        setMaxPrice("");
    };


    useEffect(() => {
        async function fetchCars() {
            try {
                const data = await getCar();
                setCars(data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchCars();
    }, []);


    return (
        <>
            <h1>Car Listing: </h1>
            <input type="text" placeholder="Search for Make, Model, Year, or Registration..." value={search} onChange={(e) => setSearch(e.target.value)} />
            <div>
                <label htmlFor="min-price">Min: </label>
                <input type="number" id="min-price" name="min-price" placeholder="0" min="0" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                <p> - </p>
                <label htmlFor="max-price">Max: </label>
                <input type="number" id="max-price" name="max-price" placeholder="0" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
            </div>
            <button type="button" onClick={handleClearFilter}>Clear Filters</button>
            <div className="car-grid">
                {filteredCars.length === 0 ? (
                    <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#64748b" }}>
                        No cars found matching your search citeria. Try clearing your filters!
                    </p>
                ) : (filteredCars.map(car => (
                    <Link key={car.id} to={`/car-details/${car.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <CarCard
                            car={car}
                        />
                    </Link>))
                )
                }
            </div>
        </>
    )
}

export default CarListing;