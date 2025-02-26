/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Pencil, Trash2 } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import Modal from './Modal';
import UploadForm from './UploadForm';
import { fetchPhotos, updatePhoto, deletePhoto } from '../store/slices/photosSlice';
import { withAuth } from '../hoc/withAuth';
import '../styles/Dashboard.scss';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { items: photos, status, error } = useSelector((state) => state.photos);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPhotos());
    }
  }, [status, dispatch]);

  const handleEdit = (photo) => {
    setSelectedPhoto(photo);
    setEditTitle(photo.title);
    setEditDescription(photo.description || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (photoId) => {
    if (window.confirm('Are you sure you want to delete this photo?')) {
      try {
        await dispatch(deletePhoto(photoId)).unwrap();
      } catch (err) {
        console.error('Failed to delete photo:', err);
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedPhoto) return;

    try {
      await dispatch(updatePhoto({
        id: selectedPhoto.id,
        title: editTitle,
        description: editDescription
      })).unwrap();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to update photo:', err);
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'failed') {
    return <div>Error: {error}</div>;
  }

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-content">
          <div className="photos-section">
            <div className="photo-list">
              {photos.map((photo) => (
                <div key={photo.id} className="photo-list-item">
                  <img 
                    src={photo.photo_url} 
                    alt={photo.title} 
                    className="photo-thumbnail"
                  />
                  <div className="photo-info">
                    <h3>{photo.title}</h3>
                    <p>{photo.description}</p>
                    <div className="photo-actions">
                      <button
                        onClick={() => handleEdit(photo)}
                        className="edit-button"
                      >
                        <Pencil className="icon" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(photo.id)}
                        className="delete-button"
                      >
                        <Trash2 className="icon" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="upload-section">
            <UploadForm />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Photo"
      >
        <form onSubmit={handleUpdate} className="edit-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />
          </div>
          <div className="form-actions">
            <button type="button" onClick={() => setIsModalOpen(false)} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="save-button">
              Save Changes
            </button>
          </div>
        </form>
      </Modal>
    </DashboardLayout>
  );
};

export default withAuth(Dashboard);
