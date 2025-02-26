import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchPhotos = createAsyncThunk(
  'dashboardPhotos/fetchPhotos',
  async () => {
    // Try up to 2 times with a 500ms delay
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await fetch('/api/dashboard/photos', {
          credentials: 'include',
          headers: {
            'Accept': 'application/json'
          }
        });
        
        if (response.ok) {
          return response.json();
        }
        
        // If it's not the last attempt, wait 500ms before retry
        if (attempt < 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      } catch (error) {
        // Only throw on last attempt
        if (attempt === 1) throw error;
      }
    }
    throw new Error('Failed to fetch photos');
  }
);

export const uploadPhoto = createAsyncThunk(
  'dashboardPhotos/uploadPhoto',
  async (formData) => {
    const response = await fetch('/api/dashboard/photos', {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload photo');
    return response.json();
  }
);

export const deletePhoto = createAsyncThunk(
  'dashboardPhotos/deletePhoto',
  async (photoId) => {
    const response = await fetch(`/api/dashboard/photos/${photoId}`, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete photo');
    }
    return photoId;
  }
);

const photosSlice = createSlice({
  name: 'dashboardPhotos',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
    selectedPhoto: null
  },
  reducers: {
    setSelectedPhoto: (state, action) => {
      state.selectedPhoto = action.payload;
    },
    updatePhoto: (state, action) => {
      const index = state.items.findIndex(photo => photo.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPhotos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPhotos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPhotos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(uploadPhoto.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(deletePhoto.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = state.items.filter(photo => photo.id !== action.payload);
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { setSelectedPhoto, updatePhoto } = photosSlice.actions;
export default photosSlice.reducer;
