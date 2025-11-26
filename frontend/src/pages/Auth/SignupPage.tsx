import React, { useState } from 'react';
import { GraduationCap, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { register } from '../../lib/api/auth';
import { useNavigate } from 'react-router-dom';

interface SignupPageProps {
  onLogin: (userData: any) => void;
  onBack: () => void;
}

// 유지 필드: name, username, studentId, department, password, confirmPassword
export function SignupPage({ onLogin, onBack }: SignupPageProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    studentId: '',
    department: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ studentId?: string; username?: string }>({});

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (field === 'studentId' || field === 'username') {
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!formData.name.trim()) {
      setError('이름을 입력해 주세요');
      return;
    }
    if (!/^\d{8,10}$/.test(formData.studentId)) {
      setError('학번은 숫자 8~10자리여야 합니다');
      return;
    }
    if (!/^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,16}$/.test(formData.password)) {
      setError('비밀번호는 영문/숫자/특수문자 포함 8~16자여야 합니다');
      return;
    }
    if (!agreeTerms) {
      setError('이용약관에 동의해 주세요');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }
    try {
      setIsLoading(true);
      await register({
        student_id: formData.studentId,
        name: formData.name,
        password: formData.password,
        username: formData.username,
        department: formData.department,
      });
      navigate('/signup/success');
    } catch (err: any) {
      const raw = String(err?.message || '');
      let msg = '회원가입 처리 중 오류가 발생했습니다.';
      const next: { studentId?: string; username?: string } = {};
      if (/^409\b/.test(raw)) {
        // FastAPI 기본 에러 바디 {"detail":"..."} 파싱
        let detail: string | null = null;
        const dash = raw.indexOf(' - ');
        if (dash >= 0) {
          const tail = raw.slice(dash + 3).trim();
          try {
            const parsed = JSON.parse(tail);
            if (parsed && typeof parsed.detail === 'string') detail = parsed.detail;
          } catch {}
        }
        if (!detail) {
          if (raw.includes('Student ID already registered')) detail = 'Student ID already registered';
          else if (raw.includes('Username already taken')) detail = 'Username already taken';
        }
        if (detail === 'Student ID already registered') {
          next.studentId = '이미 등록된 학번입니다.';
          msg = next.studentId;
        } else if (detail === 'Username already taken') {
          next.username = '이미 사용 중인 닉네임입니다.';
          msg = next.username;
        }
      }
      setFieldErrors(next);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <GraduationCap className="h-10 w-10 text-primary" />
            <span className="text-2xl">UniCourse</span>
          </div>
          <p className="text-muted-foreground">필수 정보를 입력해 계정을 만들어 주세요</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle>회원가입</CardTitle>
                <CardDescription>학생 정보를 입력해 주세요</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input id="name" placeholder="홍길동" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="studentId">학번</Label>
                  <Input id="studentId" placeholder="2024123456" value={formData.studentId} inputMode="numeric" maxLength={10} onChange={(e) => handleInputChange('studentId', e.target.value.replace(/\D/g, '').slice(0, 10))} required aria-invalid={!!fieldErrors.studentId} />
                  {fieldErrors.studentId && <p className="text-xs text-red-600 mt-1">{fieldErrors.studentId}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="username">아이디</Label>
                  <Input id="username" placeholder="student123" value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} required aria-invalid={!!fieldErrors.username} />
                  {fieldErrors.username && <p className="text-xs text-red-600 mt-1">{fieldErrors.username}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="department">학과</Label>
                  <Input id="department" placeholder="컴퓨터공학과" value={formData.department} onChange={(e) => handleInputChange('department', e.target.value)} required />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="비밀번호를 입력해 주세요" value={formData.password} onChange={(e) => handleInputChange('password', e.target.value)} minLength={8} maxLength={16} required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">비밀번호 확인</Label>
                <div className="relative">
                  <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="비밀번호를 다시 입력해 주세요" value={formData.confirmPassword} onChange={(e) => handleInputChange('confirmPassword', e.target.value)} required />
                  <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" checked={agreeTerms} onCheckedChange={(checked) => setAgreeTerms(!!checked)} />
                <Label htmlFor="terms" className="text-sm">이용약관 및 개인정보처리방침에 동의합니다</Label>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '처리 중..' : '가입하기'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                이미 계정이 있으신가요?{' '}
                <Button variant="link" className="p-0 h-auto" onClick={onBack}>로그인</Button>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

