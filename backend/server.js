const express = require("express");
const cors = require("cors");
const app = express();
const searchRoutes = require("./routes/search"); // 👈

app.use(cors());
app.use(express.json());

app.use("/api/search", searchRoutes); // 👈 route

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
