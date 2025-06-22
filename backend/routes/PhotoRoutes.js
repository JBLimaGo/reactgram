const express = require('express');
const router = express.Router();

// Controller
const {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
} = require('../controllers/PhotoController');

// Middlewares
const {
  photoInsertValidation,
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
router.get("/", authGuard, getAllPhotos); // Assuming deletePhoto is defined in PhotoController 

module.exports = router;
