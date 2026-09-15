function CarCard({ car }) {
    return (
        <div className="car-card">
            <h2>{car.make}</h2>
            <p>{car.model}</p>
            <p style={{ fontWeight: 'bold', color: 'var(--primary)' }} >RM {car.price}</p>
        </div>
    )
}

export default CarCard;