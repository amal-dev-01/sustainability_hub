import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import contributorAPI from './contributorAPI';



// List
export const fetchContributors = createAsyncThunk(
  'contributors/fetchContributors',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await contributorAPI.list(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get single contributor
export const getContributor = createAsyncThunk(
  'contributors/getContributor',
  async (id, { rejectWithValue }) => {
    try {
      return await contributorAPI.get(id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create new contributor
export const createContributor = createAsyncThunk(
  'contributors/createContributor',
  async (data, { rejectWithValue }) => {
    try {
      return await contributorAPI.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update contributor
export const updateContributor = createAsyncThunk(
  'contributors/updateContributor',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await contributorAPI.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete contributor
export const deleteContributor = createAsyncThunk(
  'contributors/deleteContributor',
  async (id, { rejectWithValue }) => {
    try {
      await contributorAPI.delete(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


  //  SLICE

const contributorSlice = createSlice({
  name: 'contributors',
  initialState: {
    items: [],
    selected: null,
    count: 0,
    next: null,
    previous: null,
    loading: false,
    error: null,
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
      .addCase(fetchContributors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContributors.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results || [];
        state.count = action.payload.count || 0;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchContributors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
        //  GET SINGLE 
      .addCase(getContributor.pending, (state) => {
        state.loading = true;
      })
      .addCase(getContributor.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getContributor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
        //  CREATE 
      .addCase(createContributor.pending, (state) => {
        state.loading = true;
      })
      .addCase(createContributor.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createContributor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
        //  UPDATE 
      .addCase(updateContributor.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateContributor.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) state.items[index] = action.payload;
        if (state.selected?.id === action.payload.id)
          state.selected = action.payload;
      })
      .addCase(updateContributor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

    
        //  DELETE 
      .addCase(deleteContributor.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
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
} = contributorSlice.actions;

export default contributorSlice.reducer;
