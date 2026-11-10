import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MapPin, Phone, Mail, Star } from 'lucide-react';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const VendorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    eventName: '',
    eventType: 'Wedding',
    eventDate: '',
    eventLocation: '',
    guestCount: 50,
    requirements: ''
  });
  const [message, setMessage] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await api.get(`/vendors/${id}`);
        setVendor(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleBookClick = () => {
    if (!user) {
      navigate('/login', { state: { from: `/vendors/${id}` } });
      return;
    }
    if (user.role !== 'customer') {
      setFormError('Only customer accounts can submit booking requests.');
      return;
    }
    setShowForm(true);
    setFormError('');
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');
    setMessage('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/bookings', { ...form, vendorId: id });
      setMessage(data.message);
      setShowForm(false);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <p className="page-status">Loading vendor...</p>;
  }

  if (error || !vendor) {
    return <p className="alert error">{error || 'Vendor not found.'}</p>;
  }

  return (
    <section className="section animate-fade-in-up">
      <div className="container vendor-details">
        <img className="vendor-hero-image" src={vendor.image} alt={vendor.businessName} />
        <div className="vendor-details-grid">
          <div>
            <p className="eyebrow">{vendor.category}</p>
            <h1>{vendor.businessName}</h1>
            <p className="lede">{vendor.description}</p>
            <ul className="detail-list">
              <li>
                <MapPin size={18} /> {vendor.location}
              </li>
              <li>
                <Star size={18} /> {vendor.rating ? `${vendor.rating.toFixed(1)} rating` : 'New listing'}
              </li>
              <li>
                <Phone size={18} /> {vendor.phone}
              </li>
              <li>
                <Mail size={18} /> {vendor.email}
              </li>
            </ul>
            <p className="price-line">
              Starting price:{' '}
              <strong>
                ₹{Number(vendor.price).toLocaleString('en-IN')}
                {vendor.category === 'Catering' ? ' per guest' : ''}
              </strong>
            </p>
            <button className="btn btn-primary" type="button" onClick={handleBookClick}>
              Book Now
            </button>
            {formError && <p className="alert error">{formError}</p>}
            {message && <p className="alert success">{message}</p>}
          </div>
          {showForm && (
            <form className="card-form" onSubmit={handleSubmit}>
              <h2>Request a booking</h2>
              <label>
                Event name
                <input name="eventName" value={form.eventName} onChange={handleChange} required />
              </label>
              <label>
                Event type
                <select name="eventType" value={form.eventType} onChange={handleChange}>
                  <option>Wedding</option>
                  <option>Birthday</option>
                  <option>Corporate</option>
                  <option>Engagement</option>
                  <option>Other</option>
                </select>
              </label>
              <label>
                Event date
                <input type="date" name="eventDate" value={form.eventDate} onChange={handleChange} required />
              </label>
              <label>
                Event location
                <input name="eventLocation" value={form.eventLocation} onChange={handleChange} required />
              </label>
              <label>
                Number of guests
                <input
                  type="number"
                  min="1"
                  name="guestCount"
                  value={form.guestCount}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Additional requirements
                <textarea name="requirements" rows="4" value={form.requirements} onChange={handleChange} />
              </label>
              <button className="btn btn-primary" type="submit" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit request'}
              </button>
              <Link to="/customer/dashboard">Go to my bookings</Link>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default VendorDetails;
