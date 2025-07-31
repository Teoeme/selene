import mongoose from 'mongoose';
import { RequestStatus } from '../../../domain/value-objects/RequestStatus';

const BenefitRequestSchema = new mongoose.Schema({
    _id: {
    type: String,
  },
  benefitId: {
    type: String,
    required: true,
    ref: 'Benefit'
  },
  reason: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: Object.values(RequestStatus),
    default: RequestStatus.PENDING
  },
  requestDate: {
    type: Date,
    default: Date.now
  },
  resolutionDate: {
    type: Date,
    default: null
  },
  employeeId: {
    type: String,
    required: true,
    ref: 'User'
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

BenefitRequestSchema.index({ employeeId: 1 });
BenefitRequestSchema.index({ status: 1 });
BenefitRequestSchema.index({ companyId: 1 });
BenefitRequestSchema.index({ requestDate: 1 });

export const BenefitRequestModel = mongoose.model('BenefitRequest', BenefitRequestSchema); 