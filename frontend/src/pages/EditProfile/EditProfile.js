import "./EditProfile.css";

import { uploads } from "../../utils/config";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { profile, resetMessage, updateProfile } from "../../slices/userSlice";

// Componentes
import Message from "../../components/Message";

const EditProfile = () => {
  const dispatch = useDispatch();
  //const { user: authUser } = useSelector((state) => state.auth);
  const { user, loading, error, message } = useSelector((state) => state.user);

  // States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setImageProfile] = useState("");
  const [bio, setBio] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  // Load user data
  useEffect(() => {
    dispatch(profile());
  }, [dispatch]);

  // Fill form with user data
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setBio(user.bio);
    }
  }, [user]);

  console.log("User data:", user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    // Gather user data from states
    const userData = {
      name,
    };

    if (profileImage) {
      userData.profileImage = profileImage;
    }

    if (bio) {
      userData.bio = bio;
    }

    if (password) {
      userData.password = password;
    }

    // build form data
    const formData = new FormData();

    const userFormData = Object.keys(userData).forEach((key) =>
      formData.append(key, userData[key])
    );

    formData.append("user", userFormData);

    await dispatch(updateProfile(formData));

    setTimeout(() => {
      dispatch(resetMessage());
    }, 3000);

    console.log("Formulário enviado");
  };

  const handleFile = (e) => {
    // Verifica se há uma imagem selecionada
    const image = e.target.files[0];
    setPreviewImage(image);

    // update profileImage state
    setImageProfile(image);
  };

  return (
    <div id="edit-profile">
      <h2>Editar Perfil</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil e conte mais sobre você...
      </p>
      {user && (user.profileImage || previewImage) && (
        <img
          className="profile-image"
          src={
            previewImage
              ? URL.createObjectURL(previewImage)
              : `${uploads}/users/${user.profileImage}`
          }
          alt={user.name}
        />
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome"
          value={name || ""}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email || ""}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>
          <span>Imagem de perfil:</span>
          <input type="file" onChange={handleFile} />
        </label>
        <label>
          <span>Sobre você:</span>
          <input
            type="text"
            placeholder="Descrição do perfil"
            value={bio || ""}
            onChange={(e) => setBio(e.target.value)}
          />
        </label>
        <label>
          <span>Senha para alterar:</span>
          <input
            type="password"
            placeholder="Digite sua nova senha"
            value={password || ""}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        {!loading && <input type="submit" value="Atualizar" />}
        {loading && <input type="submit" value="Aguarde..." disabled />}

        {/* Mensagens de feedback */}
        <div className="messages-container">
          {error && <Message msg={error} type="error" />}
        </div>

        {/* Mensagens de feedback */}
        <div className="message-success">
          {message && <Message msg={message} type="Sucess" />}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
