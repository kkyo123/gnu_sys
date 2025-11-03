import React, { useState } from 'react';
import { User, Edit, Save, X, Award, GraduationCap, Star } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';

import type { UserBasic } from '@/types/user';
import type {
  AcademicProgress,
  GraduationRequirement,
  CourseReview,
  SortBy,
  RecommendationPrefs,
  NotificationPrefs,
} from '@/types/my-page';

interface MyPageProps {
  user: UserBasic | null;
}

export function MyPage({ user }: MyPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserBasic | null>(user);
  const [sortBy, setSortBy] = useState<SortBy>('latest');
  const [activeKeywords, setActiveKeywords] = useState<string[]>(['#이론중심', '#PPT강의', '#프로젝트']);
  const [recommendations, setRecommendations] = useState<RecommendationPrefs>({ credits: true, keywords: true });
  const [notifications, setNotifications] = useState<NotificationPrefs>({ reviews: true, requirements: true, recommendations: false });

  const academicData: AcademicProgress = {
    totalCredits: { current: 105, required: 130 },
    majorCredits: { current: 72, required: 80 },
    gpa: { current: 3.85, max: 4.5 },
    creditsByCategory: { major: 72, general: 24, elective: 9 },
  };

  const graduationRequirements: GraduationRequirement[] = [
    { id: 1, title: '전공필수 이수', status: 'completed', icon: '🎓' },
    { id: 2, title: '교양필수 이수', status: 'completed', icon: '📘' },
    { id: 3, title: '캡스톤프로젝트 수강', status: 'in-progress', icon: '🧪' },
    { id: 4, title: '졸업논문 제출', status: 'pending', icon: '📝' },
  ];

  const courseReviews: CourseReview[] = [
    { id: 1, courseName: '자료구조', professor: '김교수', rating: 4.5, semester: '2024-1', category: '전공', review: '프로젝트가 유익했어요', date: '2024-06-15' },
    { id: 2, courseName: '운영체제', professor: '이교수', rating: 4.3, semester: '2024-1', category: '전공', review: '강의가 명확하고 실습이 좋아요', date: '2024-06-10' },
  ];

  const handleSave = () => setIsEditing(false);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarFallback>{(editedUser?.name ?? 'U').slice(0, 1)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">마이페이지</CardTitle>
              <CardDescription>{editedUser?.email ?? '이메일 없음'}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="mr-1 h-4 w-4" /> 취소
                </Button>
                <Button onClick={handleSave}>
                  <Save className="mr-1 h-4 w-4" /> 저장
                </Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit className="mr-1 h-4 w-4" /> 편집
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">이름</Label>
            <Input
              id="name"
              value={editedUser?.name ?? ''}
              disabled={!isEditing}
              onChange={(e) => setEditedUser((prev) => (prev ? { ...prev, name: e.target.value } : prev))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="major">전공</Label>
            <Input
              id="major"
              value={editedUser?.major ?? ''}
              disabled={!isEditing}
              onChange={(e) => setEditedUser((prev) => (prev ? { ...prev, major: e.target.value } : prev))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" /> 학업 현황
            </CardTitle>
            <CardDescription>누적 학점과 GPA</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">누적 학점</div>
                <div className="text-2xl font-semibold">{academicData.totalCredits.current}/{academicData.totalCredits.required}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">전공 학점</div>
                <div className="text-2xl font-semibold">{academicData.majorCredits.current}/{academicData.majorCredits.required}</div>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <span>GPA</span>
                <span>{academicData.gpa.current} / {academicData.gpa.max}</span>
              </div>
              <Progress value={(academicData.gpa.current / academicData.gpa.max) * 100} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" /> 졸업 요건
            </CardTitle>
            <CardDescription>요건 진행 상황</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {graduationRequirements.map((r) => (
              <div key={r.id} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span>{r.icon}</span>
                  <span>{r.title}</span>
                </div>
                <Badge variant={r.status === 'completed' ? 'default' : r.status === 'in-progress' ? 'secondary' : 'outline'}>
                  {r.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5 text-primary" /> 나의 강의 리뷰
          </CardTitle>
          <CardDescription>최근 작성한 리뷰</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {courseReviews.map((c) => (
            <div key={c.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium">{c.courseName} · {c.professor}</div>
                <div className="text-sm text-muted-foreground">{c.semester} · {c.category}</div>
              </div>
              <div className="text-sm">⭐ {c.rating.toFixed(1)}</div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default MyPage;

