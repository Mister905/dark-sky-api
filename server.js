const express = require("express");
var cors = require("cors");
const app = express();
const router = express.Router();
const path = require('path');

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

app.use(express.json());
app.use(cors());
app.use(express.static("public"));

// ROUTES
const weather = require("./routes/api/weather");
app.use("/api/weather", weather);

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server Listening on Port ${port}`);
});
