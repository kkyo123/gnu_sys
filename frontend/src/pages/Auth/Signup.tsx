import React, { useState } from 'react';
import './Signup.css';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SignupFormData {
  name: string;
  studentId: string;
  email: string;
  major: string;
  semester: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

interface SignupProps {
  onBack?: () => void;
}

const majors = ['컴퓨터공학과', '전자공학과', '경영학과', '디자인학과'];
const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

const Signup: React.FC<SignupProps> = ({ onBack }) => {
const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupFormData>({
    name: '',
    studentId: '',
    email: '',
    major: '',
    semester: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: keyof SignupFormData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert('이용약관에 동의해주세요.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      alert('회원가입 완료!');
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="card">
      <div className="card-header">
        <button className="back-button" onClick={onBack}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="card-title">회원가입</h2>
          <p className="card-description">학생 정보를 입력해주세요</p>
        </div>
      </div>

      <div className="card-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="row">
            <div className="field">
              <label htmlFor="name">이름</label>
              <input
                id="name"
                placeholder="홍길동"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                required
              />
            </div>
            <div className="field">
              <label htmlFor="studentId">학번</label>
              <input
                id="studentId"
                placeholder="2021123456"
                value={formData.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                required
              />
            </div>
          </div>

          <div className="field">
            <label htmlFor="email">이메일</label>
            <input
              id="email"
              type="email"
              placeholder="student@university.ac.kr"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          <div className="row">
            <div className="field">
              <label htmlFor="major">전공</label>
              <select
                id="major"
                value={formData.major}
                onChange={(e) => handleInputChange('major', e.target.value)}
              >
                <option value="">전공 선택</option>
                {majors.map((major) => (
                  <option key={major} value={major}>
                    {major}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="semester">학기</label>
              <select
                id="semester"
                value={formData.semester}
                onChange={(e) => handleInputChange('semester', e.target.value)}
              >
                <option value="">학기 선택</option>
                {semesters.map((semester) => (
                  <option key={semester} value={semester}>
                    {semester}학기
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="phone">연락처</label>
            <input
              id="phone"
              placeholder="010-1234-5678"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label htmlFor="password">비밀번호</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="field">
            <label htmlFor="confirmPassword">비밀번호 확인</label>
            <div className="password-wrapper">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="비밀번호를 다시 입력하세요"
                value={formData.confirmPassword}
                onChange={(e) =>
                  handleInputChange('confirmPassword', e.target.value)
                }
                required
              />
              <button
                type="button"
                className="eye-button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="checkbox-row">
            <input
              type="checkbox"
              id="terms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <label htmlFor="terms">
              이용약관 및 개인정보처리방침에 동의합니다
            </label>
          </div>

          <button type="submit" className="submit-button" disabled={isLoading}>
            {isLoading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <div className="footer">
          <p>
            이미 계정이 있으신가요?{' '}
            <button className="link-button" onClick={onBack}>
              로그인
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
