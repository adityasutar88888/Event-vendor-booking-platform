const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');
const createApp = require('../app');
const User = require('../models/User');
const Vendor = require('../models/Vendor');

process.env.JWT_SECRET = process.env.JWT_SECRET || 'eventease_dev_secret_change_in_production';
process.env.CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

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
    description: 'Wedding and event photography with natural light portraits and candid coverage.'
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
    description: 'Custom menus for weddings and receptions with vegetarian and non-vegetarian options.'
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
    description: 'Floral installations, stage design, and lighting for banquet halls.'
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
    description: 'Heritage lawn and indoor hall for ceremonies of 80 to 400 guests.'
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
    description: 'DJ and live percussion sets with professional sound equipment.'
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
    description: 'Bridal and party makeup using long-wear products.'
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
    description: 'Candid and cinematic coverage for engagements and destination events.'
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
    description: 'Boutique catering for intimate gatherings with plated service.'
  }
];

const start = async () => {
  const mongod = await MongoMemoryServer.create();
  await mongoose.connect(mongod.getUri());

  for (const item of vendors) {
    const user = await User.create({
      name: item.ownerName,
      email: item.email,
      phone: item.phone,
      password: 'vendor123',
      role: 'vendor'
    });
    await Vendor.create({ ...item, userId: user._id });
  }

  const app = createApp();
  const port = process.env.PORT || 5000;
  app.listen(port, () => {
    console.log(`EventEase API (in-memory MongoDB) running on port ${port}`);
  });
};

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
