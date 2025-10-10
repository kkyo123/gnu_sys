import React, { useState } from "react";
import { Eye, EyeOff, GraduationCap } from "lucide-react";
import "./login.css"; // CSS는 별도 파일로 분리 가능

interface LoginPageProps {
  onLogin: (userData: any) => void;  // 로그인 성공 후 App에 전달
  onSignup: () => void;              // 회원가입 버튼 클릭 시
}

function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 로그인 시뮬레이션
    setTimeout(() => {
      const userData = {
        id: 1,
        name: "김대학",
        email: email,
        major: "컴퓨터과학과",
        studentId: "2021123456",
        semester: 6,
        gpa: 3.8,
      };
      onLogin(userData); // ✅ App으로 전달
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <GraduationCap className="login-icon" />
          <h1 className="login-title">UniCourse</h1>
          <p className="login-subtitle">학생 포털에 로그인하세요</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            type="email"
            placeholder="student@university.ac.kr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">비밀번호</label>
          <div className="password-field">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              className="icon-button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <div className="checkbox-group">
            <input
              type="checkbox"
              id="remember"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="remember">로그인 상태 유지</label>
          </div>

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="divider">
          <span>또는</span>
        </div>

        <div className="extra-actions">
          <p className="ask">
            계정이 없으신가요?{' '}
            <button type="button" className="link-btn" onClick={onSignup}>
            회원가입
          </button>
          </p>
          
          <button type="button" className="link-btn">
            비밀번호를 잊으셨나요?
          </button>
        </div>

        <footer className="login-footer">
          <p>UniCourse는 대학생들의 학업 관리를 돕습니다</p>
          <p>© 2024 UniCourse. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

// ✅ default export
export default LoginPage;
