import React, { useState } from "react";
import "./Signup.css";

interface SignupProps {
  onBack?: () => void;
}

const Signup: React.FC<SignupProps> = ({ onBack }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      alert("회원가입이 완료되었습니다.");
      setIsLoading(false);
      onBack?.();
    }, 600);
  };

  return (
    <div className="card">
      <div className="card-header">
        <button className="back-button" onClick={onBack}>뒤로</button>
        <div>
          <h2 className="card-title">회원가입</h2>
          <p className="card-description">기본 정보를 입력하세요</p>
        </div>
      </div>
      <div className="card-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="field">
            <label htmlFor="name">이름</label>
            <input id="name" placeholder="홍길동" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="email">이메일</label>
            <input id="email" type="email" placeholder="student@university.ac.kr" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="field">
            <label htmlFor="password">비밀번호</label>
            <input id="password" type="password" placeholder="비밀번호를 입력하세요" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="submit-btn" disabled={isLoading}>{isLoading ? "가입 중..." : "가입하기"}</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
