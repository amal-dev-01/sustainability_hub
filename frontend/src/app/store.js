import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import projectReducer from '../features/projects/projectSlice'
import contributorReducer from '../features/contributors/contributorSlice'
import taskReducer from '../features/tasks/taskSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice';


export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects : projectReducer,
    contributors : contributorReducer,
    tasks : taskReducer,
    dashboard: dashboardReducer,


  },
  devTools: import.meta.env.MODE !== 'production',
});

export default store;
