const User = require("../models/User");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const jwtSecret = process.env.JWT_SECRET;

// Genereate user token
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "7d",
  });
};

// Register user and sign in
const register = async (req, res) => {
  // res.send("Registro de Usuário!!");
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(422).json({ erros: ["Por favor, utilize outro e-mail"] });
    return;
  }

  // Generate password hash
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  // Create user
  const newUser = await User.create({
    name,
    email,
    password: passwordHash,
  });

  // if user was created successfully, return the token
  if (!newUser) {
    res
      .status(422)
      .json({ errors: ["Houve um erro, por favor tente mais tarde."] });
    return;
  }

  res.status(201).json({
    _id: newUser._id,
    token: generateToken(newUser._id),
  });
};

// Sign user in
const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404).json({ errors: ["Usuário não encontrado."] });
    return;
  }

  // check is password matches
  if (!(await bcrypt.compare(password, user.password))) {
    res.status(422).json({ erros: ["Senha inválida."] });
    return;
  }

  // Return user with token
  res.status(201).json({
    _id: user._id,
    profileImage: user.profileImage,
    token: generateToken(user._id),
  });
};

// Get current logged is user
const getCurrentUser = async (req, res) => {
  const user = req.user;

  res.status(200).json(user);
};

// Update an user
const update = async (req, res) => {
  const { name, password, bio } = req.body;

  let profileImage = null;
  if (req.file) {
    profileImage = req.file.filename;
  }

  const reqUser = req.user;

  try {
    const user = await User.findById(reqUser._id).select("-password");

    if (!user) {
      return res.status(404).json({ errors: ["Usuário não encontrado."] });
    }

    if (name) {
      user.name = name;
    }

    if (password) {
      const salt = await bcrypt.genSalt();
      const passwordHash = await bcrypt.hash(password, salt);
      user.password = passwordHash;
    }

    if (profileImage) {
      user.profileImage = profileImage;
    }

    if (bio) {
      user.bio = bio;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ errors: ["Erro ao atualizar usuário."] });
  }
};

// Get user by ID
const getUserById = async (req, res) => {
  const id = req.params.id;

  // Check if user exists
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(422).json({ errors: ["Usuário não encontrado."] });
  }

  const user = await User.findById(id).select("-password");

  if (!user) {
    return res.status(404).json({ errors: ["Usuário não encontrado."] });
  }

  res.status(200).json(user);
};

module.exports = {
  register,
  login,
  getCurrentUser,
  update,
  getUserById,
};
