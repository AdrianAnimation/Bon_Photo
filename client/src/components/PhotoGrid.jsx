import { useOutletContext } from 'react-router-dom';
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import '../styles/PhotoGrid.scss'; // global styles

function PhotoGrid() {
  const { searchResults, isSearchActive, onResetSearch } = useOutletContext();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRandomPhotos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/dashboard/public/photos/random?limit=30");
      if (!response.ok) {
        throw new Error(`Error ${response.status}: Failed to fetch photos`);
      }
      const data = await response.json();
      setPhotos(data);
    } catch (error) {
      console.error('Error fetching photos:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isSearchActive && searchResults) {
      setPhotos(searchResults);
      setLoading(false);
    } else {
      fetchRandomPhotos();
    }
  }, [isSearchActive, searchResults]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing photos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error: {error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  const getImageUrl = (photo) => {
    const baseUrl = photo.thumb_url || photo.photo_url || photo.imageUrl || "/placeholder.jpg";
    if (!baseUrl) return "/placeholder.jpg";
    return baseUrl.startsWith('/uploads') ? baseUrl : `/uploads${baseUrl}`;
  };

  return (
    <div className="photo-grid">
      {photos.length > 0 ? (
        photos.map((photo) => (
          <Link 
            to={`/photo/${photo.id}`} 
            key={photo.id} 
            className="photo-card"
            title={`${photo.title} by ${photo.photographer_name}`}
          >
            <div className="photo-card-image">
              <img 
                src={getImageUrl(photo)}
                alt={photo.alt || photo.title || "Photo"}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "/placeholder.jpg";
                }}
                loading="lazy"
              />
            </div>
            <div className="photo-card-info">
              <h3>{photo.title || "Untitled"}</h3>
              <p className="photographer">by {photo.photographer_name}</p>
              {photo.category_name && (
                <span className="category">{photo.category_name}</span>
              )}
            </div>
          </Link>
        ))
      ) : (
        <div className="empty-state">
          {isSearchActive ? (
            <>
              <p>No results found for your search.</p>
              <button 
                onClick={onResetSearch} 
                className="resetButton"
              >
                View Random Photos
              </button>
            </>
          ) : (
            <p>No photos available at the moment.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PhotoGrid;
