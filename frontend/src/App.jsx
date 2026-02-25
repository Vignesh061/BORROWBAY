import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import BrowsePage from './pages/BrowsePage';
import DashboardPage from './pages/DashboardPage';
import AdminPage from './pages/AdminPage';
import { getMe } from './services/api';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe()
        .then((res) => setUser(res.data.user))
        .catch(() => { localStorage.removeItem('token'); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogin = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-surface)]">
        <div className="text-xl text-[var(--color-primary)] animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/browse" /> : <LoginPage onLogin={handleLogin} />} />
        <Route path="/browse" element={<BrowsePage user={user} />} />
        <Route path="/dashboard" element={user ? <DashboardPage user={user} /> : <Navigate to="/login" />} />
        <Route path="/admin" element={user && (user.role === 'admin' || user.role === 'department') ? <AdminPage user={user} /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
