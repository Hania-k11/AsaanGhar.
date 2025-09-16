
const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require('cors');
require('dotenv').config();



const app = express();


app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true
}));


app.use(express.json());
app.use(cookieParser());
app.use((req, res, next) => {
  console.log(`🔥 Received ${req.method} on ${req.path}`);
  next();
});


const geminiRoutes = require('./routes/gemininlp'); 
app.use('/api/gemininlp', geminiRoutes);


const cohereRoutes = require('./routes/cohere'); 
app.use('/api/cohere', cohereRoutes);

const cohereallRoutes = require('./routes/cohereall'); 
app.use('/api/cohereall', cohereallRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const propertiesRoutes = require('./routes/properties');
app.use('/api/properties', propertiesRoutes);

const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);


const propertyRoutes = require('./routes/property');
app.use('/api/property', propertyRoutes);

const searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);


app.get('/', (req, res) => {
  res.send('FYP Backend working');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});