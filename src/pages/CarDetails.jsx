import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import CarCardDetails from "../components/CarCardDetails";
import { getCarById } from "../services/carService";

function CarDetails() {

    const { id } = useParams();
    const [carDetails, setCarDetails] = useState({});

    useEffect(() => {
        async function fetchCarDetails() {
            try {
                const data = await getCarById(id);
                setCarDetails(data);
            } catch (e) {
                console.log(e);
            }
        }

        fetchCarDetails();
    }, [id]);

    if (!carDetails.id) {
        return (
            <div className="details-page-container">
                <p>Loading car details...</p>
            </div>
        )
    }

    return (
        <div className="details-page-container">
            <Link to="/car-listing" className="back-link">
                ← Back to Marketplace
            </Link>
            <CarCardDetails
                car={carDetails}
            />
        </div>
    )
}

export default CarDetails;