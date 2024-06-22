const Stripe = require('stripe');
const stripe = Stripe('your_stripe_secret_key');
const Cart = require('../model/cartModel');
const Rental = require('../model/rentalModel');

// Process Payment
exports.processPayment = async (req, res) => {
  try {
    const { amount, tokenId } = req.body;
    const userId = req.user.userId;

    // Create a charge
    const charge = await stripe.charges.create({
      amount,
      currency: 'usd',
      source: tokenId,
      description: `Payment for user ${userId}`
    });

    // Assuming payment is successful, create rental records from cart
    const cart = await Cart.findOne({ userId }).populate('items.clothId');
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const rentals = cart.items.map(item => ({
      clothId: item.clothId,
      renterId: userId,
      ownerId: item.clothId.ownerId,
      startDate: item.startDate,
      endDate: item.endDate,
      status: 'approved'
    }));

    await Rental.insertMany(rentals);

    // Clear the cart after successful rental creation
    cart.items = [];
    await cart.save();

    res.json({ message: 'Payment successful and rentals created', charge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
