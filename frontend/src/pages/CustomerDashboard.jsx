import { useEffect, useMemo, useState } from 'react';
import BookingCard from '../components/BookingCard.jsx';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [busyId, setBusyId] = useState(null);

  const loadBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const { data } = await api.get('/bookings/my');
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((item) => item.status === 'pending').length,
      confirmed: bookings.filter((item) => item.status === 'confirmed').length
    }),
    [bookings]
  );

  const handleCancel = async (id) => {
    setBusyId(id);
    setMessage('');
    setError('');
    try {
      const { data } = await api.patch(`/bookings/${id}/cancel`);
      setMessage(data.message);
      await loadBookings();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusyId(null);
    }
  };

  return (
    <section className="section animate-fade-in-up">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Customer dashboard</p>
          <h1>Welcome, {user.name}</h1>
        </div>
        <div className="stats-grid">
          <article>
            <p>Total bookings</p>
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
        </div>
        <h2 className="subheading">My Bookings</h2>
        {message && <p className="alert success">{message}</p>}
        {error && <p className="alert error">{error}</p>}
        {loading && <p className="page-status">Loading bookings...</p>}
        {!loading && bookings.length === 0 && (
          <p className="page-status">You have not requested any bookings yet.</p>
        )}
        <div className="booking-list">
          {bookings.map((booking) => (
            <BookingCard key={booking._id} booking={booking} onCancel={handleCancel} busyId={busyId} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustomerDashboard;
