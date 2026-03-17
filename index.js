const express = require("express");
require("dotenv").config();
const authRoutes = require('./src/routes/authRoutes');
const doctorRoutes = require('./src/routes/doctorRoutes'); // ← add 
const appointmentRoutes  = require('./src/routes/appointmentRoutes'); // ← add
const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes); // ← add 
app.use('/api/appointments', appointmentRoutes); // ← add

// Health check
app.get('/', (req, res) => res.json({ status: 'ok' }));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});