import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import photoService from "../services/photoService";

const initialState = {
  photos: [],
  photo: {},
  error: false,
  success: false,
  loading: false,
  message: null,

  totalPhotos: 0,
  photosUser: [],
  userPhotos: [],
  photoLikes: [],
  searchPhotos: [],
};

// Publish user photo
export const publishPhoto = createAsyncThunk(
  "photo/publish",
  async (photo, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.publishPhoto(photo, token);

    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }

    return data;
  }
);

// Get user photos
export const getUserPhotos = createAsyncThunk(
  "photo/getUserPhotos",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getUserPhotos(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Get photo by id
export const getPhoto = createAsyncThunk(
  "photo/getPhoto",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getPhoto(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Criar action deletePhoto
export const deletePhoto = createAsyncThunk(
  "photo/delete",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;

    try {
      const data = await photoService.deletePhoto(id, token);

      // Checar se há erro
      if (data.errors) {
        return thunkAPI.rejectWithValue(data.errors[0]);
      }

      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

// Update a photo
export const updatePhoto = createAsyncThunk(
  "photo/update",
  async (photoData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.updatePhoto(
      { title: photoData.title },
      photoData.id,
      token
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Get all photos
export const getPhotos = createAsyncThunk(
  "photo/getAll",
  async (_, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.getPhotos(token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Like a photo
export const likePhoto = createAsyncThunk(
  "photo/like",
  async (id, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.likePhoto(id, token);
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Add comment to a photo
export const commentPhoto = createAsyncThunk(
  "photo/comment",
  async (commentData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.commentPhoto(
      { comment: commentData.comment },
      commentData.id,
      token
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Delete a comment
export const deleteComment = createAsyncThunk(
  "photo/deleteComment",
  async (commentData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.deleteComment(
      commentData.photoId,
      commentData.commentId,
      token
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

// Update a comment
export const updateComment = createAsyncThunk(
  "photo/updateComment",
  async (commentData, thunkAPI) => {
    const token = thunkAPI.getState().auth.user.token;
    const data = await photoService.updateComment(
      { comment: commentData.comment },
      commentData.photoId,
      commentData.commentId,
      token
    );
    if (data.errors) {
      return thunkAPI.rejectWithValue(data.errors[0]);
    }
    return data;
  }
);

export const photoSlice = createSlice({
  name: "photo",
  initialState,
  reducers: {
    resetMessage: (state) => {
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(publishPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(publishPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
        // Só adiciona a foto ao array se não existir (evita duplicação)
        const photoExists = state.photos.some(p => String(p._id) === String(action.payload._id));
        if (!photoExists) {
          state.photos.unshift(action.payload);
        }
        state.message = "Foto publicada com sucesso!";
      })
      .addCase(publishPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(getUserPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getUserPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(getPhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photo = action.payload;
      })
      .addCase(getPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photo = {};
      })
      .addCase(deletePhoto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = state.photos.filter(
          (photo) => photo._id !== action.payload.id
        );
        state.message = "Foto excluída com sucesso!";
      })
      .addCase(deletePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photos = [];
      })
      .addCase(updatePhoto.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(updatePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;

        state.photos.map((photo) =>
        {
          if (photo._id === action.payload.photo._id) {
            return photo.title = action.payload.photo.title;
          }
          return photo;
        });

        state.message = "Foto Editada com sucesso!";
      })
      .addCase(updatePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photos = [];
      })
      .addCase(getPhotos.pending, (state) => {
        state.loading = true;
        state.error = false;
      })
      .addCase(getPhotos.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        state.photos = action.payload;
      })
      .addCase(getPhotos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.photos = [];
      })
      .addCase(likePhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        
        if (action.payload && action.payload.photoId && action.payload.likes) {
          const photoId = String(action.payload.photoId);
          
          // Atualizar state.photo se for a foto atual
          if (state.photo && String(state.photo._id) === photoId) {
            state.photo = { ...state.photo, likes: action.payload.likes };
          }
          
          // Atualizar state.photos - criar novo array com imutabilidade
          state.photos = state.photos.map((photo) => {
            if (String(photo._id) === photoId) {
              return { ...photo, likes: action.payload.likes };
            }
            return photo;
          });
        }
        
        state.message = "Foto curtida!";
      })
      .addCase(likePhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(commentPhoto.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        
        if (action.payload && action.payload.photo) {
          const photoId = String(action.payload.photo._id);
          
          // Atualizar state.photo se for a foto atual
          if (state.photo && String(state.photo._id) === photoId) {
            state.photo = { ...state.photo, comments: action.payload.photo.comments };
          }
          
          // Atualizar state.photos - criar novo array com imutabilidade
          state.photos = state.photos.map((photo) => {
            if (String(photo._id) === photoId) {
              return { ...photo, comments: action.payload.photo.comments };
            }
            return photo;
          });
        }
        
        state.message = "Comentário adicionado!";
      })
      .addCase(commentPhoto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        
        if (action.payload && action.payload.photo) {
          if (state.photo && state.photo._id === action.payload.photo._id) {
            state.photo.comments = action.payload.photo.comments;
          }
          
          state.photos = state.photos.map((photo) => {
            if (String(photo._id) === String(action.payload.photo._id)) {
              return { ...photo, comments: action.payload.photo.comments };
            }
            return photo;
          });
        }
        
        state.message = "Comentário removido!";
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        
        if (action.payload && action.payload.photo) {
          if (state.photo && state.photo._id === action.payload.photo._id) {
            state.photo.comments = action.payload.photo.comments;
          }
          
          state.photos = state.photos.map((photo) => {
            if (String(photo._id) === String(action.payload.photo._id)) {
              return { ...photo, comments: action.payload.photo.comments };
            }
            return photo;
          });
        }
        
        state.message = "Comentário atualizado!";
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMessage, resetState } = photoSlice.actions;
export default photoSlice.reducer;
