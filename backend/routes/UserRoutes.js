const router = require('express').Router();
const UserController = require('../controllers/UserController');
const PetController = require('../controllers/PetController');

// middlewares has been used;

const checkToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/images-upload');


// Controller's routes
// Users Routers

router.post('/register', UserController.register);
router.get('/data', UserController.data);
router.post('/login', UserController.Login);
router.get('/checkUser/:id', UserController.checkUser);
router.get('/:id', UserController.getUserById);
router.patch('/edit/:id', checkToken, imageUpload.single('image'), UserController.userUpdate);


// Pet Routers 
router.get('/', PetController.create);


module.exports = router;