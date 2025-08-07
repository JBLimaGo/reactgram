import "./EditProfile.css";

import { uploads } from "../../utils/config";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { profile, resetMessage } from "../../slices/userSlice";

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
  const [profileImage, setProfileImage] = useState("");
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

  const handleSubmit = (event) => {
    event.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    console.log("Formulário enviado");
  };

  return (
    <div id="edit-profile">
      <h2>Editar Perfil</h2>
      <p className="subtitle">
        Adicione uma imagem de perfil e conte mais sobre você...
      </p>
      {/* Formulário de edição de perfil */}
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
          <input
            type="file"
            onChange={(e) => setProfileImage(e.target.files[0])}
          />
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
        {error && <Message msg={error} type="error" />}
      </form>
    </div>
  );
};

export default EditProfile;
