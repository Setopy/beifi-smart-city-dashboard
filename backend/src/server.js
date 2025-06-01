const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware
// In your server.js file, replace the CORS middleware with this:
// Professional CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:5173',
      'https://smartcitydashboard.netlify.app',
      process.env.FRONTEND_URL
    ];
    
    // Allow requests with no origin (mobile apps, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
};

app.use(cors(corsOptions));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Import routes (we'll create these files shortly)
const metricsRoutes = require('./routes/metrics');
const authRoutes = require('./routes/auth');

// Routes

// Demo Authentication System for IPN Smart City Project
const DEMO_CREDENTIALS = {
  'dra.isaura': { 
    password: 'ipn_smartcity_2024', 
    role: 'DIRECTOR', 
    name: 'Dra. Isaura González Rubio Acosta',
    department: 'CITEDI - IPN',
    permissions: ['*'] // Full access
  },
  'admin': { 
    password: 'admin123', 
    role: 'CITY_MANAGER', 
    name: 'Administrador Municipal',
    department: 'Gestión Municipal',
    permissions: ['dashboard:read', 'reports:read', 'reports:export']
  },
  'operador': { 
    password: 'op123', 
    role: 'OPERATOR', 
    name: 'Operador de Sistema',
    department: 'Servicios Públicos',
    permissions: ['dashboard:read', 'alerts:read']
  },
  'publico': { 
    password: 'demo123', 
    role: 'PUBLIC_VIEWER', 
    name: 'Acceso Público',
    department: 'Ciudadanía',
    permissions: ['dashboard:read:public']
  }
};

// Demo login endpoint
app.post('/api/auth/demo-login', (req, res) => {
  const { username, password } = req.body;
  const user = DEMO_CREDENTIALS[username];
  
  if (user && user.password === password) {
    const token = jwt.sign(
      { 
        username, 
        role: user.role, 
        name: user.name,
        department: user.department,
        permissions: user.permissions
      },
      process.env.JWT_SECRET || 'ipn_demo_secret_2024',
      { expiresIn: '8h' }
    );
    
    res.json({ 
      token, 
      user: { 
        username, 
        role: user.role, 
        name: user.name,
        department: user.department,
        loginTime: new Date().toISOString()
      },
      message: 'Bienvenido al Sistema de Ciudad Inteligente IPN'
    });
  } else {
    res.status(401).json({ 
      error: 'Credenciales inválidas',
      message: 'Por favor verifique su usuario y contraseña'
    });
  }
});

// Public demo endpoint (no auth required for presentation)
app.get('/api/demo/dashboard', (req, res) => {
  const demoData = {
    userSatisfaction: { current: 85, trend: 2.5 },
    adoptionRate: { current: 62, trend: 1.8 },
    techUtilization: { current: 78, trend: -0.5 },
    marketCompetitiveness: { current: 7.5, trend: 0.3 },
    airQuality: { current: 75, trend: -2.1 },
    energyConsumption: { current: 234, trend: -3.2 },
    trafficFlow: { current: 82, trend: 1.5 },
    lastUpdated: new Date().toISOString(),
    projectInfo: {
      institution: 'Instituto Politécnico Nacional',
      center: 'CITEDI - Centro de Investigación y Desarrollo de Tecnología Digital',
      director: 'Dra. Isaura González Rubio Acosta',
      project: 'Sistema de Monitoreo de Ciudad Inteligente Beifi'
    }
  };
  res.json(demoData);
});


app.use('/api/metrics', metricsRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.status(200).json({ message: 'API is working!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: true,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received, shutting down gracefully');
  mongoose.disconnect();
  process.exit(0);
});
