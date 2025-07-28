const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('FYP Backend working');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
