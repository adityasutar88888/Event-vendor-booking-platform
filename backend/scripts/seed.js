const dotenv = require('dotenv');
const path = require('path');
const mongoose = require('mongoose');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const vendors = [
  {
    ownerName: 'Aarav Mehta',
    email: 'aarav@lumenframes.test',
    phone: '9876500001',
    businessName: 'Lumen Frames',
    category: 'Photography',
    location: 'Mumbai',
    price: 25000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    description:
      'Wedding and event photography with natural light portraits, candid coverage, and a complete highlight album.'
  },
  {
    ownerName: 'Priya Nair',
    email: 'priya@spiceandpetal.test',
    phone: '9876500002',
    businessName: 'Spice & Petal Catering',
    category: 'Catering',
    location: 'Bengaluru',
    price: 850,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=1600&q=80',
    description:
      'Custom menus for weddings and receptions, from regional thalis to live counters, with vegetarian and non-vegetarian options.'
  },
  {
    ownerName: 'Rohan Kapoor',
    email: 'rohan@gildedbloom.test',
    phone: '9876500003',
    businessName: 'Gilded Bloom Decor',
    category: 'Decoration',
    location: 'Delhi',
    price: 40000,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1600&q=80',
    description:
      'Floral installations, stage design, and lighting concepts that turn banquet halls into memorable event spaces.'
  },
  {
    ownerName: 'Ananya Sharma',
    email: 'ananya@theivorycourt.test',
    phone: '9876500004',
    businessName: 'The Ivory Court',
    category: 'Venue',
    location: 'Jaipur',
    price: 150000,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1600&q=80',
    description:
      'A heritage lawn and indoor hall for ceremonies of 80 to 400 guests, with on-site coordination and parking.'
  },
  {
    ownerName: 'Vikram Singh',
    email: 'vikram@nightharvest.test',
    phone: '9876500005',
    businessName: 'Night Harvest Sounds',
    category: 'Music & DJ',
    location: 'Pune',
    price: 18000,
    rating: 4.5,
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1600&q=80',
    description:
      'DJ and live percussion sets for sangeet, cocktail nights, and corporate parties with professional sound equipment.'
  },
  {
    ownerName: 'Meera Joshi',
    email: 'meera@ateliernoir.test',
    phone: '9876500006',
    businessName: 'Atelier Noir Makeup',
    category: 'Makeup Artist',
    location: 'Hyderabad',
    price: 12000,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80',
    description:
      'Bridal and party makeup using long-wear products, with trials available for wedding parties and photoshoots.'
  },
  {
    ownerName: 'Kabir Rao',
    email: 'kabir@goldenhour.test',
    phone: '9876500007',
    businessName: 'Golden Hour Studio',
    category: 'Photography',
    location: 'Chennai',
    price: 22000,
    rating: 4.4,
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148863?auto=format&fit=crop&w=1600&q=80',
    description:
      'Candid and cinematic coverage for engagements, birthdays, and destination events with next-day previews.'
  },
  {
    ownerName: 'Sana Qureshi',
    email: 'sana@marigoldtable.test',
    phone: '9876500008',
    businessName: 'Marigold Table',
    category: 'Catering',
    location: 'Mumbai',
    price: 950,
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=80',
    description:
      'Boutique catering for intimate gatherings, with plated service, dessert stations, and dietary customization.'
  }
];

const seed = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri || uri.includes('your_mongodb_connection_string')) {
    console.error('Set MONGODB_URI in backend/.env before seeding.');
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log('Connected. Seeding sample vendors...');

  for (const item of vendors) {
    let user = await User.findOne({ email: item.email });
    if (!user) {
      user = await User.create({
        name: item.ownerName,
        email: item.email,
        phone: item.phone,
        password: 'vendor123',
        role: 'vendor'
      });
    }

    const existingVendor = await Vendor.findOne({ userId: user._id });
    if (!existingVendor) {
      await Vendor.create({
        userId: user._id,
        businessName: item.businessName,
        ownerName: item.ownerName,
        email: item.email,
        phone: item.phone,
        category: item.category,
        description: item.description,
        location: item.location,
        price: item.price,
        image: item.image,
        rating: item.rating
      });
      console.log(`Created vendor: ${item.businessName}`);
    } else {
      console.log(`Skipped existing vendor: ${item.businessName}`);
    }
  }

  await mongoose.disconnect();
  console.log('Seed complete. Demo vendor password: vendor123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
