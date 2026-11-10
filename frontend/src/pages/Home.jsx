import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Camera, Music, Sparkles, MapPin, UtensilsCrossed, Palette, Search } from 'lucide-react';
import VendorCard from '../components/VendorCard.jsx';
import api from '../services/api.js';

const categories = [
  { name: 'Photography', icon: Camera },
  { name: 'Catering', icon: UtensilsCrossed },
  { name: 'Decoration', icon: Sparkles },
  { name: 'Venue', icon: MapPin },
  { name: 'Music & DJ', icon: Music },
  { name: 'Makeup Artist', icon: Palette }
];

const Home = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get('/vendors');
        setFeatured(data.slice(0, 4));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    navigate(query ? `/vendors?search=${encodeURIComponent(query)}` : '/vendors');
  };

  return (
    <>
      <section className="hero animate-fade-in">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="eyebrow light">Event vendor booking</p>
          <h1>Make Every Event Extraordinary</h1>
          <p className="hero-text">
            Find photographers, caterers, venues, and other event vendors, then send a booking request
            in a few steps.
          </p>
          <form className="hero-search" onSubmit={handleSearch}>
            <Search size={18} />
            <input
              type="search"
              placeholder="Search by vendor name or service"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary" type="submit">
              Explore Vendors
            </button>
          </form>
        </div>
      </section>

      <section className="section animate-fade-in-up">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Browse</p>
            <h2>Popular Categories</h2>
          </div>
          <div className="category-grid">
            {categories.map(({ name, icon: Icon }) => (
              <Link key={name} className="category-card" to={`/vendors?category=${encodeURIComponent(name)}`}>
                <Icon size={22} />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section muted-section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Selected listings</p>
            <h2>Featured Vendors</h2>
          </div>
          {loading && <p className="page-status">Loading vendors...</p>}
          {error && <p className="alert error">{error}</p>}
          {!loading && !error && featured.length === 0 && (
            <p className="page-status">No vendors yet. Ask an administrator to run the seed script.</p>
          )}
          <div className="vendor-grid">
            {featured.map((vendor) => (
              <VendorCard key={vendor._id} vendor={vendor} />
            ))}
          </div>
        </div>
      </section>

      <section className="section animate-fade-in-up">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Simple process</p>
            <h2>How It Works</h2>
          </div>
          <div className="steps-grid">
            <article>
              <span>01</span>
              <h3>Discover vendors</h3>
              <p>Browse listings by category, location, or name and open a vendor profile.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Choose your service</h3>
              <p>Compare starting prices, ratings, and descriptions before you request a date.</p>
            </article>
            <article>
              <span>03</span>
              <h3>Book your vendor</h3>
              <p>Send a booking request. The vendor can accept or reject it from their dashboard.</p>
            </article>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
