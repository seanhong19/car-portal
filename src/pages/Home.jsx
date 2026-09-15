import { Link } from 'react-router-dom';

function Home() {
    return (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <h1>Welcome to AutoSphere Motors</h1>
            <p>Your premier portal to browse, buy, and list quality used cars.</p>
            <br />
            <Link to="/car-listing">
                <button>Browse Cars Now</button>
            </Link>
        </div>
    );
}

export default Home;
