import { Navigate } from 'react-router-dom';
import storageService from '../services/storageService';

const PrivateRoute = ({ children }) => {
  const token = storageService.getToken();
  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
