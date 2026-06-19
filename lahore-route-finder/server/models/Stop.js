import mongoose from 'mongoose';

const stopSchema = new mongoose.Schema({
  name: { type: String, required: true },
  locationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  order: { type: Number }
}, { timestamps: true });

export default mongoose.model('Stop', stopSchema);
