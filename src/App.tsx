import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

// 페이지 컴포넌트 import
import Home from "./pages/Home";
import Search from "./pages/Search";
import Recommend from "./pages/Recommend"
import Graduation from "./pages/Graduation"
import Mypage from "./pages/Mypage"
import Login from "./pages/Login";
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

  // 로그인 상태가 없으면 Login 페이지 표시
  if (!user) {
    return (
      <Login
        onLogin={handleLogin}
        onSignup={() => alert("회원가입 기능 준비 중입니다")}
      />
    );
  }

  // 로그인 상태이면 Router 안에서 페이지 렌더링
  return (
    <Router>
      {/* 상단 헤더 */}
      <Header user={user} onLogout={handleLogout} />

      {/* 페이지 내용 padding-top 적용 (헤더 때문에 콘텐츠 가려짐 방지) */}
      <div style={{ paddingTop: "60px" }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/recommend" element={<Recommend />} />
          <Route path="/graduation" element={<Graduation />} />
          <Route path="/mypage" element={<Mypage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
