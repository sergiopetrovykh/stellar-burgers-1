import React, { FC, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
// import { checkAuthStatus } from '../../services/slices/user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  onlyUnAuth?: boolean;
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  onlyUnAuth
}) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(
    (state: any) => state.auth.isAuthenticated
  );
  const location = useLocation();

  useEffect(() => {
    //dispatch(checkAuthStatus());
  }, [dispatch]);

  if (onlyUnAuth && isAuthenticated) {
    return <Navigate to={location.state?.from?.pathname || '/'} />;
  }

  if (!isAuthenticated && !onlyUnAuth) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return <>{children}</>;
};
