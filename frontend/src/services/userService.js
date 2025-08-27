import { API, requestConfig } from "../utils/config";

// Get user details
const profile = async (data, token) => {
  const config = requestConfig("GET", data, token);

  try {
    const res = await fetch(API + "/users/profile", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
};

const updateProfile = async (data, token) => {
  const config = requestConfig("PUT", data, token, true);

  try {
    const res = await fetch(API + "/users", config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
};

// Get user details
const getUserDetails = async (id, token) => {
  const config = requestConfig("GET", null, token);

  try {
    const res = await fetch(API + "/users/" + id, config)
      .then((res) => res.json())
      .catch((err) => err);

    return res;
  } catch (error) {
    console.log(error);
    throw error.response.data;
  }
};

const userService = {
  profile,
  updateProfile,
  getUserDetails,
  // Aqui você pode adicionar mais funções relacionadas ao usuário
};

export default userService;
