const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose")
require("dotenv").config();

const PORT = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json())

const userRoutes = require('./Routes/userRoutes');
app.use('/api/users', userRoutes);
 
const sanOrderRoutes = require("./Routes/sanRoutes");
app.use('/api/shop', sanOrderRoutes);

const craveOrderRoutes = require("./Routes/craveRoutes");
app.use("/api/shop", craveOrderRoutes);

const appoinmentRoutes = require("./Routes/appoinmentRoutes");
app.use('/api/appoinments', appoinmentRoutes);

mongoose.connect(process.env.MONGO_URI).then(() => {
    console.log(`Connected to MongoDB`);
    app.listen(PORT, () => {
        console.log(`Server running on PORT ${PORT}`);
    });
}).catch((err) => {
    console.log(`Server failed to Connect : ${err}`);
});