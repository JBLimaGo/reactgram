import "./Photo.css";

import { uploads } from "../../utils/config";

// Components
import Message from "../../components/Message";
import { Link } from "react-router-dom";
import { BsHeart, BsHeartFill } from "react-icons/bs";

// Hooks
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// Redux
import { getPhoto, likePhoto, commentPhoto, deleteComment, updateComment, resetMessage } from "../../slices/photoSlice";

const Photo = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { photo, loading, error, message } = useSelector((state) => state.photo);

  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  // Load photo data
  useEffect(() => {
    dispatch(getPhoto(id));
  }, [dispatch, id]);

  // Limpar mensagens ao montar o componente
  useEffect(() => {
    dispatch(resetMessage());
  }, [dispatch]);

  // Like a photo
  const handleLike = () => {
    dispatch(likePhoto(photo._id));
  };

  // Insert a comment
  const handleComment = (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    const commentData = {
      comment: commentText,
      id: photo._id,
    };

    dispatch(commentPhoto(commentData));
    setCommentText("");
  };

  // Delete comment
  const handleDeleteComment = (commentId) => {
    if (window.confirm("Tem certeza que deseja excluir este comentário?")) {
      dispatch(deleteComment({ photoId: photo._id, commentId }));
    }
  };

  // Start editing comment
  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.comment);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  // Submit edit comment
  const handleUpdateComment = (commentId) => {
    if (!editCommentText.trim()) return;

    dispatch(updateComment({
      photoId: photo._id,
      commentId,
      comment: editCommentText,
    }));

    setEditingComment(null);
    setEditCommentText("");
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  return (
    <div id="photo">
      {error && <Message msg={error} type="error" />}
      {message && <Message msg={message} type="success" />}
      {photo && photo.image && (
        <>
          <img src={`${uploads}/photos/${photo.image}`} alt={photo.title} />
          <div className="photo-info">
            <div className="photo-header">
              <Link to={`/users/${photo.userId}`}>
                {photo.userName}
              </Link>
              <h2>{photo.title}</h2>
            </div>

            <div className="photo-actions">
              <button 
                className={`like-btn ${photo.likes && user && photo.likes.includes(user._id) ? 'liked' : ''}`}
                onClick={handleLike}
              >
                {photo.likes && user && photo.likes.includes(user._id) ? (
                  <BsHeartFill />
                ) : (
                  <BsHeart />
                )}
                <span>{photo.likes ? photo.likes.length : 0}</span>
              </button>
            </div>

            <div className="comments-section">
              <h3>Comentários ({photo.comments ? photo.comments.length : 0})</h3>
              
              <form onSubmit={handleComment} className="comment-form">
                <input
                  type="text"
                  placeholder="Adicione um comentário..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <button type="submit" disabled={!commentText.trim()}>
                  Publicar
                </button>
              </form>

              <div className="comments-list">
                {photo.comments && photo.comments.length > 0 ? (
                  photo.comments.map((comment) => (
                    <div className="comment" key={comment._id}>
                      {editingComment === comment._id ? (
                        <div className="edit-comment-container">
                          <input
                            type="text"
                            value={editCommentText}
                            onChange={(e) => setEditCommentText(e.target.value)}
                            className="edit-comment-input"
                            autoFocus
                          />
                          <div className="edit-comment-actions">
                            <button 
                              onClick={() => handleUpdateComment(comment._id)}
                              className="save-btn"
                            >
                              Salvar
                            </button>
                            <button 
                              onClick={handleCancelEdit}
                              className="cancel-btn"
                            >
                              Cancelar
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="comment-content">
                            <div className="comment-header">
                              <Link to={`/users/${comment.userId}`} className="comment-author">
                                {comment.userName}
                              </Link>
                            </div>
                            <p className="comment-text">{comment.comment}</p>
                          </div>
                          {user && comment.userId === user._id && (
                            <div className="comment-actions">
                              <button 
                                onClick={() => handleEditComment(comment)}
                                className="edit-btn"
                                title="Editar comentário"
                              >
                                ✏️
                              </button>
                              <button 
                                onClick={() => handleDeleteComment(comment._id)}
                                className="delete-btn"
                                title="Excluir comentário"
                              >
                                🗑️
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="no-comments">Seja o primeiro a comentar!</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Photo;