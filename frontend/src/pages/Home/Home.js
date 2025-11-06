import "./Home.css";

import { uploads } from "../../utils/config";

// Components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsFillEyeFill, BsHeart, BsHeartFill, BsChatDots } from "react-icons/bs";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";

// Redux
import { getPhotos, likePhoto, commentPhoto } from "../../slices/photoSlice";

const Home = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { photos, loading } = useSelector((state) => state.photo);

  // Estado para controlar os comentários de cada foto
  const [commentTexts, setCommentTexts] = useState({});
  const [displayedPhotos, setDisplayedPhotos] = useState([]);

  // Load all photos
  useEffect(() => {
    dispatch(getPhotos());
  }, [dispatch]);

  // Atualizar fotos exibidas quando photos mudar
  useEffect(() => {
    if (photos && photos.length > 0) {
      // Criar Map para garantir unicidade por _id
      const uniqueMap = new Map();
      photos.forEach(photo => {
        if (photo && photo._id) {
          uniqueMap.set(String(photo._id), photo);
        }
      });
      // Converter Map de volta para array
      setDisplayedPhotos(Array.from(uniqueMap.values()));
    } else {
      setDisplayedPhotos([]);
    }
  }, [photos]);

  // Like a photo
  const handleLike = (photo) => {
    dispatch(likePhoto(photo._id));
  };

  // Handle comment input change
  const handleCommentChange = (photoId, value) => {
    setCommentTexts(prev => ({
      ...prev,
      [photoId]: value
    }));
  };

  // Submit comment
  const handleCommentSubmit = (e, photoId) => {
    e.preventDefault();
    
    const commentText = commentTexts[photoId];
    
    if (!commentText || !commentText.trim()) return;

    const commentData = {
      comment: commentText,
      id: photoId,
    };

    dispatch(commentPhoto(commentData));
    
    // Limpar o campo após enviar
    setCommentTexts(prev => ({
      ...prev,
      [photoId]: ""
    }));
  };

  if (loading) {
    return <div className="loading"><p>Carregando feed...</p></div>;
  }

  return (
    <div id="home">
      <div className="home-header">
        <h1>Feed de Fotos</h1>
        <p>Veja as últimas fotos compartilhadas pela comunidade</p>
      </div>
      
      {displayedPhotos.length === 0 && (
        <div className="no-photos">
          <p>Ainda não há fotos compartilhadas.</p>
          <Link to={user ? `/users/${user._id}` : "/profile"} className="btn">
            Compartilhe a primeira foto!
          </Link>
        </div>
      )}
      
      <div className="photos-container">
        {displayedPhotos.length > 0 && displayedPhotos.map((photo) => (
            <div className="photo-card" key={photo._id}>
              <div className="photo-card-header">
                <Link to={`/users/${photo.userId}`} className="user-info">
                  <div className="user-avatar">
                    {photo.userName && photo.userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name">{photo.userName}</span>
                </Link>
              </div>

              <Link to={`/photos/${photo._id}`} className="photo-image-link">
                <img 
                  src={`${uploads}/photos/${photo.image}`} 
                  alt={photo.title}
                  loading="lazy"
                />
              </Link>

              <div className="photo-card-body">
                <div className="photo-actions">
                  <button 
                    className={`like-btn ${photo.likes && user && photo.likes.includes(user._id) ? 'liked' : ''}`}
                    onClick={() => handleLike(photo)}
                  >
                    {photo.likes && user && photo.likes.includes(user._id) ? (
                      <BsHeartFill />
                    ) : (
                      <BsHeart />
                    )}
                  </button>
                  
                  <Link to={`/photos/${photo._id}`} className="comment-btn">
                    <BsChatDots />
                  </Link>
                </div>

                <div className="photo-stats">
                  {photo.likes && photo.likes.length > 0 && (
                    <p className="likes-count">
                      <strong>{photo.likes.length}</strong> {photo.likes.length === 1 ? 'curtida' : 'curtidas'}
                    </p>
                  )}
                </div>

                <div className="photo-caption">
                  <Link to={`/users/${photo.userId}`} className="caption-user">
                    {photo.userName}
                  </Link>
                  <span className="caption-text">{photo.title}</span>
                </div>

                {photo.comments && photo.comments.length > 0 && (
                  <Link to={`/photos/${photo._id}`} className="view-comments">
                    Ver {photo.comments.length === 1 ? '1 comentário' : `todos os ${photo.comments.length} comentários`}
                  </Link>
                )}

                <form 
                  className="comment-form-home" 
                  onSubmit={(e) => handleCommentSubmit(e, photo._id)}
                >
                  <input
                    type="text"
                    placeholder="Adicione um comentário..."
                    value={commentTexts[photo._id] || ""}
                    onChange={(e) => handleCommentChange(photo._id, e.target.value)}
                  />
                  <button 
                    type="submit" 
                    disabled={!commentTexts[photo._id] || !commentTexts[photo._id].trim()}
                  >
                    Publicar
                  </button>
                </form>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Home;