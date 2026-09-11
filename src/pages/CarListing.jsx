import CarCard from "../components/CarCard";
import { getCar } from "../services/carService";
import { useState, useEffect } from "react";

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
                <CarCard
                    key={car.id}
                    car={car}
                />
            ))}
        </>
    )
}

export default CarListing;