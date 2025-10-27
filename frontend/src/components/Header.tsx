import React from "react";
import { GraduationCap, Search, BookOpen, User, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ✅ 필요한 것만 남김



import "./Header.css";

interface HeaderProps {
  user: { name: string; id?: number; email?: string } | null
  onLogout: () => void;
}

export function Header({ user, onLogout }: HeaderProps) {
  const isLoggedIn = !!user;
  const navigate = useNavigate(); // useNavigate 훅

  if (!isLoggedIn) return null; // 로그인 화면에서는 숨김

  return (
    <header className="header">
      {/* 로고 */}
      <div className="logo" onClick={()=>navigate("/")}>
        <GraduationCap size={24} />
        <span>UniCourse</span>
      </div>

      {/* 네비게이션 메뉴 */}
      <nav className="nav-menu">
        <Link to="/search" className="nav-link">
          <Search size={16} /> 강의검색
        </Link>
        <Link to="/recommend" className="nav-link">
          <BookOpen size={16} /> 강의추천
        </Link>
        <Link to="/graduation" className="nav-link">
          <GraduationCap size={16} /> 졸업요건
        </Link>
        <Link to="/mypage" className="nav-link">
          <User size={16} /> 마이페이지
        </Link>
      </nav>

      {/* 유저 정보 */}
      <div className="user-info">
        <span>{user?.name || "학생"}</span>
        <button onClick={onLogout} className="logout-btn">
          <LogOut size={16} /> 로그아웃
        </button>
      </div>
    </header>
  );
}

export default Header;
