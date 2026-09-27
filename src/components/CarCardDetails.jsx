function CarCardDetails({ car }) {
    return (
        <div className="details-card">
            <div className="details-header">
                <h1>{car.make} {car.model}</h1>
                <div>
                    <span className="badge">{car.year}</span>
                    {car.registration && (
                        <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                            {car.registration}
                        </span>
                    )}
                </div>
            </div>

            <div className="details-grid">
                <div className="spec-item">
                    <span className="spec-label">Color</span>
                    <p className="spec-value">{car.color}</p>
                </div >
                <div className="spec-item">
                    <span className="spec-label">Manufacturing Year</span>
                    <p className="spec-value">{car.year}</p>
                </div>
                <div className="spec-item">
                    <span className="spec-label">Registration State</span>
                    <p className="spec-value">{car.registration}</p>
                </div>
                <div className="spec-item">
                    <span className="spec-label">Asking Price</span>
                    <p className="spec-value"> RM {Number(car.price).toLocaleString()}</p>
                </div>
            </div>
        </div>
    )
}

export default CarCardDetails;