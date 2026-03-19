require('dotenv').config();
const express           = require('express');
const cors              = require('cors');
const authRoutes        = require('./src/routes/authRoutes');
const doctorRoutes      = require('./src/routes/doctorRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));

app.use(express.json());

app.use('/api/auth',         authRoutes);
app.use('/api/doctors',      doctorRoutes);
app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});