/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { uploadPhoto } from '../store/slices/photosSlice';
import '../styles/UploadForm.scss';

// Categories from the database
const categories = [
  { id: 66, name: '3D Renders' },
  { id: 67, name: 'Animals' },
  { id: 68, name: 'Architecture & Interiors' },
  { id: 69, name: 'Archival' },
  { id: 70, name: 'Business & Work' },
  { id: 71, name: 'Current Events' },
  { id: 72, name: 'Deck the Halls' },
  { id: 73, name: 'Experimental' },
  { id: 74, name: 'Fashion & Beauty' },
  { id: 75, name: 'Festive Food & Drink' },
  { id: 76, name: 'Film' },
  { id: 77, name: 'Food & Drink' },
  { id: 78, name: 'Health & Wellness' },
  { id: 79, name: 'Holiday Cheers' },
  { id: 80, name: 'Holiday Patterns' },
  { id: 81, name: 'Merry & Bright' },
  { id: 82, name: 'Nature' },
  { id: 83, name: 'People' },
  { id: 84, name: 'Spirituality' },
  { id: 85, name: 'Sports' },
  { id: 86, name: 'Street Photography' },
  { id: 87, name: 'Table Spreads' },
  { id: 88, name: 'Textures & Patterns' },
  { id: 89, name: 'Through the Window' },
  { id: 90, name: 'Timeless Tradition' },
  { id: 91, name: 'Travel' },
  { id: 92, name: 'Wallpapers' },
  { id: 93, name: 'Winter Blues' },
  { id: 94, name: 'Winter Whiteout' },
  { id: 95, name: 'Winter Wonderland' }
];

const UploadForm = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    file: null,
    title: '',
    description: '',
    altText: '',
    categoryId: '',
    status: 1
  });
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.file) {
      return;
    }

    const data = new FormData();
    data.append('photo', formData.file);
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('alt', formData.altText);
    data.append('categoryId', formData.categoryId);
    data.append('status', formData.status);
    
    try {
      const result = await dispatch(uploadPhoto(data)).unwrap();
      
      // Reset form
      setFormData({ 
        file: null, 
        title: '', 
        description: '', 
        altText: '',
        categoryId: '',
        status: 1 
      });
      setPreview(null);
    } catch (error) {
      console.error('Upload failed:', {
        error,
        message: error.message,
        status: error.response?.status,
        responseData: error.response?.data
      });
    }
  };

  return (
    <form className="upload-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="photo">Photo</label>
        <input
          type="file"
          id="photo"
          accept="image/*"
          onChange={handleFileChange}
          required
        />
        {preview && (
          <div className="preview">
            <img src={preview} alt="Preview" />
          </div>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="altText">Alt Text</label>
        <input
          type="text"
          id="altText"
          name="altText"
          value={formData.altText}
          onChange={handleInputChange}
          placeholder="Describe the image for accessibility"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="categoryId">Category</label>
        <select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleInputChange}
          required
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="status">Status</label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
        >
          <option value={1}>Public</option>
          <option value={0}>Private</option>
        </select>
      </div>

      <button type="submit" className="submit-button">Upload Photo</button>
    </form>
  );
};

export default UploadForm;
