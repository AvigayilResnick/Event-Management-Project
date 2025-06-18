import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoute.js';
import clientRoutes from './routes/clientRoute.js';
import userRoutes from './routes/userRoute.js';

import pool from './db/dbConnection.js'; // Adjust the path as necessary
import roleRequestRoutes from './routes/roleRequestRoute.js';
import supplierRoutes from './routes/supplierRoute.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));


// Route to test database connection
app.get('/test-db', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT 1');
    res.json({ success: true, result: rows });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => {
    res.send('Hello World!');
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/client', clientRoutes);
app.use('/api/users', userRoutes);
  app.use('/api/roles', roleRequestRoutes);
  app.use('/api/suppliers', supplierRoutes);


// Start the server on a specified port or default to 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});