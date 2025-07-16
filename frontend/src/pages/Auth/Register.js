import "./Auth.css";

// Components
import { Link } from "react-router-dom";

// Hooks
import { useState, useEffect, use } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { register, reset } from "../../slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // const [error, setError] = useState("");

  const dispatch = useDispatch();
  const { user, error, success, loading, message } = useSelector(
    (state) => state.auth
  );

  const handleSubmit = (e) => {
    e.preventDefault();

    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    const user = {
      name,
      email,
      password,
      confirmPassword,
    };

    console.log(user);

    dispatch(register(user));
  };

   // Clean all auth states
  useEffect(() => {
    dispatch(reset());
    if (user) {
      console.log("Usuário registrado com sucesso:", user);
    } 
    if (error) {
      console.error("Erro ao registrar usuário:", error);
    }
    if (success) {
      console.log("Registro bem-sucedido:", message);
    }
    if (message) {
      console.log("Mensagem:", message);
    }
  }, [dispatch, user, error, success, message]);

  return (
    <div id="register">
      <h2>ReactGram</h2>
      <p>Cadastre-se para ver fotos e vídeos dos seus amigos.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Nome de usuário"
          onChange={(e) => setName(e.target.value)}
          value={name || ""}
        />
        <input
          type="email"
          placeholder="E-mail"
          onChange={(e) => setEmail(e.target.value)}
          value={email || ""}
        />
        <input
          type="password"
          placeholder="Senha"
          onChange={(e) => setPassword(e.target.value)}
          value={password || ""}
        />
        <input
          type="password"
          placeholder="Confirme a senha"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword || ""}
        />
        <button type="submit">Cadastrar</button>
      </form>
      <p>
        Já tem uma conta? <Link to="/login">Clique aqui.</Link>
      </p>
    </div>
  );
};

export default Register;
