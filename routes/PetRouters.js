const petRouter = require('express').Router();

//  Pet's controllers 

const PetController = require('../controllers/PetController');

// middlewares 

const verifyToken = require('../helpers/verify-token');
const { imageUpload } = require('../helpers/images-upload');

// Routes of the Application

petRouter.post('/create/:id', verifyToken, imageUpload.array('images'), PetController.create);
petRouter.get('/', PetController.getALL);
petRouter.get('/mypets/:id', verifyToken,  PetController.getAllUserPets);
petRouter.get('/myadoptions/:id', verifyToken,  PetController.getUserAdoptions);
petRouter.get('/:id', verifyToken, PetController.getPetById);
petRouter.delete('/:id', verifyToken, PetController.deletePetById);
petRouter.patch('/:id', verifyToken,  imageUpload.array('images'),  PetController.updatedPet);
petRouter.patch('/schedule/:id', verifyToken, PetController.schedule);
petRouter.patch('/conclude/:id', verifyToken, PetController.concludePet);
module.exports = petRouter;

