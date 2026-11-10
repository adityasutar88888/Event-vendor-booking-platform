const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const createApp = require('../app');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

process.env.JWT_SECRET = 'workflow_test_secret';
process.env.CLIENT_URL = 'http://localhost:5173';

const request = (app, method, path, { body, token } = {}) =>
  new Promise((resolve, reject) => {
    const server = app.listen(0, async () => {
      const { port } = server.address();
      try {
        const response = await fetch(`http://127.0.0.1:${port}${path}`, {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          body: body ? JSON.stringify(body) : undefined
        });
        const data = await response.json();
        server.close();
        resolve({ status: response.status, data });
      } catch (error) {
        server.close();
        reject(error);
      }
    });
  });

const run = async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  const vendorUser = await User.create({
    name: 'Aarav Mehta',
    email: 'aarav@lumenframes.test',
    phone: '9876500001',
    password: 'vendor123',
    role: 'vendor'
  });
  const vendor = await Vendor.create({
    userId: vendorUser._id,
    businessName: 'Lumen Frames',
    ownerName: 'Aarav Mehta',
    email: 'aarav@lumenframes.test',
    phone: '9876500001',
    category: 'Photography',
    location: 'Mumbai',
    price: 25000,
    rating: 4.8,
    description: 'Wedding photography'
  });

  const app = createApp();

  const register = await request(app, 'POST', '/api/auth/register', {
    body: {
      role: 'customer',
      fullName: 'Aditya Customer',
      email: 'aditya@test.com',
      phone: '9999999999',
      password: 'secret12',
      confirmPassword: 'secret12'
    }
  });
  if (register.status !== 201) throw new Error(`Register failed: ${JSON.stringify(register.data)}`);

  const login = await request(app, 'POST', '/api/auth/login', {
    body: { email: 'aditya@test.com', password: 'secret12' }
  });
  if (login.status !== 200) throw new Error('Login failed');
  const customerToken = login.data.token;

  const me = await request(app, 'GET', '/api/auth/me', { token: customerToken });
  if (me.status !== 200 || me.data.user.role !== 'customer') throw new Error('GET /me failed');

  const vendors = await request(app, 'GET', '/api/vendors');
  if (!Array.isArray(vendors.data) || vendors.data.length < 1) throw new Error('Vendors list empty');

  const details = await request(app, 'GET', `/api/vendors/${vendor._id}`);
  if (details.status !== 200) throw new Error('Vendor details failed');

  const booking = await request(app, 'POST', '/api/bookings', {
    token: customerToken,
    body: {
      vendorId: vendor._id,
      eventName: 'Spring Wedding',
      eventType: 'Wedding',
      eventDate: '2027-03-12',
      eventLocation: 'Mumbai',
      guestCount: 120,
      requirements: 'Outdoor portraits'
    }
  });
  if (booking.status !== 201) throw new Error(`Booking failed: ${JSON.stringify(booking.data)}`);

  const myBookings = await request(app, 'GET', '/api/bookings/my', { token: customerToken });
  if (myBookings.data.length !== 1) throw new Error('Customer bookings missing');

  const vendorLogin = await request(app, 'POST', '/api/auth/login', {
    body: { email: 'aarav@lumenframes.test', password: 'vendor123' }
  });
  const vendorToken = vendorLogin.data.token;

  const vendorBookings = await request(app, 'GET', '/api/bookings/vendor', { token: vendorToken });
  if (vendorBookings.data.length !== 1) throw new Error('Vendor bookings missing');

  const accept = await request(app, 'PATCH', `/api/bookings/${booking.data.booking._id}/status`, {
    token: vendorToken,
    body: { status: 'confirmed' }
  });
  if (accept.status !== 200 || accept.data.booking.status !== 'confirmed') {
    throw new Error('Accept booking failed');
  }

  const cancelDenied = await request(app, 'PATCH', `/api/bookings/${booking.data.booking._id}/cancel`, {
    token: customerToken
  });
  if (cancelDenied.status !== 400) throw new Error('Should not cancel confirmed booking');

  const ownBooking = await request(app, 'POST', '/api/bookings', {
    token: vendorToken,
    body: {
      vendorId: vendor._id,
      eventName: 'Self book',
      eventType: 'Wedding',
      eventDate: '2027-04-01',
      eventLocation: 'Mumbai',
      guestCount: 10
    }
  });
  if (ownBooking.status !== 403 && ownBooking.status !== 400) {
    throw new Error('Vendor should not create customer booking / own booking');
  }

  await mongoose.disconnect();
  await mongod.stop();
  console.log('Workflow test passed: register, login, list vendors, book, vendor accept.');
};

run().catch(async (error) => {
  console.error(error);
  process.exit(1);
});
