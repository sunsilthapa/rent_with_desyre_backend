const express = require('express');
const router = express.Router();
const shippingDetailsController = require('../controllers/shippingController');
const authMiddleware = require('../middleware/authGuard');

router.post('/', authMiddleware, shippingDetailsController.upsertShippingDetails);
router.get('/', authMiddleware, shippingDetailsController.getShippingDetails);

module.exports = router;
