// Import routes
const authRoutes = require('./routes/auth');
const medicineRoutes = require('./routes/medicines');
const consultationRoutes = require('./routes/consultations');
// const orderRoutes = require('./routes/orders'); // Temporarily disabled due to file sync issue
const chatRoutes = require('./routes/chat');
const userRoutes = require('./routes/users');
// Products route - temporarily disabled due to file issues
// const productRoutes = require('./routes/products');

// Use in-memory database instead of MongoDB
const inMemoryDB = {
  users: [],
  products: [],
  orders: [],
  consultations: [],
  chathistory: [],
  
  // Find documents matching query
  find: function(collection, query = {}) {
    let results = [...this[collection]];
    
    // Apply query filters
    Object.keys(query).forEach(key => {
      if (key === '$or') {
        const orConditions = query[key];
        results = results.filter(doc => 
          orConditions.some(condition => 
            Object.keys(condition).every(orKey => 
              String(doc[orKey]).toLowerCase().includes(String(condition[orKey]).toLowerCase())
            )
          )
        );
      } else {
        results = results.filter(doc => {
          if (typeof query[key] === 'object' && query[key].$regex) {
            const regex = new RegExp(query[key].$regex, query[key].$options || 'i');
            return regex.test(doc[key]);
          } else if (typeof query[key] === 'object' && query[key].$in) {
            return query[key].$in.includes(doc[key]);
          } else {
            return doc[key] === query[key];
          }
        });
      }
    });
    
    return results;
  },
  
  // Find single document
  findOne: function(collection, query) {
    const results = this.find(collection, query);
    return results.length > 0 ? results[0] : null;
  },
  
  // Find by ID
  findById: function(collection, id) {
    return this[collection].find(doc => doc._id === id);
  },
  
  // Insert document
  insertOne: function(collection, document) {
    const autoIncrement = {
      users: 1,
      products: 1,
      orders: 1,
      consultations: 1,
      chathistory: 1
    };
    
    const newDoc = {
      ...document,
      _id: `${collection}_${autoIncrement[collection]++}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this[collection].push(newDoc);
    return newDoc;
  },
  
  // Update document by ID
  updateOne: function(collection, id, update) {
    const index = this[collection].findIndex(doc => doc._id === id);
    if (index !== -1) {
      const oldDoc = this[collection][index];
      this[collection][index] = {
        ...oldDoc,
        ...update,
        _id: oldDoc._id,
        updatedAt: new Date().toISOString()
      };
      return this[collection][index];
    }
    return null;
  },
  
  // Delete document by ID
  deleteOne: function(collection, id) {
    const index = this[collection].findIndex(doc => doc._id === id);
    if (index !== -1) {
      const deleted = this[collection].splice(index, 1)[0];
      return deleted;
    }
    return null;
  },
  
  // Count documents
  countDocuments: function(collection, query = {}) {
    return this.find(collection, query).length;
  }
};

const simpleDB = {
  // User model functions
  User: {
    create: (data) => inMemoryDB.insertOne('users', data),
    find: (query, options) => inMemoryDB.find('users', query, options),
    findOne: (query) => inMemoryDB.findOne('users', query),
    findById: (id) => inMemoryDB.findById('users', id),
    updateOne: (id, update) => inMemoryDB.updateOne('users', id, update),
    deleteOne: (id) => inMemoryDB.deleteOne('users', id),
    countDocuments: (query) => inMemoryDB.countDocuments('users', query)
  },
  
  // Product model functions
  Product: {
    create: (data) => inMemoryDB.insertOne('products', data),
    find: (query, options) => inMemoryDB.find('products', query, options),
    findOne: (query) => inMemoryDB.findOne('products', query),
    findById: (id) => inMemoryDB.findById('products', id),
    updateOne: (id, update) => inMemoryDB.updateOne('products', id, update),
    deleteOne: (id) => inMemoryDB.deleteOne('products', id),
    countDocuments: (query) => inMemoryDB.countDocuments('products', query),
  },
  
  // Connection simulation
  connect: async () => {
    console.log('✅ In-Memory DB connected');
    return true;
  }
};

// Initialize Express app
const app = express();
let PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Stricter rate limiting for sensitive endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth', authLimiter);

// Middleware
app.use(compression());
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests from any origin for development, including file:// (origin === undefined/null)
    if (!origin) return callback(null, true);
    const allowed = [
      process.env.FRONTEND_URL,
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost',
      'http://127.0.0.1'
    ].filter(Boolean);
    if (allowed.includes(origin)) return callback(null, true);
    // Fallback: allow all for development
    return callback(null, true);
  },
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(morgan('combined'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/consult', consultationRoutes);
// app.use('/api/orders', orderRoutes); // Temporarily disabled
// app.use('/api/order', orderRoutes); // Temporarily disabled
app.use('/api/chat', chatRoutes);
app.use('/api/users', userRoutes);
// app.use('/api/products', productRoutes); // Temporarily disabled

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Aditya Medical API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Serve frontend files
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/products', (req, res) => {
  res.sendFile(path.join(__dirname, 'products.html'));
});

app.get('/ai-recommendations', (req, res) => {
  res.sendFile(path.join(__dirname, 'ai-recommendations.html'));
});

app.get('/consultation-booking', (req, res) => {
  res.sendFile(path.join(__dirname, 'consultation-booking.html'));
});

app.get('/prescription-upload', (req, res) => {
  res.sendFile(path.join(__dirname, 'prescription-upload.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'contact.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Authentication pages
app.get('/client-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-login.html'));
});

app.get('/admin-login', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-login.html'));
});

// Client pages
app.get('/client-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'client-dashboard.html'));
});

// Admin pages
app.get('/admin-dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-dashboard.html'));
});

app.get('/admin-products', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-products.html'));
});

app.get('/admin-orders', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-orders.html'));
});

app.get('/admin-prescriptions', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-prescriptions.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors: errors
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // MongoDB duplicate key error
  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: 'Duplicate entry found'
    });
  }
  
  // Default error
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// 404 handler for other routes
app.use('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});

// Database connection
const connectDB = async () => {
  try {
    // Use simple in-memory database instead of MongoDB
    await simpleDB.connect();
    console.log('✅ SimpleDB Connected Successfully (in-memory)');
    return true;
  } catch (error) {
    console.error('❌ SimpleDB connection error:', error.message);
    console.log('📄 Running without database - using mock data');
    return false;
  }
};

// Start server
const startServer = async () => {
  try {
    const dbConnected = await connectDB();

    // SimpleDB doesn't need seeding like MongoDB
    if (dbConnected) {
      console.log('✅ SimpleDB is ready for use');
    } else {
      console.log('📄 Running without database - using mock data');
    }
    
    app.listen(PORT, () => {
      console.log('🚀 =================================');
      console.log(`🏥 Aditya Medical Server Running`);
      console.log(`📍 URL: http://localhost:${PORT}`);
      console.log(`⚕️  API: http://localhost:${PORT}/api`);
      console.log(`🤖 Jarvis AI: Ready for consultations`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('🚀 =================================');
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();

module.exports = app;