import "./Auth.css";

// Components
import {Link} from 'react-router-dom';

// Hooks
import {useState, useEffect} from 'react';

const Register = () => {

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar os dados do formulário
    console.log("Formulário enviado");
  }


  return (
    <div>
      <h2>ReactGram</h2>
      <p>Cadastre-se para ver fotos e vídeos dos seus amigos.</p>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nome de usuário" />
        <input type="email" placeholder="E-mail" />
        <input type="password" placeholder="Senha" />
        <input type="password" placeholder="Confirme a senha" />
        <button type="submit">Cadastrar</button>
        <p>
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </form>
    </div>
  )
}

export default Register