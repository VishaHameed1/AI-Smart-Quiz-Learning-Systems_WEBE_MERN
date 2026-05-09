 import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import api from '../store/api';

const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);
  
  const handleLogout = async () => {
    await api.post('/auth/logout').catch(() => {});
    dispatch(logout());
  };
  
  return { user, isAuthenticated, loading, logout: handleLogout };
};

export default useAuth;
