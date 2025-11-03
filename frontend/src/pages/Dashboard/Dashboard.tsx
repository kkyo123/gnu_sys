import React from 'react';
import { TrendingUp, Calendar, Bell, Megaphone, BookOpen, Award, Clock, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { Button } from '../../components/ui/button';
import { Separator } from '../../components/ui/separator';

interface DashboardProps {
  userData?: any;
}

export default function Dashboard({ userData }: DashboardProps) {
  const currentSemesterData = {
    totalCredits: 18,
    earnedCredits: 12,
    gpa: 3.8,
    courses: [
      { name: '자료구조', credits: 3, grade: 'A+' },
      { name: '웹프로그래밍', credits: 3, grade: 'A0' },
      { name: '선형대수학', credits: 3, grade: 'B+' },
      { name: '영어회화', credits: 3, grade: 'A+' },
    ],
  };

  const timetable = [
    { day: '월', time: '09:00-10:30', course: '자료구조', location: '공학관 305', color: 'bg-blue-100 dark:bg-blue-950' },
    { day: '월', time: '13:00-14:30', course: '영어회화', location: '인문관 203', color: 'bg-green-100 dark:bg-green-950' },
    { day: '화', time: '10:30-12:00', course: '선형대수학', location: '수학관 102', color: 'bg-purple-100 dark:bg-purple-950' },
    { day: '수', time: '09:00-10:30', course: '자료구조', location: '공학관 305', color: 'bg-blue-100 dark:bg-blue-950' },
    { day: '수', time: '14:00-15:30', course: '웹프로그래밍', location: '공학관 401', color: 'bg-orange-100 dark:bg-orange-950' },
    { day: '목', time: '10:30-12:00', course: '선형대수학', location: '수학관 102', color: 'bg-purple-100 dark:bg-purple-950' },
    { day: '금', time: '13:00-14:30', course: '영어회화', location: '인문관 203', color: 'bg-green-100 dark:bg-green-950' },
  ];

  const departmentNotices = [
    { id: 1, title: '2024-2학기 전공 수강신청 안내', date: '2024.10.10', important: true },
    { id: 2, title: '학과 MT 참가 신청 안내', date: '2024.10.08', important: false },
    { id: 3, title: '캡스톤 디자인 프로젝트 설명회', date: '2024.10.05', important: true },
    { id: 4, title: '산학협력 기업 초청 세미나', date: '2024.10.03', important: false },
    { id: 5, title: '학과 동아리 신입생 모집', date: '2024.10.01', important: false },
  ];

  const serviceUpdates = [
    { id: 1, title: '강의 추천 알고리즘 업데이트', date: '2024.10.15', tag: '업데이트' },
    { id: 2, title: '모바일 앱 출시 예정 안내', date: '2024.10.12', tag: '공지' },
    { id: 3, title: '시간표 PDF 내보내기 기능 추가', date: '2024.10.10', tag: '신규' },
    { id: 4, title: '강의평 작성 이벤트 진행 중', date: '2024.10.08', tag: '이벤트' },
    { id: 5, title: '서비스 점검 안내 (10/20)', date: '2024.10.05', tag: '점검' },
  ];

  const days = ['월', '화', '수', '목', '금'];
  const timeSlots = ['09:00-10:30', '10:30-12:00', '13:00-14:30', '14:00-15:30', '16:00-17:30'];

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <h1>UniCourse 대시보드</h1>
          <p className="text-muted-foreground mt-2">
            안녕하세요, {userData?.name || '학생'}님! 오늘도 좋은 하루 되세요.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-primary" />
                <span>이번 학기 학점 현황</span>
              </CardTitle>
              <CardDescription>2024학년도 2학기 성적 진행 상황</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">현재 평점</p>
                  <p className="text-3xl">{currentSemesterData.gpa}</p>
                  <p className="text-xs text-muted-foreground mt-1">/ 4.5</p>
                </div>
                <div className="text-center p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">신청 학점</p>
                  <p className="text-3xl">{currentSemesterData.totalCredits}</p>
                  <p className="text-xs text-muted-foreground mt-1">학점</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">진행 중인 학점</span>
                  <span>{currentSemesterData.earnedCredits}/{currentSemesterData.totalCredits}</span>
                </div>
                <Progress value={(currentSemesterData.earnedCredits / currentSemesterData.totalCredits) * 100} className="h-2" />
              </div>

              <Separator />

              <div>
                <h4 className="mb-3 flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>수강 중인 강의</span>
                </h4>
                <div className="space-y-2">
                  {currentSemesterData.courses.map((course, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${index % 4 === 0 ? 'bg-blue-500' : index % 4 === 1 ? 'bg-orange-500' : index % 4 === 2 ? 'bg-purple-500' : 'bg-green-500'}`} />
                        <span className="text-sm">{course.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">{course.credits}학점</Badge>
                        <Badge variant="secondary" className="text-xs">{course.grade}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                전체 성적 보기
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span>이번 학기 시간표</span>
              </CardTitle>
              <CardDescription>주간 강의 일정</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-6 gap-1 mb-2">
                    <div className="text-xs text-center p-2"></div>
                    {days.map((day) => (
                      <div key={day} className="text-xs text-center p-2 bg-muted rounded">
                        {day}
                      </div>
                    ))}
                  </div>

                  {timeSlots.map((time) => (
                    <div key={time} className="grid grid-cols-6 gap-1 mb-1">
                      <div className="text-xs p-2 flex items-center justify-center bg-muted rounded">
                        <Clock className="h-3 w-3 mr-1" />
                        {time.split('-')[0]}
                      </div>
                      {days.map((day) => {
                        const classItem = timetable.find((t) => t.day === day && t.time === time);
                        return (
                          <div
                            key={`${day}-${time}`}
                            className={`text-xs p-2 rounded min-h-[60px] flex flex-col justify-center ${
                              classItem ? `${classItem.color} border` : 'bg-muted/30'
                            }`}
                          >
                            {classItem && (
                              <>
                                <p className="truncate">{classItem.course}</p>
                                <p className="text-xs text-muted-foreground truncate">{classItem.location}</p>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full mt-4">
                시간표 편집하기
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5 text-primary" />
                <span>학과 공지사항</span>
              </CardTitle>
              <CardDescription>{userData?.major || '컴퓨터과학과'} 최신 소식</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {departmentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex-1 flex items-center space-x-3">
                      {notice.important && (
                        <Badge variant="destructive" className="text-xs">중요</Badge>
                      )}
                      <p className="text-sm truncate">{notice.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-2">{notice.date}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                전체 공지 보기
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Megaphone className="h-5 w-5 text-primary" />
                <span>서비스 업데이트</span>
              </CardTitle>
              <CardDescription>UniCourse 새로운 소식</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {serviceUpdates.map((update) => (
                  <div
                    key={update.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex-1 flex items-center space-x-3">
                      <Badge 
                        variant={
                          update.tag === '신규' ? 'default' : 
                          update.tag === '업데이트' ? 'secondary' : 
                          update.tag === '이벤트' ? 'outline' : 'destructive'
                        }
                        className="text-xs"
                      >
                        {update.tag}
                      </Badge>
                      <p className="text-sm truncate">{update.title}</p>
                    </div>
                    <p className="text-xs text-muted-foreground ml-2">{update.date}</p>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4">
                전체 업데이트 보기
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

