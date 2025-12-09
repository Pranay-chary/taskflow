import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import PMDashboard from './pages/PMDashboard';
import UserDashboard from './pages/UserDashboard';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

const DashboardRoute = () => {
  const { user } = useAuth();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return user.role === 'PM' ? <PMDashboard /> : <UserDashboard />;
};

const AppContent = () => {
  const { user, initializeAuth } = useAuth();

  useEffect(() => {
    initializeAuth();
  }, []);

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={!user ? <LoginPage /> : <Navigate to="/dashboard" />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardRoute />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
