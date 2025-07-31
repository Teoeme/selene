import mongoose from 'mongoose';
import { BenefitType } from '../../../domain/value-objects/BenefitType';

const BenefitSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: Object.values(BenefitType),
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
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
});

export const BenefitModel = mongoose.model('Benefit', BenefitSchema); 