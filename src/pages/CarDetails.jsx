import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CarCard from "../components/CarCard";
import { getCarById } from "../services/carService";

function CarDetails() {

    const { id } = useParams();
    const [ carDetails, setCarDetails ] = useState({});
    
    useEffect(() => {
        async function fetchCarDetails() {
            try {
                const response = await getCarById(id);
                setCarDetails(response.data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchCarDetails();
    }, [id]);

    return (
        <>
            <CarCard
                car={carDetails}
            />
        </>
    )
}

export default CarDetails;