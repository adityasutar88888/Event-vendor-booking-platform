const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9+\-\s]{8,15}$/;

const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role
});

exports.register = async (req, res) => {
  try {
    const {
      role,
      name,
      fullName,
      email,
      phone,
      password,
      confirmPassword,
      businessName,
      ownerName,
      category,
      location
    } = req.body;

    const userRole = role === 'vendor' ? 'vendor' : 'customer';
    const displayName = userRole === 'vendor' ? ownerName : fullName || name;

    if (!displayName || !email || !phone || !password || !confirmPassword) {
      return res.status(400).json({ message: 'Please fill in all required fields.' });
    }

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Please enter a valid email address.' });
    }

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({ message: 'Please enter a valid phone number.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match.' });
    }

    if (userRole === 'vendor' && (!businessName || !category || !location)) {
      return res.status(400).json({ message: 'Please complete all vendor business details.' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }

    const user = await User.create({
      name: displayName.trim(),
      email: email.toLowerCase().trim(),
      phone: phone.trim(),
      password,
      role: userRole
    });

    if (userRole === 'vendor') {
      await Vendor.create({
        userId: user._id,
        businessName: businessName.trim(),
        ownerName: ownerName.trim(),
        email: user.email,
        phone: user.phone,
        category,
        location: location.trim(),
        description: `${businessName.trim()} provides professional ${category.toLowerCase()} services for weddings, parties, and corporate events.`
      });
    }

    res.status(201).json({
      message: 'Registration successful.',
      token: generateToken(user._id),
      user: buildUserPayload(user)
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'An account with this email already exists.' });
    }
    res.status(500).json({ message: error.message || 'Unable to register. Please try again.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    res.json({
      message: 'Login successful.',
      token: generateToken(user._id),
      user: buildUserPayload(user)
    });
  } catch (error) {
    res.status(500).json({ message: 'Unable to log in. Please try again.' });
  }
};

exports.getMe = async (req, res) => {
  res.json({ user: buildUserPayload(req.user) });
};
