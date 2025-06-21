const Photo = require("../models/Photo");
const User = require("../models/User");

const mongoose = require("mongoose");

// Create a new photo
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;
  const user = await User.findById(reqUser._id);

  // Create a photo object
  const newPhoto = await Photo.create({
    image,
    title,
    likes: [],
    comments: [],
    userId: user._id,
    userName: reqUser.name,
  });

  // if photo is created successfully
  if (!newPhoto) {
    return res.status(422).json({ errors: ["Houve um erro, por favor tente mais tarde."] });
  }

  res.status(201).json(newPhoto);
};

module.exports = {
  insertPhoto,
};
