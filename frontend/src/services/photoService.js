import { API, requestConfig } from '../utils/config';

// Public an user photo
const publishPhoto = async (data, token) => {
    const config = requestConfig("POST", data, token, true);
    try {
        const response = await fetch(API + "/photos", config)
            .then((response) => response.json())
            .catch((err) => err);

        return response;
    }
    catch (error) {
        console.log(error);
        return error.response.data;
    }
}

const photoService = {
    publishPhoto,
};


export default photoService;