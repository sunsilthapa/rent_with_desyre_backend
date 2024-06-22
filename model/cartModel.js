const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [
    {
      clothId: { type: mongoose.Schema.Types.ObjectId, ref: 'Cloth', required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true }
    }
  ],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', cartSchema);
