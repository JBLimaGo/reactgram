import './Profile.css';

import { uploads } from '../../utils/config';

// Components
import Message from '../../components/Message';
import { Link } from 'react-router-dom';
import { BsFillEyeFill, BsPencilFill, BsXLg } from 'react-icons/bs';

// Hooks
import { useState, useEffect, useRef, use } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

// Redux
import { getUserDetails } from '../../slices/userSlice';
import { publishPhoto, resetMessage } from '../../slices/photoSlice';


const Profile = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { user, error, loading, message } = useSelector((state) => state.user);
    const { user: loggedUser } = useSelector((state) => state.auth);
    const { photos, loading: loadingPhoto, error: errorPhoto, message: messagePhoto } = useSelector((state) => state.photo);

    const [title, setTitle] = useState(""); 
    const [image, setImage] = useState("");

    // New photo form
    const newPhotoForm = useRef();
    const editPhotoForm  = useRef();

    // Load user data
    useEffect(() => {
      dispatch(getUserDetails(id));
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
        image
      }

      // build form data
      const formData = new FormData();

      const photoFormData = Object.keys(photoData).forEach((key) => formData.append(key, photoData[key]));

      formData.append("photo", photoFormData);

      dispatch(publishPhoto(formData));

      setTitle("");

      setTimeout(() => {
          dispatch(resetMessage());
      }, 2000);

    };  


    if (loading) {
      return <p>Carregando...</p>;
    }
    

    return (
        <div id="profile">
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
                         <input type="Text" placeholder='Insira um título' onChange={(e) => setTitle(e.target.value)} value={title || ""} />                    
                     </label>
                     <label>
                       <span>Imagem:</span>
                       <input type="file" onChange={handleFile} />   
                     </label>
                     {!loadingPhoto && <input type="submit" value="Postar" />}
                     {loadingPhoto && <input type="submit" value="Aguarde..." disabled />}
                </form>
              </div>
              {errorPhoto && <Message msg={errorPhoto} type="error" />}
              {messagePhoto && <Message msg={messagePhoto} type="success" />}
           </>
          )}
        </div>
    );
}

export default Profile