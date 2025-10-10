import "./Profile.css";

import { uploads } from "../../utils/config";

// Components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsPencilFill, BsXLg } from "react-icons/bs";

// Hooks
import { useState, useEffect, useRef, use } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Componentes
import ConfirmDialog from "../../components/ConfirmDialog";

// Redux
import { getUserDetails } from "../../slices/userSlice";
import {
  publishPhoto,
  resetMessage,
  getUserPhotos,
  deletePhoto,
  updatePhoto,
} from "../../slices/photoSlice";

const Profile = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { user, error, loading, message } = useSelector((state) => state.user);
  const { user: loggedUser } = useSelector((state) => state.auth);
  const {
    photos,
    loading: loadingPhoto,
    error: errorPhoto,
    message: messagePhoto,
  } = useSelector((state) => state.photo);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");

  // New photo form
  const newPhotoForm = useRef();
  const editPhotoForm = useRef();

  // Adicionar no início do componente junto com os outros states
  const [editId, setEditId] = useState("");
  const [editImage, setEditImage] = useState("");
  const [editTitle, setEditTitle] = useState("");

  // Adicionar estado
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [photoToDelete, setPhotoToDelete] = useState(null);

  const [infoMessage, setInfoMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  // Modificar handleDelete
  const handleDelete = (id) => {
    setPhotoToDelete(id);
    setShowConfirmDialog(true);
  };

  const confirmDelete = async (id) => {
    try {
      const response = await dispatch(deletePhoto(id)).unwrap();
      if (response) {
        // Atualizar fotos após exclusão bem-sucedida
        await dispatch(getUserPhotos(id));

        // Limpar a mensagem após 2 segundos
        setTimeout(() => {
          dispatch(resetMessage());
        }, 2000);
      }
    } catch (error) {
      console.error("Erro ao deletar foto:", error);
    }
  };

  /*
  const confirmDelete = async () => {
    if (photoToDelete) {
      try {
        const response = await dispatch(deletePhoto(photoToDelete)).unwrap();
        if (response) {
          // Atualizar fotos após exclusão bem-sucedida
          await dispatch(getUserPhotos(id));
          setShowConfirmDialog(false);
          setPhotoToDelete(null);
        }
      } catch (error) {
        console.error("Erro ao deletar foto:", error);
      }
    }
  };
*/

  // Show or hide edit form
  const hideOrShowForms = () => {
    newPhotoForm.current.classList.toggle("hide");
    editPhotoForm.current.classList.toggle("hide");
  };

  // update photo
  const handleUpdate = async (e) => {
    e.preventDefault();

    const photoData = {
      id: editId,
      title: editTitle,
    };

    const response = await dispatch(updatePhoto(photoData)).unwrap();

    if (response) {
      // Limpar a mensagem após 2 segundos
      setTimeout(() => {
        dispatch(resetMessage());
      }, 2000);
    }
  };

  // Adicionar as funções de manipulação
  const handleEdit = (photo) => {
    if (editPhotoForm.current.classList.contains("hide")) {
      hideOrShowForms();
    }

    setEditId(photo._id);
    setEditImage(photo.image);
    setEditTitle(photo.title);
  };

  const handleCancelEdit = (e) => {
    hideOrShowForms();
  };

  // Load user data
  useEffect(() => {
    dispatch(getUserDetails(id));
    dispatch(getUserPhotos(id));
  }, [dispatch, id]);

  const handleFile = (e) => {
    // Verifica se há uma imagem selecionada
    const image = e.target.files[0];
    // update profileImage state
    setImage(image);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    //const photoFormData = new FormData(newPhotoForm.current);

    //console.log(...photoFormData);

    const photoData = {
      title,
      image,
    };

    // build form data
    const formData = new FormData();

    const photoFormData = Object.keys(photoData).forEach((key) =>
      formData.append(key, photoData[key])
    );

    formData.append("photo", photoFormData);

    dispatch(publishPhoto(formData));

    setTitle("");

    setTimeout(() => {
      dispatch(resetMessage());
      setInfoMessage("");
      setWarningMessage("");
    }, 3000);
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="profile">
      <ConfirmDialog
        isOpen={showConfirmDialog}
        onConfirm={confirmDelete}
        onCancel={() => setShowConfirmDialog(false)}
        message="Tem certeza que deseja excluir esta foto?"
      />
      <div className="profile-header">
        {user && user.profileImage && (
          <img src={`${uploads}/users/${user.profileImage}`} alt={user.name} />
        )}
        {user && (
          <div className="profile-description">
            <h2>{user.name}</h2>
            <p>{user.bio}</p>
          </div>
        )}
      </div>
      {id === loggedUser._id && (
        <>
          <div className="new-photo" ref={newPhotoForm}>
            <h3>Compartilhe algum momento seu:</h3>
            <form onSubmit={submitHandler}>
              <label>
                <span>Título para a foto:</span>
                <input
                  type="Text"
                  placeholder="Insira um título"
                  onChange={(e) => setTitle(e.target.value)}
                  value={title || ""}
                />
              </label>
              <label>
                <span>Imagem:</span>
                <input type="file" onChange={handleFile} />
              </label>
              {!loadingPhoto && <input type="submit" value="Postar" />}
              {loadingPhoto && (
                <input type="submit" value="Aguarde..." disabled />
              )}
            </form>
          </div>
          <div className="edit-photo hide" ref={editPhotoForm}>
            <p>Editando:</p>
            {editImage && (
              <img
                src={`${uploads}/photos/${editImage}`}
                alt={editTitle}
                style={{ width: "100%", marginBottom: "1em" }}
              />
            )}
            <form onSubmit={handleUpdate}>
              <input
                type="Text"
                placeholder="Insira um novo título"
                onChange={(e) => setEditTitle(e.target.value)}
                value={editTitle || ""}
              />

              <input type="submit" value="Atualizar" />
              <button className="cancel-btn" onClick={handleCancelEdit}>
                {" "}
                Cancelar Edição{" "}
              </button>
            </form>
          </div>

          {/* Mensagens de feedback */}
          <div className="messages-container">
            {errorPhoto && <Message msg={errorPhoto} type="error" />}
          </div>
          {/* Mensagens de feedback */}
          <div className="message-success">
            {messagePhoto && <Message msg={messagePhoto} type="success" />}
          </div>
        </>
      )}
      <div className="user-photos">
        <h2>Fotos publicadas</h2>
        <div className="photos-container">
          {photos &&
            photos.map((photo) => (
              <div className="photo" key={photo._id}>
                {photo.image && (
                  <img
                    src={`${uploads}/photos/${photo.image}`}
                    alt={photo.title}
                  />
                )}
                {id === loggedUser._id ? (
                  <div className="actions">
                    <Link to={`/photos/${photo._id}`}>
                      <BsFillEyeFill />
                    </Link>
                    <BsPencilFill onClick={() => handleEdit(photo)} />
                    <BsXLg onClick={() => confirmDelete(photo._id)} />
                  </div>
                ) : (
                  <Link className="btn" to={`/photos/${photo._id}`}>
                    Ver
                  </Link>
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
