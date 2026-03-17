const express = require("express");
require("dotenv").config();
const authRoutes = require('./src/routes/authRoutes');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Health check
app.get('/', (req, res) => res.json({ status: 'ok' }));


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});