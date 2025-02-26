/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { checkSession, clearAuth } from '../store/slices/authSlice';

export const withAuth = (WrappedComponent) => {
  return function WithAuthComponent(props) {
    const dispatch = useDispatch();
    const location = useLocation();
    const { isAuthenticated, status, error } = useSelector((state) => state.auth);

    useEffect(() => {
      let mounted = true;

      const verifySession = async () => {
        if (status === 'idle') {
          try {
            await dispatch(checkSession()).unwrap();
          } catch (error) {
            console.error('Auth check failed:', error);
            if (mounted) {
              dispatch(clearAuth());
            }
          }
        }
      };

      verifySession();

      return () => {
        mounted = false;
      };
    }, [dispatch, status]);

    // If not authenticated, redirect to login
    if (!isAuthenticated && status !== 'loading') {
      return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    }

    // Render the protected component while checking or if authenticated
    return <WrappedComponent {...props} />;
  };
};

export default withAuth;
