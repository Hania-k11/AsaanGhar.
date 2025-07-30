const express = require("express");
const cors = require("cors");
const app = express();
const searchRoutes = require("./routes/search"); // 👈

app.use(cors());
app.use(express.json());

app.use("/api/search", searchRoutes); // 👈 route

app.listen(5000, () => {
  console.log("Server running on port 5000");

const searchRoutes = require('./routes/search');
app.use('/api/search', searchRoutes);


app.get('/', (req, res) => {
  res.send('FYP Backend working');
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
