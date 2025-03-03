// Initialization
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/db'); // Import sequelize instance
const userRoute = require('./routes/userRoute');
const resumeRoute = require('./routes/resumeRoute');
require('./models/User'); // Ensure your models are imported
require('./models/Resume');

// Creating a Server
const app = express();

// Creating a Port
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/users', userRoute);
app.use('/resume', resumeRoute);

// Sync Sequelize Models and Start the Server
sequelize
  .sync({ force: false }) // Change force to true ONLY if you want to drop & recreate tables
  .then(() => {
    console.log("Database synchronized...");
    app.listen(PORT, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  })
  .catch((err) => console.error("Sequelize sync error:", err));
