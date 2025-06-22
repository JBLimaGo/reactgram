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

// Remove a photo from DB
const deletePhoto = async (req, res) => {
  const { id } = req.params;  
  const reqUser = req.user;

  try {
    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errors: ["ID inválido."] });
    }

    const photo = await Photo.findById(id);

    // Check if photo exists
    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    // Check if photo belongs to the user
    if (!photo.userId.equals(reqUser._id)) {
      return res.status(403).json({ errors: ["Você não tem permissão para deletar esta foto."] });
    }

    await Photo.findByIdAndDelete(id);

    res.status(200).json({ id: photo._id, message: "Foto removida com sucesso." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ errors: ["Ocorreu um erro ao tentar deletar a foto."] });
  }
};

// Get all photos
const getAllPhotos = async (req, res) => {
  try { 
    const photos = await Photo.find().sort({ createdAt: -1 }).populate("userId", "name profileImage");
    res.status(200).json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro ao buscar fotos."] });
  }
}

// Get user photos
const getUserPhotos = async (req, res) => {
  const userId = req.user._id;

  try {
    const photos = await Photo.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(photos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro ao buscar fotos do usuário."] });
  }
};

// Get photo by ID
const getPhotoById = async (req, res) => {
  const { id } = req.params;

  try {
    const photo = await Photo.findById(id).populate("userId", "name profileImage");

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    res.status(200).json(photo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro ao buscar foto."] });
  }
};
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const reqUser = req.user;

 // console.log("ID recebido:", id);
  //console.log("Título recebido:", title);
 // console.log("Usuário autenticado:", reqUser);

  try {
    if (!title) {
      return res.status(400).json({ errors: ["O título é obrigatório."] });
    }

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    if (!photo.userId.equals(reqUser._id)) {
      return res.status(403).json({ errors: ["Você não tem permissão para atualizar esta foto."] });
    }

    photo.title = title;

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
  } catch (error) {
    console.error("Erro no servidor:", error);
    res.status(500).json({ errors: ["Erro interno no servidor."] });
  }
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
};
