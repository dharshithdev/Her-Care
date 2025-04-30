const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const userRoutes = require('./routes/userRoutes');

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/users', userRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`Connected To MongoDB`);
    app.listen(PORT, () => {
        console.log(`Serever Running on PORT : ${PORT}`);
    });
}).catch((err) => {
    console.log(`Error Running Server ${err.message}`);
});