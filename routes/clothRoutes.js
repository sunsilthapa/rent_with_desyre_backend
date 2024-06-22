
const router = require('express').Router();
const clothController = require('../controllers/clothController');
const authMiddleware = require('../middleware/authGuard');

// router.post('/', authMiddleware, clothController.uploadCloth);
router.get('/', clothController.getClothes);
router.get('/:id', clothController.getCloth);
router.put('/:id', authMiddleware, clothController.updateCloth);
router.delete('/:id', authMiddleware, clothController.deleteCloth);

module.exports = router;
