import React from 'react';
import { CheckCircle2, LogIn } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function SignupSuccess() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-muted/50 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle>회원가입이 완료되었습니다</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full" onClick={() => navigate('/login')}>
              <LogIn className="h-4 w-4 mr-2" /> 로그인 화면으로
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

