import React from 'react';
import { GraduationCap, CheckCircle, BookOpen, Target } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Progress } from '../../components/ui/progress';
import { Badge } from '../../components/ui/badge';

interface GraduationPageProps {
  user?: any;
}

const Graduation = ({ user }: GraduationPageProps) => {
  const graduationData = {
    totalRequired: 130,
    completed: 107,
    remaining: 23,
    requirements: {
      major: { required: 60, completed: 48, remaining: 12 },
      general: { required: 30, completed: 30, remaining: 0 },
      elective: { required: 40, completed: 29, remaining: 11 },
    },
    gpa: 3.8,
    minGpa: 2.0,
  };

  const recommendedCourses = [
    {
      id: 1,
      name: '소프트웨어공학',
      credits: 3,
      category: '전공필수',
      difficulty: '중급',
      prerequisite: '자료구조',
      semester: '2024-2',
      professor: '김교수',
      rating: 4.2,
      description: '졸업을 위한 필수 전공과목입니다',
      priority: 'high',
    },
    {
      id: 2,
      name: '컴퓨터네트워크',
      credits: 3,
      category: '전공필수',
      difficulty: '중급',
      prerequisite: '운영체제',
      semester: '2024-2',
      professor: '이교수',
      rating: 4.0,
      description: '졸업을 위한 필수 전공과목입니다',
      priority: 'high',
    },
    {
      id: 3,
      name: '인공지능',
      credits: 3,
      category: '전공선택',
      difficulty: '고급',
      prerequisite: '기계학습',
      semester: '2024-2',
      professor: '박교수',
      rating: 4.5,
      description: '최신 기술 트렌드에 맞는 추천 과목',
      priority: 'medium',
    },
    {
      id: 4,
      name: '창의적사고',
      credits: 2,
      category: '교양선택',
      difficulty: '초급',
      prerequisite: '없음',
      semester: '2024-2',
      professor: '정교수',
      rating: 4.3,
      description: '남은 교양학점을 채우기 위한 과목',
      priority: 'medium',
    },
    {
      id: 5,
      name: '캡스톤디자인',
      credits: 3,
      category: '전공필수',
      difficulty: '고급',
      prerequisite: '소프트웨어공학',
      semester: '2025-1',
      professor: '최교수',
      rating: 4.1,
      description: '졸업작품을 위한 필수과목',
      priority: 'high',
    },
  ];

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1>졸업 요건</h1>
        <p className="text-muted-foreground mt-2">졸업을 위한 남은 학점을 확인하세요</p>
      </div>

      {/* Circular Progress Overview - 학점 이수 진행도 */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  className="text-muted/20"
                />
                <circle
                  cx="100"
                  cy="100"
                  r="80"
                  stroke="currentColor"
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${(graduationData.completed / graduationData.totalRequired) * 502.4} 502.4`}
                  className="text-green-500 transition-all duration-500"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-5xl mb-1">{graduationData.completed}</div>
                <div className="text-sm text-muted-foreground">총 이수학점</div>
              </div>
            </div>
            <div className="text-center">
              <h3 className="mb-1">{user?.major || '학과'} 이수 진행도</h3>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                <span>이수학점: {graduationData.completed}학점</span>
                <span>•</span>
                <span>남은학점: {graduationData.remaining}학점</span>
                <span>•</span>
                <span>평점: {graduationData.gpa}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Progress Bars - 전공필수, 전공선택, 핵심교양, 균형교양 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3>전공필수</h3>
                <span className="text-sm text-muted-foreground">
                  42/45학점
                </span>
              </div>
              <Progress 
                value={(42 / 45) * 100} 
                className="h-3"
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">진행률: {Math.round((42 / 45) * 100)}%</span>
                <span className="text-orange-600">3학점 남음</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3>전공선택</h3>
                <span className="text-sm text-muted-foreground">
                  21/24학점
                </span>
              </div>
              <Progress 
                value={(21 / 24) * 100} 
                className="h-3"
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">진행률: {Math.round((21 / 24) * 100)}%</span>
                <span className="text-orange-600">3학점 남음</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3>핵심교양</h3>
                <span className="text-sm text-muted-foreground">
                  18/18학점
                </span>
              </div>
              <Progress 
                value={100} 
                className="h-3"
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">진행률: 100%</span>
                <span className="text-green-600">이수 완료</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <h3>균형교양</h3>
                <span className="text-sm text-muted-foreground">
                  12/18학점
                </span>
              </div>
              <Progress 
                value={(12 / 18) * 100} 
                className="h-3"
              />
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">진행률: {Math.round((12 / 18) * 100)}%</span>
                <span className="text-orange-600">6학점 남음</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Balanced Liberal Arts (8 Areas) - 균형교양 8영역 */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>균형교양 (8영역 중 6개 이수)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: '문학과문화', completed: true },
              { name: '인간과사회', completed: true },
              { name: '과학과기술', completed: true },
              { name: '진로와개척', completed: true },
              { name: '역사와철학', completed: false },
              { name: '생명과환경', completed: false },
              { name: '예술과체육', completed: false },
              { name: '융복합', completed: false },
            ].map((area, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border-2 flex items-center gap-2 transition-colors ${
                  area.completed
                    ? 'bg-green-50 border-green-200'
                    : 'bg-muted/30 border-muted'
                }`}
              >
                {area.completed ? (
                  <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <span className={`text-sm ${area.completed ? 'text-green-700' : 'text-muted-foreground'}`}>
                  {area.name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-4">4개 영역 미이수</p>
        </CardContent>
      </Card>

      {/* Graduation Certification System - 졸업자격인증제 */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>졸업자격인증제 진행도</CardTitle>
            <Button variant="ghost" size="sm">
              수정하기
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* 영어인증제 */}
            <div
              className={`p-4 rounded-lg border-2 ${
                true
                  ? 'bg-green-50 border-green-200'
                  : 'bg-muted/30 border-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                {true ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <span className={true ? 'text-green-700' : 'text-muted-foreground'}>
                  영어인증제
                </span>
              </div>
            </div>

            {/* 꿈미래개척 상담인증제 */}
            <div
              className={`p-4 rounded-lg border-2 ${
                false
                  ? 'bg-green-50 border-green-200'
                  : 'bg-muted/30 border-muted'
              }`}
            >
              <div className="flex items-center gap-3">
                {false ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <span className={false ? 'text-green-700' : 'text-muted-foreground'}>
                  꿈미래개척 상담인증제
                </span>
              </div>
            </div>

            {/* 선택인증제 */}
            <div
              className={`p-4 rounded-lg border-2 ${
                true
                  ? 'bg-green-50 border-green-200'
                  : 'bg-muted/30 border-muted'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                {true ? (
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                )}
                <span className={true ? 'text-green-700' : 'text-muted-foreground'}>
                  선택인증제 (하나 이상 이수)
                </span>
              </div>
              
              {/* 선택인증제 하위 항목들 */}
              <div className="ml-8 space-y-2">
                {[
                  { name: '사회봉사', completed: false },
                  { name: '글로벌리더십', completed: true },
                  { name: '독서', completed: false },
                  { name: '인성', completed: false },
                  { name: '진로탐색', completed: false },
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    {item.completed ? (
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
                    )}
                    <span className={item.completed ? 'text-green-600' : 'text-muted-foreground'}>
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Courses */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Target className="h-5 w-5 text-primary" />
            <span>졸업을 위한 추천 강의</span>
          </CardTitle>
          <CardDescription>
            남은 학점과 졸업 요건을 고려한 맞춤 강의 추천
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendedCourses.slice(0, 2).map((course) => (
              <Card key={course.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <h3>{course.name}</h3>
                        <Badge 
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 hover:bg-blue-100"
                        >
                          {course.priority === 'high' && '필수'}
                          {course.priority === 'medium' && '권장'}
                          {course.priority === 'low' && '선택'}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {course.category} • {course.semester}
                        </span>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {course.description}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-4 lg:flex-col lg:items-end">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <BookOpen className="h-4 w-4" />
                          <span>교수명</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          <span>{course.credits}학점</span>
                        </div>
                        <span className="text-muted-foreground">{course.difficulty}</span>
                      </div>
                      <Button size="sm" className="bg-foreground text-background hover:bg-foreground/90">
                        상세보기
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
};

export default Graduation;
