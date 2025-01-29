import { Navigate } from 'react-router-dom';

export const AuthWrapper: React.FC = () => {
  // Simply redirect to main dashboard
  return <Navigate to="/" replace />;
}; 