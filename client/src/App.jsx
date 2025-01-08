import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthWrapper } from './components/AuthWrapper';
import { ResetPassword } from './components/ResetPassword';
import { Dashboard } from './pages/Dashboard';
import { Navbar } from './components/Navbar';
import { useAuth } from './hooks/useAuth';

function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={<AuthWrapper />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
