const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://student-grievance-frontend-03x6.onrender.com'
  ],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', require('./routes/authRoutes'));
app.use('/api/grievances', require('./routes/grievanceRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Student Grievance API is running...' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB Connected Successfully');
    app.listen(process.env.PORT, () => {
      console.log(`✅ Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Failed:', err.message);
  });