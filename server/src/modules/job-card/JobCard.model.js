import mongoose from 'mongoose';

const jobCardSchema = new mongoose.Schema(
  {
    vehicleId: { type: String, required: true },
    customerName: { type: String, required: true },
    status: { type: String, default: 'open' },
  },
  { timestamps: true }
);

const JobCard = mongoose.model('JobCard', jobCardSchema);

export default JobCard;
