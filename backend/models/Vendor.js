const mongoose = require('mongoose');

const CATEGORIES = [
  'Photography',
  'Catering',
  'Decoration',
  'Venue',
  'Music & DJ',
  'Makeup Artist'
];

const vendorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, 'Service category is required']
    },
    description: {
      type: String,
      default: 'Professional event services tailored to your occasion.'
    },
    location: {
      type: String,
      required: [true, 'Business location is required'],
      trim: true
    },
    price: {
      type: Number,
      default: 0,
      min: 0
    },
    image: {
      type: String,
      default:
        'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80'
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  { timestamps: true }
);

vendorSchema.index({ businessName: 'text', location: 'text', category: 'text' });

module.exports = mongoose.model('Vendor', vendorSchema);
module.exports.CATEGORIES = CATEGORIES;
