import "./Auth.css";

// Components
import { Link } from "react-router-dom";
import Message from "../../components/Message";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState(""); 

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
  };


  return (
    <div id="login">
      <h2>ReactGram</h2>
      <p className="subtitle"></p>
      <p> Faça o login para ver o que há de novo. </p>
      <form onSubmit={ handleSubmit }>
        <input type="email" placeholder="E-mail" onchange={(e) => setEmail(e.target.value)} value={email || ""}/>
        <input type="password" placeholder="Senha" onchange={(e) => setPassword(e.target.value)} value={password || ""} />
        <button type="submit">Entrar</button>
       
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Clique aqui.</Link>  
      </p>
      
    </div>
  )
}

export default Login