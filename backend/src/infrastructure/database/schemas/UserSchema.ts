import mongoose from 'mongoose';
import { UserRole } from '../../../domain/value-objects/UserRole';

const UserSchema = new mongoose.Schema({
 _id: {
    type: String,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    select: false // No se incluye por defecto
  },
  role: {
    type: String,
    enum: Object.values(UserRole),
    required: true
  },
  companyId: {
    type: String,
    required: true,
    ref: 'Company'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  _id: false
});

export const UserModel = mongoose.model('User', UserSchema); 