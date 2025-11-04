import React from "react";
import { Search, BookOpen, GraduationCap, User, LogOut, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface HeaderProps {
  user: any;
  isLoggedIn: boolean;
  onLogout: () => void;
  onNavigate: (page: string) => void;
  onLogin: () => void;
}

export function Header({ user, isLoggedIn, onLogout, onNavigate, onLogin }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* 로고 */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate("main")}>
          <GraduationCap className="h-8 w-8 text-primary" />
          <span className="text-xl">UniCourse</span>
        </div>

        {/* 내비게이션 메뉴 */}
        {isLoggedIn && (
          <nav className="hidden md:flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onNavigate("search")} className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>강의검색</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("recommendation")} className="flex items-center space-x-2">
              <BookOpen className="h-4 w-4" />
              <span>강의추천</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("graduation")} className="flex items-center space-x-2">
              <GraduationCap className="h-4 w-4" />
              <span>졸업요건</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onNavigate("mypage")} className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>마이페이지</span>
            </Button>
          </nav>
        )}

        {/* 사용자 정보 */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" className="hidden sm:flex">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="hidden sm:flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <span className="hidden lg:inline">{user?.name || "학생"}</span>
            </div>
            <Button variant="ghost" size="sm" onClick={onLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button onClick={onLogin} variant="default">로그인</Button>
        )}
      </div>
    </header>
  );
}
