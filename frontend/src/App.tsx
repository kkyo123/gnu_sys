import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';

// Route targets from pages directory
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Search from './pages/Search/Search';
import Recommend from './pages/Search/Recommend';
import Graduation from './pages/Search/Graduation';
import Mypage from './pages/Mypage';

type User = any;

function AppInner({
  user,
  isLoggedIn,
  onLogin,
  onLogout,
}: {
  user: User | null;
  isLoggedIn: boolean;
  onLogin: (u: User) => void;
  onLogout: () => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const onNavigate = (page: string) => {
    switch (page) {
      case 'main':
        navigate('/');
        break;
      case 'login':
        navigate('/login');
        break;
      case 'signup':
        navigate('/signup');
        break;
      case 'search':
        navigate('/search');
        break;
      case 'recommendation':
        navigate('/recommendation');
        break;
      case 'graduation':
        navigate('/graduation');
        break;
      case 'mypage':
        navigate('/mypage');
        break;
      default:
        navigate('/');
    }
  };

  const showHeader = isLoggedIn || location.pathname === '/';

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <Header
          user={user}
          isLoggedIn={isLoggedIn}
          onLogout={onLogout}
          onNavigate={onNavigate}
          onLogin={() => navigate('/login')}
        />
      )}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/login"
          element={
            <Login
              onLogin={(u: User) => {
                onLogin(u);
                navigate('/');
              }}
              onSignup={() => navigate('/signup')}
            />
          }
        />
        <Route path="/signup" element={<Signup onBack={() => navigate('/login')} />} />

        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/search" element={isLoggedIn ? <Search /> : <Navigate to="/login" replace />} />
        <Route path="/recommendation" element={isLoggedIn ? <Recommend /> : <Navigate to="/login" replace />} />
        <Route path="/graduation" element={isLoggedIn ? <Graduation /> : <Navigate to="/login" replace />} />
        <Route path="/mypage" element={isLoggedIn ? <Mypage /> : <Navigate to="/login" replace />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (userData: User) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <AppInner user={user} isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
    </BrowserRouter>
  );
}

