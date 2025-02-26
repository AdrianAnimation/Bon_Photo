import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Cache the session check to avoid multiple requests
let sessionCheckPromise = null;

export const checkSession = createAsyncThunk(
  'auth/checkSession',
  async () => {
    // Return existing promise if we're already checking
    if (sessionCheckPromise) {
      return sessionCheckPromise;
    }

    sessionCheckPromise = fetch('/api/users/authenticated', {
      credentials: 'include',
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Session expired');
      }
      return response.json();
    })
    .finally(() => {
      // Clear the promise cache after completion
      sessionCheckPromise = null;
    });

    return sessionCheckPromise;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Logout failed');
      }

      // Force clear auth state
      dispatch(clearAuth());
      
      // Clear any cached data
      dispatch({ type: 'RESET_STATE' });
      
      return await response.json();
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: false,
    user: null,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null
  },
  reducers: {
    setAuth: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload;
      state.error = null;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
      state.status = 'idle';
    },
    resetState: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.status = 'idle';
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Session
      .addCase(checkSession.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(checkSession.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.status = 'succeeded';
        state.error = null;
      })
      .addCase(checkSession.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'failed';
        state.error = action.error.message;
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.status = 'idle';
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { setAuth, clearAuth, resetState } = authSlice.actions;
export default authSlice.reducer;
