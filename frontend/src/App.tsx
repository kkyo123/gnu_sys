import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Header } from './components/Header';

// Route targets from pages directory
import { LoginPage } from './pages/auth/LoginPage';
import { SignupPage } from './pages/auth/SignupPage';
import SignupSuccess from './pages/auth/SignupSuccess';
import Dashboard from './pages/dashboard/Dashboard';
import Search from './pages/Search/Search';
import Recommend from './pages/Search/Recommend';
import Graduation from './pages/Search/Graduation';
import Mypage from './pages/mypage/mypage';

type User = any;

function AppInner({
  user,
  token,
  isLoggedIn,
  onLogin,
  onLogout,
}: {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  onLogin: (u: User, token: string | null) => void;
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
        <Route
          path="/"
          element={
            isLoggedIn ? (
              <Dashboard userData={user} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage
              onLogin={(u: User, authToken: string) => {
                onLogin(u, authToken);
                navigate('/');
              }}
              onSignup={() => navigate('/signup')}
            />
          }
        />
        <Route
          path="/signup"
          element={
            <SignupPage
              onLogin={(u: User) => {
                onLogin(u, null);
                navigate('/');
              }}
              onBack={() => navigate('/login')}
            />
          }
        />

        <Route
          path="/signup/success"
          element={<SignupSuccess />}
        />

        <Route path="/dashboard" element={isLoggedIn ? <Dashboard userData={user} /> : <Navigate to="/login" replace />} />
        <Route path="/search" element={isLoggedIn ? <Search /> : <Navigate to="/login" replace />} />
        <Route path="/recommendation" element={isLoggedIn ? <Recommend /> : <Navigate to="/login" replace />} />
        <Route path="/graduation" element={isLoggedIn ? <Graduation token={token} user={user} /> : <Navigate to="/login" replace />} />
        <Route
          path="/mypage"
          element={isLoggedIn ? <Mypage token={token} user={user} /> : <Navigate to="/login" replace />}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = (userData: User, authToken: string | null) => {
    setUser(userData);
    setToken(authToken);
    setIsLoggedIn(Boolean(authToken));
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <AppInner user={user} token={token} isLoggedIn={isLoggedIn} onLogin={handleLogin} onLogout={handleLogout} />
    </BrowserRouter>
  );
}
