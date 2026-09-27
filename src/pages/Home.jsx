import { Link } from 'react-router-dom';

function Home() {
    return (
        <div className='home-container'>
            <h1 className='hero-titile'>
                Find Your Next Ride with <br />
                <span className='hero-gradient-text'>AutoSphere Motors</span>
            </h1>
            <p className='hero-subtitle'>
                Malaysia's premier marketplace for quality used cars. Browse inspected vehicles, filter by state and price, or list your car in minutes.
            </p>

            <div className='hero-cta-group'>
                <Link to="/car-listing">
                    <button type="button">
                        Browse Marketplace →
                    </button>
                </Link>
                <Link to="/add-car">
                    <button type='button' className='btn-secondary'>
                        + Sell Your Car
                    </button>
                </Link>
            </div>
            <div className='features-grid'>
                <div className='feature-card'>
                    <span className='feature-icon'>🛡️</span>
                    <h3>Verified Sellers</h3>
                    <p>All listings are connected to authenticated user profiles with verified contact details.</p>
                </div>
                <div className='feature-card'>
                    <span className='feature-icon'>🔎</span>
                    <h3>Advanced Search</h3>
                    <p>Filter vehicles seamlessly by make, model, manufacturing year, registration state, and price.</p>
                </div>
                <div className='feature-card'>
                    <span className='feature-icon'>⚡</span>
                    <h3>Instant Management</h3>
                    <p>Edit pricing, update specifications, and manage your inventory with real-time updates.</p>
                </div>
            </div>
        </div>
    );
}

export default Home;
