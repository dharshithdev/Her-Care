const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();
const path = require("path");

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json())

const userRoutes = require('./routes/userRoutes');
const cycleRoutes = require('./routes/trackRoutes');


app.use('/api/users', userRoutes);
app.use('/api/track', cycleRoutes);


mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`Connected to MongoDB`);
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`);
    });
}).catch((err) => {
    console.log(`Server failed to Connect : ${err}`);
});