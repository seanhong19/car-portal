import CarCard from "../components/CarCard";
import { getCar } from "../services/carService";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

function CarListing() {

    const [cars, setCars] = useState([]);

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
            {cars.map(car => (
                <Link key={car.id} to={`/car-details/${car.id}`}>
                    <CarCard
                        car={car}
                    />
                </Link>
            ))}
        </>
    )
}

export default CarListing;