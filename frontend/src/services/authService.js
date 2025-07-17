import { API, requestConfig } from "../utils/config";

// Register an user
const register = async (user) => {
  const config = requestConfig("POST", user);

  try {
    const res = await fetch(`${API}/users/register`, config)
      .then((res) => res.json())
      .catch((err) => err);

    if (res) {
      localStorage.setItem("user", JSON.stringify(res));
    }
    
    return res;
  } catch (error) {
    console.log(error);
  }
};

const authService = {
  register,
};

export default authService;
