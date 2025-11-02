import React, { useState } from 'react';
import { User, BookOpen, Settings, BarChart3, Calendar, Star, Edit, Save, X, MessageSquare, Check, AlertTriangle, Search, Filter, TrendingUp, Award, GraduationCap, FileText, Plus, Bell, Sparkles, Target } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';

interface MyPageProps {
  user: any;
}

export function MyPage({ user }: MyPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [selectedSemester, setSelectedSemester] = useState('전체');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('latest');
  const [activeKeywords, setActiveKeywords] = useState(['#토론형수업', '#PPT강의', '#팀프로젝트']);
  const [recommendations, setRecommendations] = useState({
    credits: true,
    keywords: true
  });
  const [notifications, setNotifications] = useState({
    reviews: true,
    requirements: true,
    recommendations: false
  });

  // Academic data
  const academicData = {
    totalCredits: { current: 105, required: 130 },
    majorCredits: { current: 72, required: 80 },
    gpa: { current: 3.85, max: 4.5 },
    creditsByCategory: {
      major: 72,
      general: 24,
      elective: 9
    }
  };

  // Graduation requirements
  const graduationRequirements = [
    { id: 1, title: '전공필수 완료', status: 'completed', icon: '✅' },
    { id: 2, title: '교양필수 완료', status: 'completed', icon: '✅' },
    { id: 3, title: '캡스톤 프로젝트 수강 중', status: 'in-progress', icon: '⚠️' },
    { id: 4, title: '졸업논문 제출', status: 'pending', icon: '❌' },
    { id: 5, title: '영어인증 제출', status: 'completed', icon: '✅' }
  ];

  // Course reviews data
  const courseReviews = [
    {
      id: 1,
      courseName: '자료구조',
      professor: '김교수',
      rating: 4.5,
      semester: '2024-1',
      category: '전공',
      review: '프로젝트가 많지만 배울 점이 많아요.',
      date: '2024-06-15'
    },
    {
      id: 2,
      courseName: '운영체제',
      professor: '이교수',
      rating: 4.3,
      semester: '2024-1',
      category: '전공',
      review: '이론 설명이 명확하고 실습도 충실해요.',
      date: '2024-06-10'
    },
    {
      id: 3,
      courseName: '영어회화',
      professor: 'Smith',
      rating: 4.8,
      semester: '2023-2',
      category: '교양',
      review: '원어민 교수님과의 수업이 정말 도움이 되었습니다!',
      date: '2024-01-20'
    },
    {
      id: 4,
      courseName: '컴퓨터네트워크',
      professor: '박교수',
      rating: 4.0,
      semester: '2023-2',
      category: '전공',
      review: '내용이 어렵지만 교수님이 친절하게 설명해주세요.',
      date: '2024-01-18'
    },
    {
      id: 5,
      courseName: '데이터베이스',
      professor: '최교수',
      rating: 4.6,
      semester: '2023-1',
      category: '전공',
      review: '실습 위주로 진행되어 실무에 도움이 많이 됩니다.',
      date: '2023-07-05'
    },
    {
      id: 6,
      courseName: '일반물리학',
      professor: '조교수',
      rating: 3.8,
      semester: '2023-1',
      category: '교양',
      review: '실험 수업이 흥미로웠습니다.',
      date: '2023-07-01'
    }
  ];

  // Available keywords
  const availableKeywords = [
    '#토론형수업', '#PPT강의', '#팀프로젝트', '#시험적음', 
    '#과제많음', '#실습위주', '#이론중심', '#온라인수업'
  ];

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const toggleKeyword = (keyword: string) => {
    if (activeKeywords.includes(keyword)) {
      setActiveKeywords(activeKeywords.filter(k => k !== keyword));
    } else {
      setActiveKeywords([...activeKeywords, keyword]);
    }
  };

  // Filter reviews
  const filteredReviews = courseReviews.filter(review => {
    const matchesSemester = selectedSemester === '전체' || review.semester === selectedSemester;
    const matchesCategory = selectedCategory === '전체' || review.category === selectedCategory;
    const matchesSearch = review.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         review.professor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSemester && matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'latest') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else {
      return b.rating - a.rating;
    }
  });

  return (
    <main className="container mx-auto px-4 py-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="mb-2">마이페이지</h1>
        <p className="text-muted-foreground">내 정보와 수강 현황을 관리하세요</p>
      </div>

      {/* Profile Header */}
      <Card className="mb-6 shadow-sm border-0 bg-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-blue-50">
              <AvatarFallback className="text-2xl bg-blue-100 text-blue-700">
                {user?.name?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 text-center md:text-left">
              {isEditing ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">이름</Label>
                      <Input
                        id="name"
                        value={editedUser?.name || ''}
                        onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="studentId">학번</Label>
                      <Input
                        id="studentId"
                        value={editedUser?.studentId || ''}
                        onChange={(e) => setEditedUser({...editedUser, studentId: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                      <Save className="h-4 w-4 mr-1" />
                      저장
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleCancel}>
                      <X className="h-4 w-4 mr-1" />
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                    <h2>{user?.name || '학생'}</h2>
                    <Button size="sm" variant="ghost" onClick={() => setIsEditing(true)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-muted-foreground">
                    <p>{user?.major || '컴퓨터과학과'} • {user?.semester || 6}학기</p>
                    <p>학번: {user?.studentId || '2021123456'}</p>
                    <p>이메일: {user?.email || 'student@university.ac.kr'}</p>
                  </div>
                </>
              )}
            </div>
            
            <div className="text-center px-6 py-4 bg-blue-50 rounded-2xl">
              <div className="text-4xl mb-1 text-blue-700">{academicData.gpa.current}</div>
              <div className="text-sm text-blue-600">누적 평점</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="credits" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 p-1 rounded-xl">
          <TabsTrigger value="credits" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            학점·졸업현황
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            수업·강의평
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm">
            취향·설정
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Credits & Graduation Status */}
        <TabsContent value="credits" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <BookOpen className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">총 이수 학점</p>
                    <h3 className="text-blue-700">{academicData.totalCredits.current}/{academicData.totalCredits.required}</h3>
                  </div>
                </div>
                <Progress 
                  value={(academicData.totalCredits.current / academicData.totalCredits.required) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  졸업까지 {academicData.totalCredits.required - academicData.totalCredits.current}학점 남음
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <GraduationCap className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">전공 이수 학점</p>
                    <h3 className="text-blue-700">{academicData.majorCredits.current}/{academicData.majorCredits.required}</h3>
                  </div>
                </div>
                <Progress 
                  value={(academicData.majorCredits.current / academicData.majorCredits.required) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {academicData.majorCredits.required - academicData.majorCredits.current}학점 남음
                </p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-0 bg-white rounded-2xl overflow-hidden">
              <CardContent className="pt-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Award className="h-6 w-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">누적 GPA</p>
                    <h3 className="text-blue-700">{academicData.gpa.current}/{academicData.gpa.max}</h3>
                  </div>
                </div>
                <Progress 
                  value={(academicData.gpa.current / academicData.gpa.max) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  우수 성적 유지 중
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Chart Section */}
          <Card className="shadow-sm border-0 bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-700" />
                이수 현황 차트
              </CardTitle>
              <CardDescription>학점 분류별 이수 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bar Chart Visualization */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-700 rounded"></div>
                        <span className="text-sm">전공</span>
                      </div>
                      <span className="text-sm">{academicData.creditsByCategory.major}학점</span>
                    </div>
                    <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-blue-700 rounded-lg transition-all"
                        style={{ width: `${(academicData.creditsByCategory.major / academicData.totalCredits.current) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span className="text-sm">교양</span>
                      </div>
                      <span className="text-sm">{academicData.creditsByCategory.general}학점</span>
                    </div>
                    <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-blue-500 rounded-lg transition-all"
                        style={{ width: `${(academicData.creditsByCategory.general / academicData.totalCredits.current) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-300 rounded"></div>
                        <span className="text-sm">일반선택</span>
                      </div>
                      <span className="text-sm">{academicData.creditsByCategory.elective}학점</span>
                    </div>
                    <div className="relative h-8 bg-gray-100 rounded-lg overflow-hidden">
                      <div 
                        className="absolute inset-y-0 left-0 bg-blue-300 rounded-lg transition-all"
                        style={{ width: `${(academicData.creditsByCategory.elective / academicData.totalCredits.current) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Donut Chart Representation */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-48 h-48">
                    <svg viewBox="0 0 200 200" className="transform -rotate-90">
                      {/* Background circle */}
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#f3f4f6" strokeWidth="40" />
                      
                      {/* Major (전공) - 68.6% */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="80" 
                        fill="none" 
                        stroke="#1e3a8a" 
                        strokeWidth="40"
                        strokeDasharray={`${(academicData.creditsByCategory.major / academicData.totalCredits.current) * 502.4} 502.4`}
                      />
                      
                      {/* General (교양) */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="80" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="40"
                        strokeDasharray={`${(academicData.creditsByCategory.general / academicData.totalCredits.current) * 502.4} 502.4`}
                        strokeDashoffset={`-${(academicData.creditsByCategory.major / academicData.totalCredits.current) * 502.4}`}
                      />
                      
                      {/* Elective (일반선택) */}
                      <circle 
                        cx="100" 
                        cy="100" 
                        r="80" 
                        fill="none" 
                        stroke="#93c5fd" 
                        strokeWidth="40"
                        strokeDasharray={`${(academicData.creditsByCategory.elective / academicData.totalCredits.current) * 502.4} 502.4`}
                        strokeDashoffset={`-${((academicData.creditsByCategory.major + academicData.creditsByCategory.general) / academicData.totalCredits.current) * 502.4}`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl text-blue-700">{academicData.totalCredits.current}</div>
                        <div className="text-xs text-muted-foreground">총 학점</div>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4 text-center">
                    전공 중심의 균형잡힌 학점 분포
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graduation Requirements Checklist */}
          <Card className="shadow-sm border-0 bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Check className="h-5 w-5 text-blue-700" />
                졸업요건 체크리스트
              </CardTitle>
              <CardDescription>졸업을 위한 필수 요건 달성 현황</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {graduationRequirements.map((req, index) => (
                  <div 
                    key={req.id}
                    className={`flex items-center justify-between p-4 rounded-xl border-l-4 ${
                      req.status === 'completed' 
                        ? 'bg-green-50 border-green-500' 
                        : req.status === 'in-progress'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-gray-50 border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{req.icon}</span>
                      <span className="text-sm">{req.title}</span>
                    </div>
                    <Badge 
                      variant="outline"
                      className={
                        req.status === 'completed'
                          ? 'bg-green-100 text-green-700 border-green-200'
                          : req.status === 'in-progress'
                          ? 'bg-yellow-100 text-yellow-700 border-yellow-200'
                          : 'bg-gray-100 text-gray-600 border-gray-200'
                      }
                    >
                      {req.status === 'completed' ? '완료' : req.status === 'in-progress' ? '진행중' : '미완료'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 2: Course Reviews */}
        <TabsContent value="reviews" className="space-y-6">
          {/* Search & Filter Bar */}
          <Card className="shadow-sm border-0 bg-gray-50 rounded-2xl">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="강의명 또는 교수명 검색"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white"
                  />
                </div>
                
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger className="w-full md:w-40 bg-white">
                    <SelectValue placeholder="학기" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체 학기</SelectItem>
                    <SelectItem value="2024-1">2024-1</SelectItem>
                    <SelectItem value="2023-2">2023-2</SelectItem>
                    <SelectItem value="2023-1">2023-1</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full md:w-32 bg-white">
                    <SelectValue placeholder="분류" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="전체">전체</SelectItem>
                    <SelectItem value="전공">전공</SelectItem>
                    <SelectItem value="교양">교양</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex gap-2">
                  <Button
                    variant={sortBy === 'latest' ? 'default' : 'outline'}
                    onClick={() => setSortBy('latest')}
                    className={sortBy === 'latest' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    최신순
                  </Button>
                  <Button
                    variant={sortBy === 'rating' ? 'default' : 'outline'}
                    onClick={() => setSortBy('rating')}
                    className={sortBy === 'rating' ? 'bg-blue-600 hover:bg-blue-700' : ''}
                  >
                    평점순
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Cards Grid */}
          {filteredReviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredReviews.map((review) => (
                <Card 
                  key={review.id} 
                  className="shadow-sm border-0 bg-white rounded-2xl hover:shadow-md transition-shadow"
                >
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* Header */}
                      <div>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="line-clamp-1">{review.courseName}</h3>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            {review.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{review.professor}</p>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating
                                  ? 'text-yellow-500 fill-yellow-500'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm">{review.rating}/5</span>
                      </div>

                      {/* Review Text */}
                      <p className="text-sm text-muted-foreground italic">
                        "{review.review}"
                      </p>

                      {/* Semester Badge */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {review.semester}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          수정
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50">
                          삭제
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            /* Empty State */
            <Card className="shadow-sm border-0 bg-white rounded-2xl">
              <CardContent className="pt-12 pb-12">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="h-12 w-12 text-blue-300" />
                  </div>
                  <h3 className="mb-2">아직 작성한 강의평이 없습니다</h3>
                  <p className="text-muted-foreground mb-6">
                    수강한 강의에 대한 평가를 작성해보세요
                  </p>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="h-4 w-4 mr-2" />
                    강의평 쓰러가기
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Tab 3: Preferences & Settings */}
        <TabsContent value="preferences" className="space-y-6">
          {/* Section 1: Preferred Keywords */}
          <Card className="shadow-sm border-0 bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-700" />
                나의 학습 취향
              </CardTitle>
              <CardDescription>선호하는 강의 스타일을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {availableKeywords.map((keyword) => (
                  <button
                    key={keyword}
                    onClick={() => toggleKeyword(keyword)}
                    className={`px-4 py-2 rounded-full text-sm transition-all ${
                      activeKeywords.includes(keyword)
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300'
                    }`}
                  >
                    {keyword}
                  </button>
                ))}
                <button className="px-4 py-2 rounded-full text-sm bg-white border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors">
                  <Plus className="h-4 w-4 inline mr-1" />
                  키워드 추가
                </button>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Lecture Recommendation Settings */}
          <Card className="shadow-sm border-0 bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-700" />
                강의 추천 설정
              </CardTitle>
              <CardDescription>맞춤형 강의 추천 기능을 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="text-sm mb-1">부족 학점 기반 추천 활성화</div>
                  <div className="text-xs text-muted-foreground">
                    졸업에 필요한 학점을 고려하여 강의를 추천합니다
                  </div>
                </div>
                <Switch
                  checked={recommendations.credits}
                  onCheckedChange={(checked) => setRecommendations({...recommendations, credits: checked})}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="text-sm mb-1">내 선호 키워드 기반 추천 활성화</div>
                  <div className="text-xs text-muted-foreground">
                    설정한 학습 취향을 반영하여 강의를 추천합니다
                  </div>
                </div>
                <Switch
                  checked={recommendations.keywords}
                  onCheckedChange={(checked) => setRecommendations({...recommendations, keywords: checked})}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Notification Settings */}
          <Card className="shadow-sm border-0 bg-white rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-700" />
                알림 설정
              </CardTitle>
              <CardDescription>받고 싶은 알림을 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="text-sm mb-1">새 강의평 등록 시 알림</div>
                  <div className="text-xs text-muted-foreground">
                    다른 학생들의 새로운 강의평이 등록되면 알려드립니다
                  </div>
                </div>
                <Switch
                  checked={notifications.reviews}
                  onCheckedChange={(checked) => setNotifications({...notifications, reviews: checked})}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="text-sm mb-1">졸업요건 변경 시 알림</div>
                  <div className="text-xs text-muted-foreground">
                    학과 졸업요건이 변경되면 즉시 알려드립니다
                  </div>
                </div>
                <Switch
                  checked={notifications.requirements}
                  onCheckedChange={(checked) => setNotifications({...notifications, requirements: checked})}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex-1">
                  <div className="text-sm mb-1">추천 강의 업데이트 알림</div>
                  <div className="text-xs text-muted-foreground">
                    새로운 맞춤 강의가 추천되면 알려드립니다
                  </div>
                </div>
                <Switch
                  checked={notifications.recommendations}
                  onCheckedChange={(checked) => setNotifications({...notifications, recommendations: checked})}
                  className="data-[state=checked]:bg-blue-600"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
}
