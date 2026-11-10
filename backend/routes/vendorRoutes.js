const express = require('express');
const {
  getVendors,
  getVendorById,
  createVendor,
  getMyProfile,
  updateMyProfile
} = require('../controllers/vendorController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getVendors);
router.get('/profile', protect, authorize('vendor'), getMyProfile);
router.put('/profile', protect, authorize('vendor'), updateMyProfile);
router.post('/', protect, authorize('vendor'), createVendor);
router.get('/:id', getVendorById);

module.exports = router;
