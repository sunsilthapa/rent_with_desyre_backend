// import
const router = require('express').Router();
const userController = require("../controllers/userController")

// create user api
router.post('/create', userController.createUser)

//  task 1: create login api
router.post('/login', userController.loginUser)

//* change password route
router.post('/change_password', userController.changePassword);

//* forgot password route
router.post('/forgot_password', userController.forgotPassword);

//*reset password link check route
router.get('/reset-password/:id/:token', userController.updatePasswordLinkCheck);

//* reset password route
router.post('/reset-password/:id/:token', userController.updatePassword);

//* update profile
router.put('/update_profile/:userId', userController.updateUserProfile);


router.get('/get_user_by_id/:userId', userController.getUserById);

router.get('/get_all_users', userController.getAllUsers);
// exporting
module.exports = router;