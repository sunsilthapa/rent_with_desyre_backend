const express = require("express");
const dotenv = require('dotenv');
const cors = require('cors');
const cloudinary = require('cloudinary');
const acceptMultimedia = require('connect-multiparty');
const connectToDB = require('./database/db.js');

const userRoutes = require('./routes/userRoutes');
const clothRoutes = require('./routes/clothRoutes');
const rentalRoutes = require('./routes/rentalRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const cartRoutes = require('./routes/cartRoutes');
const shippingDetailsRoutes = require('./routes/shippingRoutes.js');
const paymentRoutes = require('./routes/paymentRoutes');

//* Making express app
const app = express();

//* Configuring dotenv
dotenv.config();

//* Cloudinary config
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

//* Middleware for handling multipart/form-data
app.use(acceptMultimedia());

//* CORS config to accept requests from frontend
app.use(cors({
    origin: true,
    credentials: true,
    optionSuccessStatus: 200
}));

//* Set EJS as the view engine
app.set('view engine', 'ejs');

//* Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

//* Middleware for parsing JSON bodies
app.use(express.json());

// Serve static files from the 'images' directory
app.use('/images', express.static('images'));

//* Connect to the database
connectToDB();

//* Define routes
app.use('/api/user', userRoutes);
app.use('/api/clothes', clothRoutes);
app.use('/api/rentals', rentalRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/shipping', shippingDetailsRoutes);
app.use('/api/payment', paymentRoutes);

//* Define a simple /test route
app.get('/test', (req, res) => {
    res.send('Server is running and test endpoint is working!');
});


//* Define port
const PORT = process.env.PORT || 5000;

//* Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


module.exports = app;