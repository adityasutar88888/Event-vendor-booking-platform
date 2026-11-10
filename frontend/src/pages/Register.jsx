import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

const categories = ['Photography', 'Catering', 'Decoration', 'Venue', 'Music & DJ', 'Makeup Artist'];

const Register = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fullName: '',
    ownerName: '',
    businessName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    category: 'Photography',
    location: ''
  });

  if (user) {
    return <Navigate to={user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard'} replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      const payload =
        role === 'vendor'
          ? {
              role,
              ownerName: form.ownerName,
              businessName: form.businessName,
              email: form.email,
              phone: form.phone,
              password: form.password,
              confirmPassword: form.confirmPassword,
              category: form.category,
              location: form.location
            }
          : {
              role,
              fullName: form.fullName,
              email: form.email,
              phone: form.phone,
              password: form.password,
              confirmPassword: form.confirmPassword
            };

      const { data } = await api.post('/auth/register', payload);
      setSuccess(data.message);
      login(data.token, data.user);
      navigate(data.user.role === 'vendor' ? '/vendor/dashboard' : '/customer/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section auth-page">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">Create account</p>
        <h1>Register</h1>
        <div className="role-toggle">
          <button type="button" className={role === 'customer' ? 'active' : ''} onClick={() => setRole('customer')}>
            Customer
          </button>
          <button type="button" className={role === 'vendor' ? 'active' : ''} onClick={() => setRole('vendor')}>
            Vendor
          </button>
        </div>
        {error && <p className="alert error">{error}</p>}
        {success && <p className="alert success">{success}</p>}

        {role === 'customer' ? (
          <label>
            Full name
            <input name="fullName" value={form.fullName} onChange={handleChange} required />
          </label>
        ) : (
          <>
            <label>
              Business name
              <input name="businessName" value={form.businessName} onChange={handleChange} required />
            </label>
            <label>
              Owner name
              <input name="ownerName" value={form.ownerName} onChange={handleChange} required />
            </label>
            <label>
              Service category
              <select name="category" value={form.category} onChange={handleChange} required>
                {categories.map((item) => (
                  <option key={item}>{item}</option>
                ))}
              </select>
            </label>
            <label>
              Business location
              <input name="location" value={form.location} onChange={handleChange} required />
            </label>
          </>
        )}

        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
        </label>
        <label>
          Phone number
          <input name="phone" value={form.phone} onChange={handleChange} required />
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} minLength="6" required />
        </label>
        <label>
          Confirm password
          <input
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            minLength="6"
            required
          />
        </label>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? 'Creating account...' : 'Register'}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </section>
  );
};

export default Register;
