import React, { useState } from "react";
import "./login.css";

interface LoginProps {
  onLogin: (userData: any) => void;
  onSignup?: () => void;
}

function Login({ onLogin, onSignup }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin({ id: 1, name: "사용자", email });
      setIsLoading(false);
    }, 400);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
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
          <input
            id="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="submit-btn" disabled={isLoading}>
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="extra-actions">
          <p className="ask">
            계정이 없으신가요?{" "}
            <button type="button" className="link-btn" onClick={onSignup}>
              회원가입
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
