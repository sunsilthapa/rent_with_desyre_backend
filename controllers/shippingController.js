const ShippingDetails = require('../model/shippingModel');

// Add or Update Shipping Details
exports.upsertShippingDetails = async (req, res) => {
  try {
    const {fullName, email, phoneNo, address, city, state, zipCode } = req.body;
    const shippingDetails = await ShippingDetails.findOneAndUpdate(
      { userId: req.user.userId },
      { fullName, email, phoneNo, address, city, state, zipCode },
      { new: true, upsert: true }
    );
    res.json(shippingDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Shipping Details
exports.getShippingDetails = async (req, res) => {
  try {
    const shippingDetails = await ShippingDetails.findOne({ userId: req.user.userId });
    res.json(shippingDetails);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
