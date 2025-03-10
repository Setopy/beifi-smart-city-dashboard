const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Metric = require('../src/models/Metric');
const User = require('../src/models/User');

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected for seeding'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Generate random metrics
const generateMetrics = async () => {
  const metricTypes = [
    'userSatisfaction',
    'adoptionRate',
    'techUtilization',
    'marketCompetitiveness',
    'investmentLevels',
    'innovationRates'
  ];

  const now = new Date();
  const metrics = [];

  // Generate 6 months of daily data
  for (let i = 0; i < 180; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);

    metricTypes.forEach(type => {
      let baseValue = 0;
      switch (type) {
        case 'userSatisfaction':
          baseValue = 85;
          break;
        case 'adoptionRate':
          baseValue = 62;
          break;
        case 'techUtilization':
          baseValue = 78;
          break;
        case 'marketCompetitiveness':
          baseValue = 7.5;
          break;
        case 'investmentLevels':
          baseValue = 120;
          break;
        case 'innovationRates':
          baseValue = 15;
          break;
      }

      // Add some random variation
      const variation = (Math.random() - 0.5) * 10;
      const value = baseValue + variation;

      metrics.push({
        type,
        value: Number(value.toFixed(2)),
        date,
      });
    });
  }

  // Clear existing metrics
  await Metric.deleteMany({});

  // Insert new metrics
  await Metric.insertMany(metrics);
  console.log(`${metrics.length} metrics inserted`);
};

// Create admin user
const createAdminUser = async () => {
  // Clear existing users
  await User.deleteMany({});

  // Create admin user
  const admin = new User({
    name: 'Admin User',
    email: 'admin@beifi.mx',
    password: 'admin123', // Change this in production!
    role: 'admin',
  });

  await admin.save();
  console.log('Admin user created');
};

// Run seeding
const seedDatabase = async () => {
  try {
    await generateMetrics();
    await createAdminUser();
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDatabase();
