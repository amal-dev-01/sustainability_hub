import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import taskAPI from './taskAPI';

// List 
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await taskAPI.list(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Get single task (detail view)
export const getTask = createAsyncThunk(
  'tasks/getTask',
  async (id, { rejectWithValue }) => {
    try {
      return await taskAPI.get(id);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create new task
export const createTask = createAsyncThunk(
  'tasks/createTask',
  async (data, { rejectWithValue }) => {
    try {
      return await taskAPI.create(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Update task
export const updateTask = createAsyncThunk(
  'tasks/updateTask',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await taskAPI.update(id, data);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Delete task
export const deleteTask = createAsyncThunk(
  'tasks/deleteTask',
  async (id, { rejectWithValue }) => {
    try {
      await taskAPI.delete(id);
      return id; 
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
  
);
export const fetchOverdueTasks = createAsyncThunk(
  'tasks/fetchOverdueTasks',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await taskAPI.overdue(params);
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// SLICE
const taskSlice = createSlice({
  name: 'tasks',
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

    overdueTasks: [],
    overdueCount: 0,
    loadingOverdue: false,
    errorOverdue: null,

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
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.results || [];
        state.count = action.payload.count || 0;
        state.next = action.payload.next;
        state.previous = action.payload.previous;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })



      .addCase(getTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.loading = false;
        state.selected = action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload); 
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })


      .addCase(updateTask.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })



      .addCase(deleteTask.fulfilled, (state, action) => {
        state.items = state.items.filter((t) => t.id !== action.payload);
      })

      .addCase(fetchOverdueTasks.pending, (state) => {
        state.loadingOverdue = true;
        state.errorOverdue = null;
      })
      .addCase(fetchOverdueTasks.fulfilled, (state, action) => {
        state.loadingOverdue = false;
        if (Array.isArray(action.payload)) {
          state.overdueTasks = action.payload;
          state.overdueCount = action.payload.length;
        } else {
          state.overdueTasks = action.payload.results || [];
          state.overdueCount = action.payload.count || 0;
        }
      })
      .addCase(fetchOverdueTasks.rejected, (state, action) => {
        state.loadingOverdue = false;
        state.errorOverdue = action.payload;
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
} = taskSlice.actions;

export default taskSlice.reducer;
