import Photos from "../models/photo.model.js";
import sharp from "sharp";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";
import UserModel from "../models/user.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get photos for the dashboard
const getPhotos = async (req, res) => {
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const photos = await Photos.getPhotosByUserId(userId);
    res.status(200).json(photos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a new photo
const addPhoto = async (req, res) => {
  const userId = req.session.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.file) {
    console.log('No file in request:', req.file);
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    console.log('Processing file:', {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    });

    // Get user's email for folder structure
    const user = await UserModel.findUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create folder structure based on email
    const userFolder = user.email.split('@')[0];
    const baseUploadPath = path.join(__dirname, '..', '..', 'uploads');
    const userBasePath = path.join(baseUploadPath, userFolder);
    const fullPath = path.join(userBasePath, 'full');
    const thumbPath = path.join(userBasePath, 'thumb');

    // Ensure directories exist
    await fs.mkdir(fullPath, { recursive: true });
    await fs.mkdir(thumbPath, { recursive: true });

    // Generate unique filename
    const { title, description, alt, categoryId } = req.body;
    const timestamp = Date.now();
    const safeTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const fileName = `${safeTitle}_${timestamp}.jpg`;

    // Define file paths
    const fullImagePath = path.join(fullPath, fileName);
    const thumbImagePath = path.join(thumbPath, fileName);
    
    // Create relative paths for database
    const relativeFullPath = `/uploads/${userFolder}/full/${fileName}`;
    const relativeThumbPath = `/uploads/${userFolder}/thumb/${fileName}`;

    // Process and save full-size image
    await sharp(req.file.buffer)
      .resize(1920, 1080, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .jpeg({ quality: 80 })
      .toFile(fullImagePath);

    // Generate and save thumbnail
    await sharp(req.file.buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .jpeg({ quality: 70 })
      .toFile(thumbImagePath);

    // Save to database
    const photoId = await Photos.createPhoto({
      title,
      description,
      photo_url: relativeFullPath,
      alt,
      users_id: userId,
      categories_id: categoryId,
      status: 1
    });

    res.status(201).json({
      message: "Photo uploaded successfully",
      photoId,
      photo_url: relativeFullPath,
      thumb_url: relativeThumbPath
    });
  } catch (error) {
    console.error('Detailed error in photo upload:', {
      error: error.message,
      stack: error.stack,
      file: req.file ? {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      } : 'No file'
    });
    res.status(500).json({ error: error.message });
  }
};

// Update an existing photo
const updatePhoto = async (req, res) => {
  const userId = req.session.user?.id;
  const { id } = req.params;
  const { title, description, photoUrl, alt, categoryId } = req.body;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const photo = await Photos.getPhotoById(id);
    if (!photo || photo.users_id !== userId) {
      return res.status(404).json({ message: "Photo not found or unauthorized" });
    }

    const affectedRows = await Photos.updatePhoto(id, {
      title,
      description,
      photoUrl,
      alt,
      categoryId,
    });

    if (affectedRows === 0) {
      return res.status(404).json({ message: "Photo not found" });
    }

    res.status(200).json({ message: "Photo updated" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a photo
const deletePhoto = async (req, res) => {
  console.log('Delete photo request received:', {
    userId: req.session?.user?.id,
    photoId: req.params.id,
    session: req.session
  });

  const userId = req.session.user?.id;
  const { id } = req.params;

  if (!userId) {
    console.log('Unauthorized: No user ID in session');
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    console.log('Fetching photo details for ID:', id);
    const photo = await Photos.getPhotoById(id);
    console.log('Photo details:', photo);

    if (!photo || photo.users_id !== userId) {
      console.log('Photo not found or unauthorized:', {
        photoExists: !!photo,
        photoUserId: photo?.users_id,
        requestUserId: userId
      });
      return res.status(404).json({ message: "Photo not found or unauthorized" });
    }

    console.log('Attempting to delete photo:', id);
    const { affectedRows } = await Photos.deletePhoto(id);
    console.log('Delete result:', { affectedRows });

    if (affectedRows === 0) {
      console.log('No rows affected by delete operation');
      return res.status(404).json({ message: "Photo not found" });
    }

    console.log('Photo deleted successfully');
    res.status(200).json({ message: "Photo and associated files deleted successfully" });
  } catch (error) {
    console.error('Error in deletePhoto controller:', error);
    res.status(500).json({ 
      error: "Failed to delete photo",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined 
    });
  }
};

// Get public photos
const getPublicPhotos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const photos = await Photos.getPublicPhotos(limit);
    
    // Add thumbnail URLs to the response
    const photosWithThumbs = photos.map(photo => ({
      ...photo,
      thumb_url: photo.photo_url.replace('/full/', '/thumb/')
    }));
    
    res.status(200).json(photosWithThumbs);
  } catch (error) {
    console.error('Error fetching public photos:', error);
    res.status(500).json({ error: "Failed to fetch photos" });
  }
};

// Get random public photos
const getRandomPublicPhotos = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 30;
    const photos = await Photos.getRandomPublicPhotos(limit);
    
    // Ensure URLs start with a slash and add thumb_url if not present
    const photosWithUrls = photos.map(photo => ({
      ...photo,
      photo_url: photo.photo_url.startsWith('/') ? photo.photo_url : `/${photo.photo_url}`,
      thumb_url: photo.thumb_url ? 
        (photo.thumb_url.startsWith('/') ? photo.thumb_url : `/${photo.thumb_url}`) :
        photo.photo_url.replace('/full/', '/thumb/')
    }));

    res.json(photosWithUrls);
  } catch (error) {
    console.error('Error fetching random public photos:', error);
    res.status(500).json({ message: 'Error fetching photos' });
  }
};

export { getPhotos, addPhoto, updatePhoto, deletePhoto, getPublicPhotos, getRandomPublicPhotos };
