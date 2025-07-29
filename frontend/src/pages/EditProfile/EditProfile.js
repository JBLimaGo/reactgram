import "./EditProfile.css";

const EditProfile = () => {

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aqui você pode adicionar a lógica para enviar os dados do formulário
        console.log("Formulário enviado");
    }

  return (
    <div id="edit-profile">
      <h2>Editar Perfil</h2>
        <p className="subtitle">Adicione uma imagem de perfil e conte mais sobre você...</p>
        {/* Formulário de edição de perfil */}   
        <form onSubmit={handleSubmit}> 
          <input type="text" placeholder="Nome" />
          <input type="email" placeholder="Email" />
          <label>
            <span>Imagem de perfil:</span>
            <input type="file" />
          </label>
          <label>
            <span>Sobre você:</span>
            <input type="text" placeholder="Descrição do perfil" />
          </label>
          <label>
            <span>Senha para alterar:</span>
            <input type="password" placeholder="Digite sua nova senha" />    
          </label>
          <input type="submit" value="Atualizar" />
        </form>
    </div>
  )
}

export default EditProfile