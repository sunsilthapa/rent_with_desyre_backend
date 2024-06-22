const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authGuard');

router.post('/', authMiddleware, cartController.addToCart);
router.get('/', authMiddleware, cartController.getUserCart);
router.delete('/:clothId', authMiddleware, cartController.removeFromCart);
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
