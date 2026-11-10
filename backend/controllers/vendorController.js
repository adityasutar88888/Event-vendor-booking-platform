const Vendor = require('../models/Vendor');

exports.getVendors = async (req, res) => {
  try {
    const { search, category, location, sort } = req.query;
    const filter = {};

    if (search) {
      filter.businessName = { $regex: search, $options: 'i' };
    }
    if (category && category !== 'all') {
      filter.category = category;
    }
    if (location) {
      filter.location = { $regex: location, $options: 'i' };
    }

    let query = Vendor.find(filter);
    if (sort === 'price-asc') {
      query = query.sort({ price: 1 });
    } else if (sort === 'price-desc') {
      query = query.sort({ price: -1 });
    } else {
      query = query.sort({ createdAt: -1 });
    }

    const vendors = await query;
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load vendors.' });
  }
};

exports.getVendorById = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ message: 'Invalid vendor id.' });
  }
};

exports.createVendor = async (req, res) => {
  try {
    const existing = await Vendor.findOne({ userId: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'A vendor profile already exists for this account.' });
    }

    const { businessName, ownerName, category, location, description, price, image } = req.body;
    if (!businessName || !ownerName || !category || !location) {
      return res.status(400).json({ message: 'Business name, owner name, category, and location are required.' });
    }

    const vendor = await Vendor.create({
      userId: req.user._id,
      businessName,
      ownerName,
      email: req.user.email,
      phone: req.user.phone,
      category,
      location,
      description,
      price,
      image
    });

    res.status(201).json(vendor);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to create vendor profile.' });
  }
};

exports.getMyProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found.' });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load vendor profile.' });
  }
};

exports.updateMyProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found.' });
    }

    const allowed = ['businessName', 'ownerName', 'phone', 'category', 'description', 'location', 'price', 'image'];
    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        vendor[field] = req.body[field];
      }
    });

    await vendor.save();
    res.json({ message: 'Profile updated.', vendor });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to update profile.' });
  }
};
