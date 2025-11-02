
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from '../pages/Auth/LoginPage';
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../components/layout/AdminLayout";
import ProjectListPage from "../pages/Project/ProjectListPage"; 
import ProjectFormPage from "../pages/Project/ProjectFormPage"; 
import ContributorListPage from "../pages/Contributor/ContributorListPage"; 
import ContributorFormPage from "../pages/Contributor/ContributorFormPage"; 
import TaskListPage from "../pages/Task/TaskListPage";
import TaskFormPage from "../pages/Task/TaskFormPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import OverdueTaskListPage from "../pages/Task/OverdueTaskListPage";



const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Layout */}

      <Route path="/" element={ 
        <PrivateRoute>
          <DashboardLayout>
            <DashboardPage /> 
          </DashboardLayout> 
        </PrivateRoute> }/>


      <Route path="/projects" element={  
        <PrivateRoute>    
          <DashboardLayout>       
            <ProjectListPage />     
          </DashboardLayout>   
        </PrivateRoute> }/>

        <Route path="/projects/new" element={
            <PrivateRoute>
              <DashboardLayout>
                <ProjectFormPage />
              </DashboardLayout>
            </PrivateRoute>  }/>

        <Route path="/projects/:id/edit" element={
            <PrivateRoute>
              <DashboardLayout>
                <ProjectFormPage />
              </DashboardLayout>
            </PrivateRoute> }/>


      <Route path="/contributors" element={
          <PrivateRoute>     
            <DashboardLayout>       
              <ContributorListPage />     
            </DashboardLayout>   
          </PrivateRoute> }/>

        <Route path="/contributors/new" element={
            <PrivateRoute>
              <DashboardLayout>
                <ContributorFormPage />
              </DashboardLayout>
            </PrivateRoute>}/>

        <Route
          path="/contributors/:id/edit"
          element={
            <PrivateRoute>
              <DashboardLayout>
                <ContributorFormPage />
              </DashboardLayout>
            </PrivateRoute>
          }
        />


      <Route path="/tasks" element={
        <PrivateRoute>     
          <DashboardLayout>       
            <TaskListPage />     
          </DashboardLayout>   
        </PrivateRoute> }/>

       <Route path="/tasks/new"element={
          <PrivateRoute>
            <DashboardLayout>
              <TaskFormPage />
            </DashboardLayout>
          </PrivateRoute>}/>

        <Route path="/tasks/:id/edit" element={
          <PrivateRoute>
            <DashboardLayout>
              <TaskFormPage />
            </DashboardLayout>
          </PrivateRoute>} />

        <Route path="/tasks/due" element={   
          <PrivateRoute>     
            <DashboardLayout>       
              <OverdueTaskListPage />     
            </DashboardLayout>   
          </PrivateRoute> }/>


        {/* 404 */}
        <Route path="*" element={<div>404 | Not Found</div>} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
