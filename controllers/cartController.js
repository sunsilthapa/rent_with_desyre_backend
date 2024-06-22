const Cart = require('../model/cartModel');

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ userId: req.user.userId });
    const newItem = {
      clothId: req.body.clothId,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    };
    
    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [newItem] });
    } else {
      cart.items.push(newItem);
    }
    
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get User Cart
exports.getUserCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate('items.clothId');
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    cart.items = cart.items.filter(item => item.clothId.toString() !== req.params.clothId);
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Clear Cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
