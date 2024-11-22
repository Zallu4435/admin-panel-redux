const express = require('express');
const path = require('path');
const cors = require('cors');
const adminRoute = require('./routes/adminRoutes');
const userRoute = require('./routes/userRoutes');
const connectDB = require('./config/db');
const app = express();

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


connectDB()

// Routes
app.use('/api/admin', adminRoute);
app.use('/api/user', userRoute);

// Default Route
app.get('/', (req,res) => {
    res.send('API is running....');
});


// Erro handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({message: 'Server error'});
});


// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
