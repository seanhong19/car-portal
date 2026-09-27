function CarCard({ car }) {
    return (
        <div className="car-card">
            <div>
                <h2>{car.make} {car.model}</h2>
                <div style={{ marginTop: '0.5rem', marginBottom: '0.75rem' }}>
                    <span className="badge">{car.year}</span>
                    {car.registration && (
                        <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                            {car.registration}
                        </span>
                    )}
                </div>
            </div>

            <div className="car-price">
                RM {Number(car.price).toLocaleString()}
            </div>
        </div>
    )
}

export default CarCard;