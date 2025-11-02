import React, { useState } from 'react';
import { GraduationCap, CheckCircle, AlertCircle, BookOpen, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface GraduationRequirementsProps {
  user: any;
}

export function GraduationRequirements({ user }: GraduationRequirementsProps) {
  const graduationData = {
    totalRequired: 130,
    completed: 107,
    remaining: 23,
    requirements: {
      major: { required: 60, completed: 48, remaining: 12 },
      general: { required: 30, completed: 30, remaining: 0 },
      elective: { required: 40, completed: 29, remaining: 11 }
    },
    gpa: 3.8,
    minGpa: 2.0
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
      priority: 'high'
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
      priority: 'high'
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
      priority: 'medium'
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
      priority: 'medium'
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
      priority: 'high'
    }
  ];

  const semesterPlan = {
    '2024-2': {
      credits: 15,
      courses: [
        { name: '소프트웨어공학', credits: 3, category: '전공필수' },
        { name: '컴퓨터네트워크', credits: 3, category: '전공필수' },
        { name: '인공지능', credits: 3, category: '전공선택' },
        { name: '창의적사고', credits: 2, category: '교양선택' },
        { name: '영어회화2', credits: 2, category: '교양선택' },
        { name: '체육2', credits: 1, category: '교양선택' }
      ]
    },
    '2025-1': {
      credits: 12,
      courses: [
        { name: '캡스톤디자인', credits: 3, category: '전공필수' },
        { name: '데이터베이스프로젝트', credits: 3, category: '전공선택' },
        { name: '정보보호', credits: 3, category: '전공선택' },
        { name: '졸업논문', credits: 3, category: '전공필수' }
      ]
    }
  };

  const getProgressColor = (completed: number, required: number) => {
    const percentage = (completed / required) * 100;
    if (percentage >= 100) return 'bg-green-500';
    if (percentage >= 80) return 'bg-blue-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1>졸업 요건</h1>
        <p className="text-muted-foreground mt-2">졸업을 위한 남은 학점을 확인하세요</p>
      </div>
        {/* Overview */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>졸업 요건 현황</span>
            </CardTitle>
            <CardDescription>
              {user?.name || '학생'}님의 졸업까지 남은 학점과 요건을 확인하세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Overall Progress */}
              <div className="space-y-4">
                <h3>전체 이수 현황</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>총 이수학점</span>
                    <span>{graduationData.completed}/{graduationData.totalRequired}학점</span>
                  </div>
                  <Progress 
                    value={(graduationData.completed / graduationData.totalRequired) * 100} 
                    className="h-3"
                  />
                  <p className="text-sm text-muted-foreground">
                    졸업까지 <span className="text-primary">{graduationData.remaining}학점</span> 남았습니다
                  </p>
                </div>
              </div>

              {/* GPA */}
              <div className="space-y-4">
                <h3>학점 현황</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>현재 평점</span>
                    <span className="text-2xl">{graduationData.gpa}/4.5</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm text-green-600">
                      졸업 요구 평점 {graduationData.minGpa} 이상 충족
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Requirements Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {Object.entries(graduationData.requirements).map(([key, req]) => (
            <Card key={key}>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3>
                      {key === 'major' && '전공'}
                      {key === 'general' && '교양'}
                      {key === 'elective' && '선택'}
                    </h3>
                    {req.remaining === 0 ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-orange-500" />
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>이수학점</span>
                      <span>{req.completed}/{req.required}학점</span>
                    </div>
                    <Progress 
                      value={(req.completed / req.required) * 100} 
                      className="h-2"
                    />
                    {req.remaining > 0 && (
                      <p className="text-sm text-orange-600">
                        {req.remaining}학점 필요
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="recommendations" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="recommendations">추천 강의</TabsTrigger>
            <TabsTrigger value="plan">학기별 계획</TabsTrigger>
          </TabsList>

          <TabsContent value="recommendations">
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
                  {recommendedCourses.map((course) => (
                    <Card key={course.id} className="border-l-4 border-l-primary/20">
                      <CardContent className="pt-6">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3>{course.name}</h3>
                              <Badge variant={getPriorityColor(course.priority)}>
                                {course.priority === 'high' && '필수'}
                                {course.priority === 'medium' && '권장'}
                                {course.priority === 'low' && '선택'}
                              </Badge>
                              <Badge variant="outline">{course.credits}학점</Badge>
                            </div>
                            
                            <p className="text-muted-foreground text-sm mb-3">
                              {course.description}
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">분류: </span>
                                <span>{course.category}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">난이도: </span>
                                <span>{course.difficulty}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">선수과목: </span>
                                <span>{course.prerequisite}</span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col items-end space-y-2">
                            <div className="text-sm text-muted-foreground">
                              {course.semester} • {course.professor}
                            </div>
                            <Button size="sm">
                              수강 계획 추가
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan">
            <div className="space-y-6">
              {Object.entries(semesterPlan).map(([semester, plan]) => (
                <Card key={semester}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span>{semester}학기 계획</span>
                      <Badge variant="outline">{plan.credits}학점</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {plan.courses.map((course, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <div className="text-sm mb-1">{course.name}</div>
                            <div className="text-xs text-muted-foreground">{course.category}</div>
                          </div>
                          <Badge variant="secondary">{course.credits}학점</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
    </main>
  );
}