import React from 'react';
import { Route, Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component, isAuthenticated, ...rest }) => (
  <Route
    {...rest}
    element={isAuthenticated ? <Component /> : <Navigate to="/login" />}
  />
);

export default ProtectedRoute;
