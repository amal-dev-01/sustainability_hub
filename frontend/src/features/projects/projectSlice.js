

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import projectAPI from './projectAPI';


// List
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await projectAPI.list(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get single project (detail view)
export const getProject = createAsyncThunk(
  'projects/getProject',
  async (id, { rejectWithValue }) => {
    try {
      return await projectAPI.get(id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create new project
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (data, { rejectWithValue }) => {
    try {
      return await projectAPI.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await projectAPI.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await projectAPI.delete(id);
      return id; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);




  //  SLICE

const projectSlice = createSlice({
  name: 'projects',
  initialState: {
    items: [],
    selected: null, 
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,

    // Query params for list view
    params: {
      search: '',
      page: 1,
      page_size: 10,
      ordering: '',
      filters: {},
    },
  },

  reducers: {
    setSearch: (state, action) => {
      state.params.search = action.payload;
    },
    setPage: (state, action) => {
      state.params.page = action.payload;
    },
    setOrdering: (state, action) => {
      state.params.ordering = action.payload;
    },
    setFilter: (state, action) => {
      state.params.filters = { ...state.params.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.params.filters = {};
    },
    clearSelected: (state) => {
      state.selected = null;
    },
  },

  extraReducers: (builder) => {
    builder
        //  LIST
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results || [];
        state.count = action.payload.count || 0;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
        //  GET SINGLE
      .addCase(getProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProject.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
        //  CREATE
      .addCase(createProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
        //  UPDATE
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (proj) => proj.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      
        //  DELETE
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      });
  },
});

export const {
  setSearch,
  setPage,
  setOrdering,
  setFilter,
  resetFilters,
  clearSelected,
} = projectSlice.actions;

export default projectSlice.reducer;
