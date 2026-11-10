import { useEffect, useMemo, useState } from 'react';
import BookingCard from '../components/BookingCard.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const categories = ['Photography', 'Catering', 'Decoration', 'Venue', 'Music & DJ', 'Makeup Artist'];

const VendorDashboard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    businessName: '',
    ownerName: '',
    phone: '',
    category: 'Photography',
    location: '',
    price: 0,
    description: '',
    image: ''
  });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileRes, bookingRes] = await Promise.all([
        api.get('/vendors/profile'),
        api.get('/bookings/vendor')
      ]);
      setProfile(profileRes.data);
      setForm({
        businessName: profileRes.data.businessName || '',
        ownerName: profileRes.data.ownerName || '',
        phone: profileRes.data.phone || '',
        category: profileRes.data.category || 'Photography',
        location: profileRes.data.location || '',
        price: profileRes.data.price || 0,
        description: profileRes.data.description || '',
        image: profileRes.data.image || ''
      });
      setBookings(bookingRes.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((item) => item.status === 'pending').length,
      confirmed: bookings.filter((item) => item.status === 'confirmed').length,
      rejected: bookings.filter((item) => item.status === 'rejected').length
    }),
    [bookings]
  );

  const handleStatus = async (id, status) => {
    setBusyId(id);
    setMessage('');
    setError('');
    try {
      const { data } = await api.patch(`/bookings/${id}/status`, { status });
      setMessage(data.message);
      await loadData();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSave = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const { data } = await api.put('/vendors/profile', { ...form, price: Number(form.price) });
      setMessage(data.message);
      setProfile(data.vendor);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="section animate-fade-in-up">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Vendor dashboard</p>
          <h1>Welcome, {user.name}</h1>
        </div>

        {error && <p className="alert error">{error}</p>}
        {message && <p className="alert success">{message}</p>}
        {loading && <p className="page-status">Loading dashboard...</p>}

        {profile && (
          <>
            <div className="stats-grid">
              <article>
                <p>Total requests</p>
                <strong>{stats.total}</strong>
              </article>
              <article>
                <p>Pending</p>
                <strong>{stats.pending}</strong>
              </article>
              <article>
                <p>Confirmed</p>
                <strong>{stats.confirmed}</strong>
              </article>
              <article>
                <p>Rejected</p>
                <strong>{stats.rejected}</strong>
              </article>
            </div>

            <div className="dashboard-grid">
              <form className="card-form" onSubmit={handleProfileSave}>
                <h2>Business profile</h2>
                <label>
                  Business name
                  <input name="businessName" value={form.businessName} onChange={handleChange} required />
                </label>
                <label>
                  Owner name
                  <input name="ownerName" value={form.ownerName} onChange={handleChange} required />
                </label>
                <label>
                  Phone
                  <input name="phone" value={form.phone} onChange={handleChange} required />
                </label>
                <label>
                  Category
                  <select name="category" value={form.category} onChange={handleChange}>
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
                <label>
                  Location
                  <input name="location" value={form.location} onChange={handleChange} required />
                </label>
                <label>
                  Starting price (₹)
                  <input type="number" min="0" name="price" value={form.price} onChange={handleChange} />
                </label>
                <label>
                  Image URL
                  <input name="image" value={form.image} onChange={handleChange} />
                </label>
                <label>
                  Description
                  <textarea name="description" rows="4" value={form.description} onChange={handleChange} />
                </label>
                <button className="btn btn-primary" type="submit" disabled={saving}>
                  {saving ? 'Saving...' : 'Save profile'}
                </button>
              </form>

              <div>
                <h2 className="subheading">Manage Bookings</h2>
                {bookings.length === 0 && <p className="page-status">No booking requests yet.</p>}
                <div className="booking-list">
                  {bookings.map((booking) => (
                    <BookingCard
                      key={booking._id}
                      booking={booking}
                      variant="vendor"
                      busyId={busyId}
                      onAccept={(id) => handleStatus(id, 'confirmed')}
                      onReject={(id) => handleStatus(id, 'rejected')}
                    />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default VendorDashboard;
