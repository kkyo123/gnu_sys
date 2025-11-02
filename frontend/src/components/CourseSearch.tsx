import React, { useState } from 'react';
import { Search, Filter, Clock, MapPin, User, Star, BookOpen, Users, FileText, Award, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';

interface CourseSearchProps {}

export function CourseSearch({}: CourseSearchProps = {}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDay, setSelectedDay] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    balancedGeneral: false,
    basicGeneral: false,
    coreGeneral: false,
    teacherTraining: false,
    generalElective: false,
    majorRequired: false,
    majorElective: false,
  });
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const departments = [
    '전체', '컴퓨터과학과', '전자공학과', '기계공학과', '화학공학과', 
    '경영학과', '경제학과', '심리학과', '영어영문학과', '수학과'
  ];

  const days = ['전체', '월', '화', '수', '목', '금'];
  const times = ['전체', '1교시(09:00-10:30)', '2교시(10:30-12:00)', '3교시(13:00-14:30)', '4교시(14:30-16:00)', '5교시(16:00-17:30)'];

  const courses = [
    {
      id: 1,
      name: '자료구조',
      professor: '김교수',
      department: '컴퓨터과학과',
      credits: 3,
      time: '화목 10:30-12:00',
      location: '공학관 305',
      capacity: 40,
      enrolled: 35,
      rating: 4.2,
      type: '전공필수',
      description: '기본적인 자료구조와 알고리즘을 학습합니다.'
    },
    {
      id: 2,
      name: '컴퓨터과학개론',
      professor: '이교수',
      department: '컴퓨터과학과',
      credits: 3,
      time: '월수 9:00-10:30',
      location: '공학관 201',
      capacity: 50,
      enrolled: 45,
      rating: 4.5,
      type: '전공기초',
      description: '컴퓨터과학의 전반적인 개념을 소개합니다.'
    },
    {
      id: 3,
      name: '선형대수학',
      professor: '박교수',
      department: '수학과',
      credits: 3,
      time: '화목 14:00-15:30',
      location: '수학관 102',
      capacity: 30,
      enrolled: 28,
      rating: 3.8,
      type: '교양필수',
      description: '벡터와 행렬의 기본 개념을 학습합니다.'
    },
    {
      id: 4,
      name: '영어회화',
      professor: 'Smith',
      department: '영어영문학과',
      credits: 2,
      time: '월수금 15:00-16:00',
      location: '인문관 203',
      capacity: 25,
      enrolled: 20,
      rating: 4.7,
      type: '교양선택',
      description: '실용적인 영어 회화를 연습합니다.'
    },
    {
      id: 5,
      name: '데이터베이스',
      professor: '정교수',
      department: '컴퓨터과학과',
      credits: 3,
      time: '화목 16:00-17:30',
      location: '공학관 401',
      capacity: 35,
      enrolled: 30,
      rating: 4.1,
      type: '전공선택',
      description: '데이터베이스 설계와 관리를 학습합니다.'
    }
  ];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.professor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !selectedDepartment || selectedDepartment === '전체' || course.department === selectedDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  const handleFilterChange = (filter: string, checked: boolean) => {
    setSelectedFilters(prev => ({ ...prev, [filter]: checked }));
  };

  const handleCourseDetail = (course: any) => {
    setSelectedCourse(course);
    setIsDetailOpen(true);
  };

  const getCourseDetails = (course: any) => {
    const keywordMap: { [key: number]: string[] } = {
      1: ['알고리즘', '프로그래밍', '코딩', '문제해결', '데이터처리', '복잡도분석'],
      2: ['입문', '기초', '프로그래밍', '컴퓨팅사고', '소프트웨어', '하드웨어'],
      3: ['수학', '행렬', '벡터', '수치해석', '선형변환', '고유값'],
      4: ['영어', '회화', '커뮤니케이션', '실용영어', '스피킹', '리스닝'],
      5: ['SQL', '데이터관리', '백엔드', 'DBMS', '데이터모델링', '쿼리최적화']
    };

    return {
      ...course,
      prerequisites: course.id === 1 ? ['프로그래밍기초'] : course.id === 5 ? ['자료구조'] : [],
      keywords: keywordMap[course.id] || ['기초', '학습', '이론', '실습'],
      assessmentMethod: {
        midterm: 30,
        final: 30,
        assignment: 25,
        attendance: 15
      },
      syllabus: `${course.name}의 강의계획서입니다.`,
      reviews: Math.floor(Math.random() * 50) + 20,
      difficulty: course.rating > 4.5 ? '쉬움' : course.rating > 4.0 ? '보통' : '어려움'
    };
  };

  return (
    <main className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <h1>강의 검색</h1>
        <p className="text-muted-foreground mt-2">키워드와 필터로 원하는 강의를 찾아보세요</p>
      </div>
        {/* Search Section */}
        <div className="space-y-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="강의명, 교수명으로 검색하세요"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="h-4 w-4 mr-2" />
              필터
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label>학과</Label>
                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                      <SelectTrigger>
                        <SelectValue placeholder="학과 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>요일</Label>
                    <Select value={selectedDay} onValueChange={setSelectedDay}>
                      <SelectTrigger>
                        <SelectValue placeholder="요일 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {days.map((day) => (
                          <SelectItem key={day} value={day}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>시간</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="시간 선택" />
                      </SelectTrigger>
                      <SelectContent>
                        {times.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="mt-6">
                  <Label className="mb-3 block">강의 유형</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    {Object.entries(selectedFilters).map(([key, checked]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox
                          id={key}
                          checked={checked}
                          onCheckedChange={(checked) => handleFilterChange(key, checked as boolean)}
                        />
                        <Label htmlFor={key} className="text-sm">
                          {key === 'balancedGeneral' && '균형교양'}
                          {key === 'basicGeneral' && '기초교양'}
                          {key === 'coreGeneral' && '핵심교양'}
                          {key === 'teacherTraining' && '교직'}
                          {key === 'generalElective' && '일반선택'}
                          {key === 'majorRequired' && '전공필수'}
                          {key === 'majorElective' && '전공선택'}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Results */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground">
              총 {filteredCourses.length}개의 강의를 찾았습니다
            </p>
            <Select defaultValue="rating">
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">평점순</SelectItem>
                <SelectItem value="name">이름순</SelectItem>
                <SelectItem value="professor">교수순</SelectItem>
                <SelectItem value="capacity">여석순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4">
            {filteredCourses.map((course) => (
              <Card key={course.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3>{course.name}</h3>
                        <Badge variant="secondary">{course.type}</Badge>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm">{course.rating}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground text-sm mb-3">
                        {course.description}
                      </p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span>{course.professor} • {course.credits}학점</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{course.time}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{course.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end space-y-2">
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleCourseDetail(course)}>
                          상세보기
                        </Button>
                        <Button size="sm">
                          찜하기
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Course Detail Dialog */}
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            {selectedCourse && (() => {
              const details = getCourseDetails(selectedCourse);
              return (
                <>
                  <DialogHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <DialogTitle className="text-2xl mb-2">{selectedCourse.name}</DialogTitle>
                        <DialogDescription className="flex items-center space-x-2">
                          <Badge variant="secondary">{selectedCourse.type}</Badge>
                          <span>•</span>
                          <span>{selectedCourse.department}</span>
                        </DialogDescription>
                      </div>
                    </div>
                  </DialogHeader>

                  <div className="space-y-6 mt-4">
                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <User className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">교수명</p>
                            <p>{selectedCourse.professor}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">학점</p>
                            <p>{selectedCourse.credits}학점</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="h-5 w-5 text-yellow-500 fill-current" />
                          <div>
                            <p className="text-sm text-muted-foreground">평점</p>
                            <p>{selectedCourse.rating} ({details.reviews}개의 리뷰)</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Clock className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">강의 시간</p>
                            <p>{selectedCourse.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">강의실</p>
                            <p>{selectedCourse.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm text-muted-foreground">수강 정원</p>
                            <p>{selectedCourse.enrolled}/{selectedCourse.capacity}명</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Description */}
                    <div>
                      <h4 className="flex items-center space-x-2 mb-2">
                        <FileText className="h-4 w-4" />
                        <span>강의 소개</span>
                      </h4>
                      <p className="text-muted-foreground">{selectedCourse.description}</p>
                    </div>

                    <Separator />

                    {/* Keywords */}
                    <div>
                      <h4 className="mb-3">연관 키워드</h4>
                      <div className="flex flex-wrap gap-2">
                        {details.keywords.map((keyword: string) => (
                          <Badge key={keyword} variant="secondary" className="px-3 py-1">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Separator />

                    {/* Prerequisites */}
                    {details.prerequisites.length > 0 && (
                      <div>
                        <h4 className="mb-2">선수과목</h4>
                        <div className="flex flex-wrap gap-2">
                          {details.prerequisites.map((prereq: string) => (
                            <Badge key={prereq} variant="outline">{prereq}</Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assessment Method */}
                    <div>
                      <h4 className="flex items-center space-x-2 mb-3">
                        <Award className="h-4 w-4" />
                        <span>평가 방식</span>
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="text-sm">중간고사</span>
                          <span>{details.assessmentMethod.midterm}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="text-sm">기말고사</span>
                          <span>{details.assessmentMethod.final}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="text-sm">과제</span>
                          <span>{details.assessmentMethod.assignment}%</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted rounded-lg">
                          <span className="text-sm">출석</span>
                          <span>{details.assessmentMethod.attendance}%</span>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    {/* Additional Info */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">난이도</p>
                        <Badge variant={details.difficulty === '쉬움' ? 'secondary' : details.difficulty === '보통' ? 'outline' : 'destructive'}>
                          {details.difficulty}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">수강 가능 여부</p>
                        <Badge variant={selectedCourse.enrolled < selectedCourse.capacity ? 'default' : 'destructive'}>
                          {selectedCourse.enrolled < selectedCourse.capacity ? '수강 가능' : '정원 마감'}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-4">
                      <Button className="flex-1" disabled={selectedCourse.enrolled >= selectedCourse.capacity}>
                        수강신청
                      </Button>
                      <Button variant="outline" className="flex-1">
                        강의계획서 보기
                      </Button>
                    </div>
                  </div>
                </>
              );
            })()}
          </DialogContent>
        </Dialog>
    </main>
  );
}