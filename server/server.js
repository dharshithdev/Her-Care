const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();
const path = require("path");
const {connectToDB} = require("./Config/connect");

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json())

const userRoutes = require('./routes/userRoutes');
const cycleRoutes = require('./routes/trackRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const productRoutes = require('./routes/productRoutes');
const dailyRoutes = require('./routes/dailyRoutes');

app.use('/api/users', userRoutes);
app.use('/api/track', cycleRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/shop', productRoutes);
app.use('/api/daily', dailyRoutes);

app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

connectToDB().then(() => {
    app.listen(PORT, () => {
        console.log("Server Running on PORT ", PORT);
    });
});
