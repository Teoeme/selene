import express from 'express';
import cors from 'cors';
import { connectToDatabase, disconnectFromDatabase } from './infrastructure/database/connection';
import { config } from './config/env';
import apiRoutes from './interfaces/routes';
import { ErrorMiddleware } from './interfaces/middleware/ErrorMiddleware';

const app = express();
const port = config.server.port;

app.use(cors());
app.use(express.json());

app.use('/api/v1', apiRoutes);

app.get('/health', (_req, res) => {
  res.json({ 
    status: 'ok',
    service: 'benefit-management-system',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.handle);

process.on('SIGINT', async () => {
  console.log('Cerrando servidor...');
  await disconnectFromDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Cerrando servidor...');
  await disconnectFromDatabase();
  process.exit(0);
});

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  } catch (error) {
    console.error('Error iniciando servidor:', error);
    process.exit(1);
  }
}

startServer(); 