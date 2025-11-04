import React, { useState } from 'react';
import { GraduationCap, Eye, EyeOff } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Checkbox } from '../../components/ui/checkbox';
import { login, me } from '../../lib/api/auth';

interface LoginPageProps {
  onLogin: (userData: any) => void;
  onSignup: () => void;
}

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const token = await login(identifier, password);
      if ((import.meta as any).env?.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[auth] login token:', token?.access_token?.slice(0, 24) + '...');
      }
      const profile = await me(token.access_token);
      if ((import.meta as any).env?.DEV) {
        // eslint-disable-next-line no-console
        console.debug('[auth] /auth/me profile:', profile);
      }
      onLogin(profile);
    } catch (err: any) {
      setError(err?.message || '로그인에 실패했습니다');
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
          <p className="text-muted-foreground">학생 포털에 로그인하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>계정 정보를 입력해 주세요</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="id">이메일 또는 학번</Label>
                <Input
                  id="id"
                  type="text"
                  placeholder="student@university.ac.kr 또는 2024123456"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">비밀번호</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="비밀번호를 입력하세요"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(Boolean(v))} />
                <Label htmlFor="remember" className="text-sm">로그인 상태 유지</Label>
              </div>

              {error && <div className="text-sm text-red-600">{error}</div>}
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? '로그인 중...' : '로그인'}
              </Button>
            </form>

            <div className="mt-6 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">또는</span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  계정이 없으신가요?{' '}
                  <Button variant="link" className="p-0 h-auto" onClick={onSignup}>회원가입</Button>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>UniCourse – 학생들의 학업 관리를 돕습니다</p>
          <p className="mt-1">© 2024 UniCourse. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

