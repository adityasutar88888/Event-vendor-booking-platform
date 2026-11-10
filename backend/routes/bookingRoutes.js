const express = require('express');
const {
  createBooking,
  getMyBookings,
  getVendorBookings,
  updateBookingStatus,
  cancelBooking
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, authorize('customer'), createBooking);
router.get('/my', protect, authorize('customer'), getMyBookings);
router.get('/vendor', protect, authorize('vendor'), getVendorBookings);
router.patch('/:id/status', protect, authorize('vendor'), updateBookingStatus);
router.patch('/:id/cancel', protect, authorize('customer'), cancelBooking);

module.exports = router;
