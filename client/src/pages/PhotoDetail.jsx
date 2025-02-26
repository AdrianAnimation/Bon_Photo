
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartSolid, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import '../styles/PhotoDetail.scss'; // Estilos globales
import { useSelector } from 'react-redux';

function PhotoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);

  const [photo, setPhoto] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const response = await fetch(`/api/interactions/photos/${id}`);
        if (!response.ok) throw new Error('Failed to load photo details');
        const data = await response.json();
        const { photo: photoData } = data;
        setPhoto(photoData);
        setComments(photoData.comments);
        setIsLiked(photoData.hasLiked);
        setLikeCount(photoData.likes_count);
        setLoading(false);
      } catch (err) {
        setError('Failed to load photo details');
        setLoading(false);
      }
    };

    fetchPhotoDetails();
  }, [id]);

  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch(`/api/interactions/photos/${id}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      const data = await response.json();
      setIsLiked(data.liked);
      setLikeCount(data.likeCount);
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate('/login');
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/interactions/photos/${id}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newComment })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const data = await response.json();
      setComments(data.comments);
      setNewComment('');
    } catch (err) {
      console.error('Error adding comment:', err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      const response = await fetch(`/api/interactions/comments/${commentId}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete comment');
      setComments(comments.filter(comment => comment.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!photo) return <div className="error">Photo not found</div>;

  return (
    <div className="container">
      <button 
        className="backButton"
        onClick={() => navigate(-1)}
      >
        <FontAwesomeIcon icon={faArrowLeft} /> Back
      </button>

      <div className="photoDetailLayout">
        <div className="photoSection">
          <img 
            src={photo.photo_url} 
            alt={photo.alt} 
            className="mainPhoto"
          />
          
          <div className="interactions">
            <button 
              className={`likeButton ${isLiked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <FontAwesomeIcon icon={isLiked ? faHeartSolid : faHeartRegular} />
              {likeCount} {likeCount === 1 ? 'Like' : 'Likes'}
            </button>
          </div>
        </div>

        <div className="infoSection">
          <div className="photographerInfo">
            <h2>{photo.photographer_name}</h2>
            {photo.photographer_location && (
              <p className="location">{photo.photographer_location}</p>
            )}
          </div>

          <div className="photoInfo">
            <h3>{photo.title}</h3>
            <p>{photo.description}</p>
          </div>

          <div className="likesSection">
            <h3>Likes ({likeCount})</h3>
          </div>

          <div className="commentsSection">
            <h3>Comments ({comments.length})</h3>
            
            <form onSubmit={handleComment} className="commentForm">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="commentInput"
              />
              <button type="submit" className="submitButton">
                Post
              </button>
            </form>

            <div className="commentsList">
              {comments.map((comment) => (
                <div key={comment.id} className="comment">
                  <div className="commentHeader">
                    <strong>{comment.username}</strong>
                    <span className="commentDate">
                      {new Date(comment.date).toLocaleDateString()}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                  {user && (user.id === comment.user_id || user.role === 'admin') && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="deleteButton"
                    >
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoDetail;
