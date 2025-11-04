import React, { useState } from 'react';
import { BookOpen, Settings, Star, Check, AlertTriangle, Sparkles, GraduationCap, Award, FileText, Plus, Bell, ChevronRight, Upload, Download } from 'lucide-react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Separator } from '../components/ui/separator';

interface MyPageProps { user?: any }

export default function Mypage({ user }: MyPageProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [selectedSemester, setSelectedSemester] = useState('2024-1');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [activeKeywords, setActiveKeywords] = useState<string[]>(['토론', 'PPT강의', '팀프로젝트']);
  const [notifications, setNotifications] = useState({ gradePosting: true, graduationWarning: true, newSemester: false });
  const [displaySettings, setDisplaySettings] = useState({ timeUnit: '30', weekStart: '월', theme: '시스템' });

  const academicData = {
    totalCredits: { current: 105, required: 130 },
    majorCredits: { current: 72, required: 80 },
    generalCredits: { current: 24, required: 30 },
    gpa: { current: 3.85, max: 4.5 },
    creditsByCategory: { major: 72, general: 24, elective: 9 },
  };

  const graduationRequirements = [
    { id: 1, title: '전공필수 완료', status: 'completed', icon: '✅' },
    { id: 2, title: '교양필수 완료', status: 'completed', icon: '✅' },
    { id: 3, title: '캡스톤 프로젝트 수강 중', status: 'in-progress', icon: '⚠️' },
    { id: 4, title: '졸업논문 제출', status: 'pending', icon: '❌' },
    { id: 5, title: '영어인증 제출', status: 'completed', icon: '✅' },
  ];

  const courseReviews = [
    { id: 1, courseName: '자료구조', professor: '김교수', rating: 4.5, semester: '2024-1', category: '전공', review: '프로젝트가 많지만 배울 점이 많아요.', date: '2024-06-15', keywords: ['코딩실습', '과제많음', '실습위주'] },
    { id: 2, courseName: '운영체제', professor: '이교수', rating: 4.3, semester: '2024-1', category: '전공', review: '이론 설명이 명확하고 실습도 충실해요.', date: '2024-06-10', keywords: ['이론중심', 'PPT강의'] },
    { id: 3, courseName: '영어회화', professor: 'Smith', rating: 4.8, semester: '2023-2', category: '교양', review: '원어민 교수님과의 수업이 정말 도움이 되었습니다!', date: '2024-01-20', keywords: ['토론', '참여형'] },
  ];

  const radarData = [
    { subject: '전공필수', value: 100, fullMark: 100 },
    { subject: '전공선택', value: 85, fullMark: 100 },
    { subject: '교양', value: 90, fullMark: 100 },
    { subject: '기초', value: 100, fullMark: 100 },
    { subject: '영어', value: 100, fullMark: 100 },
    { subject: '봉사', value: 70, fullMark: 100 },
  ];

  const semesterData = [
    { semester: '2021-1', gpa: 3.65 },
    { semester: '2021-2', gpa: 3.72 },
    { semester: '2022-1', gpa: 3.88 },
    { semester: '2022-2', gpa: 3.95 },
    { semester: '2023-1', gpa: 4.02 },
    { semester: '2023-2', gpa: 3.78 },
    { semester: '2024-1', gpa: 3.92 },
  ];

  const requiredCourses = [
    { id: 1, name: '자료구조', completed: true },
    { id: 2, name: '알고리즘', completed: true },
    { id: 3, name: '운영체제', completed: true },
    { id: 4, name: '데이터베이스', completed: true },
    { id: 5, name: '컴퓨터네트워크', completed: false },
    { id: 6, name: '소프트웨어공학', completed: false },
  ];

  const timetableData = [
    { id: 1, name: '자료구조', professor: '김교수', day: 0, startTime: 9, duration: 2, color: 'bg-blue-500' },
    { id: 2, name: '운영체제', professor: '이교수', day: 1, startTime: 10.5, duration: 1.5, color: 'bg-purple-500' },
    { id: 3, name: '데이터베이스', professor: '최교수', day: 2, startTime: 13, duration: 2, color: 'bg-green-500' },
    { id: 4, name: '컴퓨터네트워크', professor: '박교수', day: 3, startTime: 9, duration: 1.5, color: 'bg-orange-500' },
    { id: 5, name: '웹프로그래밍', professor: '정교수', day: 4, startTime: 14, duration: 2, color: 'bg-pink-500' },
  ];

  const days = ['월', '화', '수', '목', '금'];
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8);

  const filteredReviews = courseReviews
    .filter((review) => {
      const matchesSemester = selectedSemester === '전체' || review.semester === selectedSemester;
      const matchesCategory = selectedCategory === '전체' || review.category === selectedCategory;
      const matchesSearch =
        review.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.professor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSemester && matchesCategory && matchesSearch;
    })
    .sort((a, b) => (sortBy === 'latest' ? new Date(b.date).getTime() - new Date(a.date).getTime() : b.rating - a.rating));

  const handleSemesterClick = (data: any) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const semester = data.activePayload[0].payload.semester;
      setSelectedSemester(semester);
      setActiveTab('courses');
    }
  };

  const toggleKeyword = (keyword: string) => {
    setActiveKeywords((prev) => (prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword]));
  };

  return (
    <main className="min-h-screen bg-background">
      <div className="sticky top-16 z-40 bg-background border-b">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            <button onClick={() => setActiveTab('overview')} className={`py-4 px-2 whitespace-nowrap transition-colors relative ${activeTab === 'overview' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              학점·졸업현황
              {activeTab === 'overview' && (<><div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" /><Badge className="ml-2 bg-primary text-primary-foreground">현재</Badge></>)}
            </button>
            <button onClick={() => setActiveTab('courses')} className={`py-4 px-2 whitespace-nowrap transition-colors relative ${activeTab === 'courses' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              수업·강의평
              {activeTab === 'courses' && (<><div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" /><Badge className="ml-2 bg-primary text-primary-foreground">현재</Badge></>)}
            </button>
            <button onClick={() => setActiveTab('prefs')} className={`py-4 px-2 whitespace-nowrap transition-colors relative ${activeTab === 'prefs' ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>
              취향·설정
              {activeTab === 'prefs' && (<><div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" /><Badge className="ml-2 bg-primary text-primary-foreground">현재</Badge></>)}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-20 w-20 mb-4">
                    <AvatarFallback className="bg-primary text-primary-foreground">{user?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  <h3 className="mb-1">{user?.name || '학생'}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{user?.major || '컴퓨터과학과'}</p>
                  <Badge variant="outline">{user?.semester || 6}학기</Badge>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">현재 학기</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div><p className="text-xs text-muted-foreground mb-1">학기</p><p className="text-sm">2024-1학기</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">수강 학점</p><p className="text-sm">18학점</p></div>
                <div><p className="text-xs text-muted-foreground mb-1">이번 학기 평점</p><p className="text-sm">3.92 / 4.5</p></div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-3"><CardTitle className="text-sm">누적 학점</CardTitle></CardHeader>
              <CardContent>
                <div className="text-center mb-4"><div className="text-3xl text-primary mb-1">{academicData.gpa.current}</div><div className="text-xs text-muted-foreground">/ {academicData.gpa.max}</div></div>
                <Progress value={(academicData.gpa.current / academicData.gpa.max) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2 text-center">우수 성적 유지 중</p>
              </CardContent>
            </Card>
            <Card className="bg-amber-50 border-amber-200">
              <CardContent className="pt-6 space-y-3">
                <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" /><div><p className="text-sm mb-1">전공필수 6학점 부족</p><p className="text-xs text-muted-foreground">졸업 요건 확인이 필요합니다</p></div></div>
                <Button variant="outline" size="sm" className="w-full">다음 학기 추천과목 보기<ChevronRight className="h-3 w-3 ml-1" /></Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-9">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card><CardContent className="pt-6"><div className="flex items-center gap-3 mb-3"><div className="p-2 bg-primary/10 rounded-lg"><BookOpen className="h-5 w-5 text-primary" /></div><div><p className="text-xs text-muted-foreground">총 이수 학점</p><p className="text-xl">{academicData.totalCredits.current}/{academicData.totalCredits.required}</p></div></div><Progress value={(academicData.totalCredits.current / academicData.totalCredits.required) * 100} className="h-2" /><p className="text-xs text-muted-foreground mt-2">{((academicData.totalCredits.current / academicData.totalCredits.required) * 100).toFixed(0)}% 완료</p></CardContent></Card>
                  <Card><CardContent className="pt-6"><div className="flex items-center gap-3 mb-3"><div className="p-2 bg-primary/10 rounded-lg"><GraduationCap className="h-5 w-5 text-primary" /></div><div><p className="text-xs text-muted-foreground">전공 이수</p><p className="text-xl">{academicData.majorCredits.current}/{academicData.majorCredits.required}</p></div></div><Progress value={(academicData.majorCredits.current / academicData.majorCredits.required) * 100} className="h-2" /><p className="text-xs text-muted-foreground mt-2">{((academicData.majorCredits.current / academicData.majorCredits.required) * 100).toFixed(0)}% 완료</p></CardContent></Card>
                  <Card><CardContent className="pt-6"><div className="flex items-center gap-3 mb-3"><div className="p-2 bg-primary/10 rounded-lg"><Award className="h-5 w-5 text-primary" /></div><div><p className="text-xs text-muted-foreground">교양 이수</p><p className="text-xl">{academicData.generalCredits.current}/{academicData.generalCredits.required}</p></div></div><Progress value={(academicData.generalCredits.current / academicData.generalCredits.required) * 100} className="h-2" /><p className="text-xs text-muted-foreground mt-2">{((academicData.generalCredits.current / academicData.generalCredits.required) * 100).toFixed(0)}% 완료</p></CardContent></Card>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>요건별 이수 현황</CardTitle>
                      <CardDescription>각 영역별 충족률</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <RadarChart data={radarData}>
                          <PolarGrid />
                          <PolarAngleAxis dataKey="subject" />
                          <PolarRadiusAxis angle={90} domain={[0, 100]} />
                          <Radar name="충족률" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.6} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle>필수 과목 체크리스트</CardTitle>
                      <CardDescription>전공 필수 과목 이수 현황</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {requiredCourses.map((course) => (
                        <div key={course.id} className={`flex items-center justify-between p-3 rounded-lg ${course.completed ? 'bg-muted' : 'bg-primary/5 border border-primary/20'}`}>
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${course.completed ? 'bg-primary text-primary-foreground' : 'bg-background border-2 border-primary'}`}>
                              {course.completed && <Check className="h-3 w-3" />}
                            </div>
                            <span className={`text-sm ${course.completed ? 'text-muted-foreground' : ''}`}>{course.name}</span>
                          </div>
                          {course.completed && (<Badge variant="secondary" className="text-xs">완료</Badge>)}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>학기별 평균 평점</CardTitle>
                    <CardDescription>각 학기의 평균 학점 추이 (점을 클릭하면 해당 학기로 이동)</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={semesterData} onClick={handleSemesterClick}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="semester" />
                        <YAxis domain={[0, 4.5]} ticks={[0, 1, 2, 3, 4, 4.5]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="gpa" name="평균 평점" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: 'hsl(var(--primary))', r: 5, cursor: 'pointer' }} activeDot={{ r: 7, cursor: 'pointer' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="border-l-4 border-l-amber-500 bg-amber-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2"><AlertTriangle className="h-5 w-5 text-amber-600" /><h3 className="text-sm">전공필수 6학점 부족</h3></div>
                      <p className="text-xs text-muted-foreground">다음 학기에 반드시 이수해야 합니다</p>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-blue-500 bg-blue-50">
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2"><Sparkles className="h-5 w-5 text-blue-600" /><h3 className="text-sm">다음 학기 추천과목</h3></div>
                      <Button variant="link" className="text-xs p-0 h-auto">추천 강의 5개 보기 →</Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2>시간표 & 강의평</h2>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024-1">2024-1학기</SelectItem>
                      <SelectItem value="2023-2">2023-2학기</SelectItem>
                      <SelectItem value="2023-1">2023-1학기</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>주간 시간표</CardTitle>
                      <CardDescription>{selectedSemester}학기</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <div className="min-w-[500px]">
                          <div className="grid grid-cols-6 gap-1 mb-2">
                            <div className="text-xs text-center text-muted-foreground p-2"></div>
                            {days.map((day) => (
                              <div key={day} className="text-xs text-center p-2 bg-muted rounded">{day}</div>
                            ))}
                          </div>
                          <div className="relative">
                            <div className="grid grid-cols-6 gap-1">
                              <div className="space-y-1">
                                {timeSlots.map((hour) => (
                                  <div key={hour} className="h-[60px] text-xs text-muted-foreground flex items-start justify-center pt-1">{hour}:00</div>
                                ))}
                              </div>
                              {days.map((day, dayIndex) => (
                                <div key={day} className="relative space-y-1">
                                  {timeSlots.map((hour) => (
                                    <div key={hour} className="h-[60px] border border-muted rounded" />
                                  ))}
                                  {timetableData
                                    .filter((course) => course.day === dayIndex)
                                    .map((course) => (
                                      <div
                                        key={course.id}
                                        className={`absolute left-0 right-0 ${course.color} text-white text-xs p-2 rounded shadow-sm`}
                                        style={{
                                          top: `${(course.startTime - 8) * 60 + (course.startTime - 8) * 4}px`,
                                          height: `${course.duration * 60 + (course.duration - 1) * 4}px`,
                                        }}
                                      >
                                        <div className="line-clamp-1">{course.name}</div>
                                        <div className="text-[10px] opacity-90 line-clamp-1">{course.professor}</div>
                                      </div>
                                    ))}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>수강 과목 목록</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {timetableData.map((course) => (
                          <div key={course.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                            <div>
                              <p className="text-sm">{course.name}</p>
                              <p className="text-xs text-muted-foreground">{course.professor}</p>
                            </div>
                            <div className="flex items-center gap-2"><Badge variant="outline">3학점</Badge><div className="flex items-center gap-1"><Star className="h-3 w-3 text-yellow-500 fill-yellow-500" /><span className="text-xs">4.5</span></div></div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between"><CardTitle>내 강의평</CardTitle><Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" />작성하기</Button></div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {filteredReviews.slice(0, 3).map((review) => (
                          <div key={review.id} className="p-3 border rounded-lg">
                            <div className="flex items-start justify-between mb-2">
                              <div><p className="text-sm">{review.courseName}</p><p className="text-xs text-muted-foreground">{review.professor}</p></div>
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-muted'}`} />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-muted-foreground italic mb-2">"{review.review}"</p>
                            <div className="flex flex-wrap gap-1">
                              {review.keywords.map((keyword) => (
                                <Badge key={keyword} variant="secondary" className="text-[10px] px-2 py-0">{keyword}</Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'prefs' && (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="h-5 w-5" />선호 키워드</CardTitle>
                    <CardDescription>원하는 강의 스타일을 선택하세요. 상위 5개가 강의 추천에 반영됩니다.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {['토론','PPT강의','팀프로젝트','시험적음','과제많음','실습위주','이론중심','온라인수업','난이도쉬움','코딩실습','발표','리포트'].map((keyword) => {
                        const isActive = activeKeywords.includes(keyword);
                        const isPriority = isActive && activeKeywords.indexOf(keyword) < 5;
                        return (
                          <button key={keyword} onClick={() => toggleKeyword(keyword)} className={`px-4 py-2 rounded-full text-sm transition-all ${isPriority ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary/20' : isActive ? 'bg-primary/20 text-primary' : 'bg-muted hover:bg-muted/80'}`}>
                            {keyword}
                            {isPriority && (<span className="ml-1 text-xs opacity-75">★</span>)}
                          </button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Settings className="h-5 w-5" />표시 설정</CardTitle>
                    <CardDescription>시간표 및 UI 표시 방식을 설정하세요</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between"><div><p className="text-sm mb-1">시간표 단위</p><p className="text-xs text-muted-foreground">시간 간격 설정</p></div><Select value={displaySettings.timeUnit} onValueChange={(value) => setDisplaySettings({ ...displaySettings, timeUnit: value })}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="30">30분</SelectItem><SelectItem value="60">60분</SelectItem></SelectContent></Select></div>
                    <Separator />
                    <div className="flex items-center justify-between"><div><p className="text-sm mb-1">주 시작 요일</p><p className="text-xs text-muted-foreground">달력 표시 기준</p></div><Select value={displaySettings.weekStart} onValueChange={(value) => setDisplaySettings({ ...displaySettings, weekStart: value })}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="월">월요일</SelectItem><SelectItem value="일">일요일</SelectItem></SelectContent></Select></div>
                    <Separator />
                    <div className="flex items-center justify-between"><div><p className="text-sm mb-1">테마</p><p className="text-xs text-muted-foreground">화면 표시 모드</p></div><Select value={displaySettings.theme} onValueChange={(value) => setDisplaySettings({ ...displaySettings, theme: value })}><SelectTrigger className="w-32"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="밝음">밝음</SelectItem><SelectItem value="어두움">어두움</SelectItem><SelectItem value="시스템">시스템</SelectItem></SelectContent></Select></div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />데이터 관리</CardTitle>
                    <CardDescription>학사 데이터를 가져오거나 내보내기</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-3"><Button variant="outline" className="flex-1"><Upload className="h-4 w-4 mr-2" />JSON 가져오기</Button><Button variant="outline" className="flex-1"><Download className="h-4 w-4 mr-2" />JSON 내보내기</Button></div>
                    <div className="flex gap-3"><Button variant="outline" className="flex-1"><Upload className="h-4 w-4 mr-2" />ICS 가져오기</Button><Button variant="outline" className="flex-1"><Download className="h-4 w-4 mr-2" />ICS 내보내기</Button></div>
                    <div className="mt-4 p-3 bg-muted rounded-lg"><p className="text-xs text-muted-foreground">최근 내보내기: 2025-11-03</p></div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
