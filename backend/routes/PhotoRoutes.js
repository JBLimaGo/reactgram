const express = require('express');
const router = express.Router();

// Controller
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
} = require('../controllers/PhotoController');

// Middlewares
const {
  photoInsertValidation,
  photoUpdateValidation,
} = require('../middlewares/PhotoValidation');
const authGuard = require('../middlewares/authGuard');
const validate = require('../middlewares/handleVAlidations');
const { imageUpload } = require('../middlewares/imageUpload');

// Routes
router.post("/", authGuard, imageUpload.single('image'),
  photoInsertValidation(),
  validate,
  insertPhoto
);
router.delete("/:id", authGuard, deletePhoto); // Assuming deletePhoto is defined in PhotoController 
router.get("/", authGuard, getAllPhotos);
router.get("/user/:id", authGuard, getUserPhotos) // Assuming deletePhoto is defined in PhotoController 
router.get("/:id", authGuard, getPhotoById); // Assuming getPhotoById is defined in PhotoController
router.put("/:id", authGuard, photoUpdateValidation(), validate, updatePhoto); // Assuming updatePhoto is defined in PhotoController

module.exports = router;
