import React, { useState } from 'react';
import { Header } from './components/Header';
import { MainPage } from './components/MainPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { CourseSearch } from './components/CourseSearch';
import { CourseRecommendation } from './components/CourseRecommendation';
import { GraduationRequirements } from './components/GraduationRequirements';
import { MyPage } from './components/MyPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('main');
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('main');
  };

  const renderPage = () => {
    if (!isLoggedIn && currentPage !== 'signup') {
      return <LoginPage onLogin={handleLogin} onSignup={() => setCurrentPage('signup')} />;
    }

    switch (currentPage) {
      case 'main':
        return <MainPage user={user} />;
      case 'login':
        return <LoginPage onLogin={handleLogin} onSignup={() => setCurrentPage('signup')} />;
      case 'signup':
        return <SignupPage onLogin={handleLogin} onBack={() => setCurrentPage('login')} />;
      case 'search':
        return <CourseSearch />;
      case 'recommendation':
        return <CourseRecommendation />;
      case 'graduation':
        return <GraduationRequirements user={user} />;
      case 'mypage':
        return <MyPage user={user} />;
      default:
        return <MainPage user={user} />;
    }
  };

  // 로그인/회원가입 페이지에서는 헤더 숨김
  const showHeader = isLoggedIn || currentPage === 'main';

  return (
    <div className="min-h-screen bg-background">
      {showHeader && (
        <Header
          user={user}
          isLoggedIn={isLoggedIn}
          onLogout={handleLogout}
          onNavigate={setCurrentPage}
          onLogin={() => setCurrentPage('login')}
        />
      )}
      {renderPage()}
    </div>
  );
}