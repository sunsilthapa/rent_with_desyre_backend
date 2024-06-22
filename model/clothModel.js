const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clothSchema = new Schema({
  ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  size: { type: String, required: true },
  color: { type: String, required: true },
  brand: { type: String, required: true },
  condition: { type: String, required: true },
  rentalPrice: { type: Number, required: true },
  availability: [
    {
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true }
    }
  ],
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cloth', clothSchema);
