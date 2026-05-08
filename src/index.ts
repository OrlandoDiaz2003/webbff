import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import agendaRoutes from './routes/agenda.routes';
import paymentRoutes from './routes/payments.routes';
import propertyRoutes from './routes/property.routes';
import userRoutes from './routes/users.routes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Routes
app.use('/api/v0/agenda', agendaRoutes);
app.use('/payments', paymentRoutes);
app.use('/api/v0/propiedad', propertyRoutes);
app.use('/users', userRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the WeedBFF API' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
