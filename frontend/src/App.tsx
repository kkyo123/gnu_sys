import React, { useState } from "react"; 
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom"; 
 
import Home from "./pages/Home"; 
import Search from "./pages/Search"; 
import Recommend from "./pages/Recommend"; 
import Graduation from "./pages/Graduation"; 
import Mypage from "./pages/Mypage"; 
import Login from "./pages/Login"; 
import Signup from "./pages/Signup"; 
import Header from "./components/Header"; 
import Dashboard from "./pages/Dashboard"; 

// ── User 타입 정의 ───────────────────────────────────────────
interface User { 
  name: string;
  id?: number; 
  email?: string;
  // 필요한 다른 필드 추가 가능
} 
 
// ── Auth Gate: 로그인 필요 영역 ─────────────────────────────── 
function RequireAuth({ user }: { user: User | null }) { 
  if (!user) return <Navigate to="/login" replace />; 
  return <Outlet />; // 자식 라우트 렌더 
} 
 
// ── Public Gate: 로그인 상태면 접근 금지(로그인/회원가입) ──── 
function PublicOnly({ user }: { user: User | null }) { 
  if (user) return <Navigate to="/" replace />; 
  return <Outlet />; 
} 
 
// ── 로그인된 화면 공통 레이아웃(헤더 + 컨텐츠 패딩) ─────────── 
function AppLayout({ user, onLogout }: { user: User | null; onLogout: () => void }) { 
  return ( 
    <> 
      <Header user={user} onLogout={onLogout} /> 
      <div style={{ paddingTop: 60 }}> 
        <Outlet /> 
      </div> 
    </> 
  ); 
} 
 
export default function App() { 
  const [user, setUser] = useState<User | null>(null); 
 
  const handleLogin = (userData: User) => setUser(userData); 
  const handleLogout = () => setUser(null); 
 
  return ( 
    <Router> 
      <Routes> 
        {/* 비로그인 전용: 로그인/회원가입 */} 
        <Route element={<PublicOnly user={user} />}> 
          <Route path="/login" element={<Login onLogin={handleLogin} />} /> 
          <Route path="/signup" element={<Signup />} /> 
        </Route> 
 
        {/* 로그인 필요 영역 */} 
        <Route element={<RequireAuth user={user} />}> 
          <Route element={<AppLayout user={user} onLogout={handleLogout} />}> 
            <Route path="/" element={<Dashboard />} /> 
            <Route path="/search" element={<Search />} /> 
            <Route path="/recommend" element={<Recommend />} /> 
            <Route path="/graduation" element={<Graduation />} /> 
            <Route path="/mypage" element={<Mypage />} /> 
            <Route path="/home" element={<Home />} /> 
          </Route> 
        </Route> 
 
        {/* 기타 → 상태에 따라 적절히 리다이렉트 */} 
        <Route path="*" element={<Navigate to={user ? "/" : "/login"} replace />} /> 
      </Routes> 
    </Router> 
  ); 
}