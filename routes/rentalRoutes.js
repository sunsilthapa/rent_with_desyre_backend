const router = require('express').Router();
const rentalController = require('../controllers/rentalController');
const authMiddleware = require('../middleware/authGuard');

router.post('/', authMiddleware, rentalController.createRental);
router.get('/', authMiddleware, rentalController.getRentals);
router.get('/:id', authMiddleware, rentalController.getRental);
router.put('/:id', authMiddleware, rentalController.updateRental);
router.delete('/:id', authMiddleware, rentalController.deleteRental);

module.exports = router;
