import { Navigate } from 'react-router-dom';

export const ResetPassword: React.FC = () => {
  // Simply redirect to main dashboard
  return <Navigate to="/" replace />;
}; 