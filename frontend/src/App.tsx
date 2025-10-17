import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// 페이지 컴포넌트 import
import Home from "./pages/Home";
import Search from "./pages/Search";
import Recommend from "./pages/Recommend"
import Graduation from "./pages/Graduation"
import Mypage from "./pages/Mypage"
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Header from "./components/Header";
import "./components/Header.css";

function App() {
  const [user, setUser] = useState<any>(null);

  const handleLogin = (userData: any) => {
    setUser(userData); // 로그인 성공 시 user 상태 업데이트
  };

  const handleLogout = () => {
    setUser(null); // 로그아웃 시 user 초기화
  };


  // 로그인 상태이면 Router 안에서 페이지 렌더링
 return (
    <Router>
      {/* user가 없으면 로그인/회원가입 라우트만 접근 가능 */}
      {!user ? (
        <Routes>
          <Route 
            path="/login" 
            element={
              <Login 
                onLogin={handleLogin}
                onSignup={() => window.location.href = "/signup"}
              />
            } 
          />
          <Route path="/signup" element={<Signup />} />
          {/* 기본 경로일 때 로그인 페이지로 이동 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      ) : (
        <>
          {/* 상단 헤더 */}
          <Header user={user} onLogout={handleLogout} />

          {/* 콘텐츠 (헤더 아래로) */}
          <div style={{ paddingTop: "60px" }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<Search />} />
              <Route path="/recommend" element={<Recommend />} />
              <Route path="/graduation" element={<Graduation />} />
              <Route path="/mypage" element={<Mypage />} />
              {/* 잘못된 경로는 홈으로 이동 */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </>
      )}
    </Router>
  );
}


export default App;
