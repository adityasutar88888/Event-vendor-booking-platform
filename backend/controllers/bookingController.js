const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');

exports.createBooking = async (req, res) => {
  try {
    const { vendorId, eventName, eventType, eventDate, eventLocation, guestCount, requirements } = req.body;

    if (!vendorId || !eventName || !eventType || !eventDate || !eventLocation || !guestCount) {
      return res.status(400).json({ message: 'Please fill in all required booking fields.' });
    }

    const date = new Date(eventDate);
    if (Number.isNaN(date.getTime())) {
      return res.status(400).json({ message: 'Please provide a valid event date.' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (date < today) {
      return res.status(400).json({ message: 'Event date must be today or in the future.' });
    }

    const guests = Number(guestCount);
    if (!Number.isFinite(guests) || guests < 1) {
      return res.status(400).json({ message: 'Guest count must be at least 1.' });
    }

    const vendor = await Vendor.findById(vendorId);
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor not found.' });
    }

    if (vendor.userId.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot book your own vendor account.' });
    }

    const booking = await Booking.create({
      customerId: req.user._id,
      vendorId: vendor._id,
      eventName: eventName.trim(),
      eventType: eventType.trim(),
      eventDate: date,
      eventLocation: eventLocation.trim(),
      guestCount: guests,
      requirements: requirements ? requirements.trim() : '',
      status: 'pending'
    });

    const populated = await booking.populate([
      { path: 'vendorId', select: 'businessName category location price image' },
      { path: 'customerId', select: 'name email phone' }
    ]);

    res.status(201).json({
      message: 'Booking request submitted successfully.',
      booking: populated
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Unable to create booking.' });
  }
};

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user._id })
      .populate('vendorId', 'businessName category location price image')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load bookings.' });
  }
};

exports.getVendorBookings = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found.' });
    }

    const bookings = await Booking.find({ vendorId: vendor._id })
      .populate('customerId', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Unable to load booking requests.' });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Status must be confirmed or rejected.' });
    }

    const vendor = await Vendor.findOne({ userId: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: 'Vendor profile not found.' });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ message: 'You can only update bookings for your own business.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be accepted or rejected.' });
    }

    booking.status = status;
    await booking.save();

    const populated = await booking.populate('customerId', 'name email phone');
    res.json({ message: `Booking ${status}.`, booking: populated });
  } catch (error) {
    res.status(500).json({ message: 'Unable to update booking status.' });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.customerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only cancel your own bookings.' });
    }

    if (booking.status !== 'pending') {
      return res.status(400).json({ message: 'Only pending bookings can be cancelled.' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled.', booking });
  } catch (error) {
    res.status(500).json({ message: 'Unable to cancel booking.' });
  }
};
