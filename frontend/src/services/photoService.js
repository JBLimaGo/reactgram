import { API, requestConfig } from "../utils/config";

// Public an user photo
const publishPhoto = async (data, token) => {
  const config = requestConfig("POST", data, token, true);
  try {
    const response = await fetch(API + "/photos", config)
      .then((response) => response.json())
      .catch((err) => err);

    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// Get user photos
const getUserPhotos = async (id, token) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(API + "/photos/user/" + id, config)
      .then((response) => response.json())
      .catch((err) => err);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// Get photo by id
const getPhoto = async (id, token) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(API + "/photos/" + id, config)
      .then((response) => response.json())
      .catch((err) => err);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

const deletePhoto = async (id, token) => {
    const config = requestConfig("DELETE", null, token);
  
    try {
      const res = await fetch(API + "/photos/" + id, config);
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.errors[0]);
      }
  
      return data;
    } catch (error) {
      throw error;
    }
  };

// Update a photo
const updatePhoto = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);
  try {
    const response = await fetch(API + "/photos/" + id, config)
      .then((response) => response.json())
      .catch((err) => err);

    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// Get all photos
const getPhotos = async (token) => {
  const config = requestConfig("GET", null, token);
  try {
    const response = await fetch(API + "/photos", config)
      .then((response) => response.json())
      .catch((err) => err);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// Like a photo
const likePhoto = async (id, token) => {
  const config = requestConfig("PUT", null, token);
  try {
    const response = await fetch(API + "/photos/like/" + id, config)
      .then((response) => response.json())
      .catch((err) => err);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// Add comment to a photo
const commentPhoto = async (data, id, token) => {
  const config = requestConfig("PUT", data, token);
  try {
    const response = await fetch(API + "/photos/coment/" + id, config)
      .then((response) => response.json())
      .catch((err) => err);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// Delete a comment
const deleteComment = async (photoId, commentId, token) => {
  const config = requestConfig("DELETE", null, token);
  try {
    const response = await fetch(API + "/photos/" + photoId + "/comment/" + commentId, config)
      .then((response) => response.json())
      .catch((err) => err);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

// Update a comment
const updateComment = async (data, photoId, commentId, token) => {
  const config = requestConfig("PUT", data, token);
  try {
    const response = await fetch(API + "/photos/" + photoId + "/comment/" + commentId, config)
      .then((response) => response.json())
      .catch((err) => err);
    return response;
  } catch (error) {
    console.log(error);
    return error.response.data;
  }
};

const photoService = {
  publishPhoto,
  getUserPhotos,
  getPhoto,
  deletePhoto,
  updatePhoto,
  getPhotos,
  likePhoto,
  commentPhoto,
  deleteComment,
  updateComment,
};

export default photoService;
