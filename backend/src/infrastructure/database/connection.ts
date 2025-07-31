import mongoose from 'mongoose';
import { config } from '../../config/env';

export async function connectToDatabase(): Promise<void> {
  try {
    await mongoose.connect(config.database.uri,
      {dbName: config.database.name}
    );
    console.log('Conexio exitosa a MongoDB');
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    process.exit(1);
  }
}

export async function disconnectFromDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  } catch (error) {
    console.error('Error desconectando de MongoDB:', error);
  }
} 