function CarCard({ car }) {
    return (
        <>
            <h2>{car.make}</h2>
            <p>{car.model}</p>
            <p>{car.color}</p>
            <p>{car.year}</p>
            <p>{car.price}</p>
        </>
    )
}

export default CarCard;