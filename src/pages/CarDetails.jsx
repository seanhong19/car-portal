import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CarCardDetails from "../components/CarCardDetails";
import { getCarById } from "../services/carService";

function CarDetails() {

    const { id } = useParams();
    const [carDetails, setCarDetails] = useState({});

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

    if (!carDetails.id) {
        return <p>Loading car details...</p>
    }

    return (
        <>
            <CarCardDetails
                car={carDetails}
            />
        </>
    )
}

export default CarDetails;