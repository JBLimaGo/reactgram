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

// like
const likePhoto = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ errors: ["ID inválido."] });
    }

    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    // Check if user already liked the photo
    const likeIndex = photo.likes.indexOf(reqUser._id);
    
    if (likeIndex > -1) {
      // Unlike: remove the like
      photo.likes.splice(likeIndex, 1);
      await photo.save();
      return res.status(200).json({ photoId: id, likes: photo.likes, userId: reqUser._id, message: "Curtida removida com sucesso." });
    } else {
      // Like: add the like
      photo.likes.push(reqUser._id);
      await photo.save();
      return res.status(200).json({ photoId: id, likes: photo.likes, userId: reqUser._id, message: "A Foto foi curtida com sucesso." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro ao curtir a foto."] });
  }
};

// Comment functionality 
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  if (!photo) {
    return res.status(404).json({ errors: ["Foto não encontrada."] });
  }

  // Put comment in the array comments
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id   
  };

  photo.comments.push(userComment);
  await photo.save();
  res.status(200).json({ photo: photo, comment: userComment, message: "Comentário adicionado com sucesso." });
}

// Delete a comment
const deleteComment = async (req, res) => {
  const { id, commentId } = req.params;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    const commentIndex = photo.comments.findIndex(
      (comment) => String(comment._id) === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ errors: ["Comentário não encontrado."] });
    }

    // Check if the comment belongs to the user
    if (!photo.comments[commentIndex].userId.equals(reqUser._id)) {
      return res.status(403).json({ errors: ["Você não tem permissão para deletar este comentário."] });
    }

    photo.comments.splice(commentIndex, 1);
    await photo.save();

    res.status(200).json({ photo: photo, message: "Comentário removido com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro ao deletar comentário."] });
  }
};

// Update a comment
const updateComment = async (req, res) => {
  const { id, commentId } = req.params;
  const { comment } = req.body;
  const reqUser = req.user;

  try {
    const photo = await Photo.findById(id);

    if (!photo) {
      return res.status(404).json({ errors: ["Foto não encontrada."] });
    }

    const commentIndex = photo.comments.findIndex(
      (c) => String(c._id) === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ errors: ["Comentário não encontrado."] });
    }

    // Check if the comment belongs to the user
    if (!photo.comments[commentIndex].userId.equals(reqUser._id)) {
      return res.status(403).json({ errors: ["Você não tem permissão para editar este comentário."] });
    }

    photo.comments[commentIndex].comment = comment;
    await photo.save();

    res.status(200).json({ photo: photo, message: "Comentário atualizado com sucesso." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errors: ["Erro ao atualizar comentário."] });
  }
};

// Search photos by title
const searchPhotos = async (req, res) => {
 const { q } = req.query;

 const photos = await Photo.find({title: new RegExp(q, "i")}).exec();

 res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getPhotoById,
  updatePhoto,
  likePhoto,
  commentPhoto,
  deleteComment,
  updateComment,
  searchPhotos,
};
