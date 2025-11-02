import React, { useState } from 'react';
import { Search, X, Filter, Star, ChevronRight, TrendingUp, MessageCircle, FileCheck, Sparkles, BookOpen, Users, FileText, Award, Clock, MapPin, User, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Separator } from './ui/separator';
import { motion, AnimatePresence } from 'motion/react';

interface CourseRecommendationProps {}

export function CourseRecommendation({}: CourseRecommendationProps = {}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [tempSelectedKeywords, setTempSelectedKeywords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // 모든 키워드 목록
  const allKeywords = [
    'PPT강의', '토론', '조별활동', '시험없음', '난이도쉬움',
    '코딩실습', '이론중심', '실험', '발표', '리포트',
    '프로젝트', '출석중요', '객관식', '주관식', '온라인강의',
    '오프라인강의', '개인과제', '팀과제', '질문중심', '사례중심',
    'HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Python',
    'SQL', '과제많음', '영상강의', '참여형', '난이도높음',
    '시사중심', 'ReactNative', '실습많음', '비주얼중심', '코딩',
    '네트워크', '암호화', '시험중심'
  ];

  // 큐레이션 섹션 데이터
  const curatedSections = [
    {
      id: 'trending',
      title: '🔥 이번 주 인기 강의',
      color: 'text-orange-600',
      courses: [
        {
          id: 7,
          name: '글쓰기와 표현',
          professor: '조혜진',
          department: '교양',
          rating: 4.9,
          students: 305,
          tags: ['리포트', '참여형', 'PPT강의'],
          thumbnail: '✍️',
          color: 'bg-blue-100 dark:bg-blue-950',
          reviewCount: 305
        },
        {
          id: 20,
          name: '프론트엔드 개발 실습',
          professor: '최나윤',
          department: '전공',
          rating: 4.9,
          students: 201,
          tags: ['React', 'TypeScript', '프로젝트'],
          thumbnail: '💻',
          color: 'bg-purple-100 dark:bg-purple-950',
          reviewCount: 201
        },
        {
          id: 15,
          name: '언어와 인간',
          professor: '정가은',
          department: '교양',
          rating: 4.9,
          students: 276,
          tags: ['토론', '참여형', 'PPT강의'],
          thumbnail: '💬',
          color: 'bg-green-100 dark:bg-green-950',
          reviewCount: 276
        },
        {
          id: 8,
          name: '인공지능개론',
          professor: '박찬우',
          department: '전공',
          rating: 4.5,
          students: 188,
          tags: ['Python', '프로젝트', '난이도높음'],
          thumbnail: '🤖',
          color: 'bg-orange-100 dark:bg-orange-950',
          reviewCount: 188
        },
        {
          id: 16,
          name: '모바일 앱 개발',
          professor: '홍기훈',
          department: '전공',
          rating: 4.8,
          students: 154,
          tags: ['ReactNative', '프로젝트', '실습많음'],
          thumbnail: '📱',
          color: 'bg-pink-100 dark:bg-pink-950',
          reviewCount: 154
        }
      ]
    },
    {
      id: 'presentation',
      title: '🧠 PPT 발표가 쉬워지는 강의',
      color: 'text-blue-600',
      courses: [
        {
          id: 1,
          name: '창의적 사고와 문제해결',
          professor: '김지훈',
          department: '교양',
          rating: 4.7,
          students: 124,
          tags: ['토론', '조별활동', 'PPT강의'],
          thumbnail: '💡',
          color: 'bg-pink-100 dark:bg-pink-950',
          reviewCount: 124
        },
        {
          id: 12,
          name: '컴퓨터그래픽스',
          professor: '오지훈',
          department: '전공',
          rating: 4.7,
          students: 133,
          tags: ['프로젝트', 'PPT강의', '비주얼중심'],
          thumbnail: '🎨',
          color: 'bg-teal-100 dark:bg-teal-950',
          reviewCount: 133
        },
        {
          id: 7,
          name: '글쓰기와 표현',
          professor: '조혜진',
          department: '교양',
          rating: 4.9,
          students: 305,
          tags: ['리포트', '참여형', 'PPT강의'],
          thumbnail: '✍️',
          color: 'bg-yellow-100 dark:bg-yellow-950',
          reviewCount: 305
        },
        {
          id: 15,
          name: '언어와 인간',
          professor: '정가은',
          department: '교양',
          rating: 4.9,
          students: 276,
          tags: ['토론', '참여형', 'PPT강의'],
          thumbnail: '💬',
          color: 'bg-indigo-100 dark:bg-indigo-950',
          reviewCount: 276
        }
      ]
    },
    {
      id: 'discussion',
      title: '💬 토론이 많은 수업',
      color: 'text-purple-600',
      courses: [
        {
          id: 11,
          name: '철학의 이해',
          professor: '김영민',
          department: '교양',
          rating: 4.6,
          students: 190,
          tags: ['토론', '참여형', '리포트'],
          thumbnail: '🤔',
          color: 'bg-indigo-100 dark:bg-indigo-950',
          reviewCount: 190
        },
        {
          id: 5,
          name: '미디어와 사회',
          professor: '윤하영',
          department: '교양',
          rating: 4.6,
          students: 98,
          tags: ['토론', '리포트', '참여형'],
          thumbnail: '📺',
          color: 'bg-red-100 dark:bg-red-950',
          reviewCount: 98
        },
        {
          id: 19,
          name: '현대사회와 윤리',
          professor: '윤성호',
          department: '교양',
          rating: 4.4,
          students: 120,
          tags: ['토론', '시사중심', '리포트'],
          thumbnail: '⚖️',
          color: 'bg-cyan-100 dark:bg-cyan-950',
          reviewCount: 120
        },
        {
          id: 13,
          name: '글로벌 경제의 이해',
          professor: '박서연',
          department: '교양',
          rating: 4.5,
          students: 115,
          tags: ['시사중심', '리포트', '토론'],
          thumbnail: '🌍',
          color: 'bg-emerald-100 dark:bg-emerald-950',
          reviewCount: 115
        }
      ]
    },
    {
      id: 'easy-exam',
      title: '🎯 시험 부담 적은 강의',
      color: 'text-green-600',
      courses: [
        {
          id: 3,
          name: '심리학의 이해',
          professor: '박진수',
          department: '교양',
          rating: 4.8,
          students: 211,
          tags: ['시험없음', '토론', '영상강의'],
          thumbnail: '🧠',
          color: 'bg-rose-100 dark:bg-rose-950',
          reviewCount: 211
        },
        {
          id: 9,
          name: '문화와 예술',
          professor: '이은정',
          department: '교양',
          rating: 4.3,
          students: 76,
          tags: ['영상강의', '참여형', '리포트'],
          thumbnail: '🎨',
          color: 'bg-lime-100 dark:bg-lime-950',
          reviewCount: 76
        },
        {
          id: 17,
          name: '문학과 인간이해',
          professor: '강채원',
          department: '교양',
          rating: 4.5,
          students: 138,
          tags: ['리포트', '토론', '참여형'],
          thumbnail: '📚',
          color: 'bg-violet-100 dark:bg-violet-950',
          reviewCount: 138
        },
        {
          id: 5,
          name: '미디어와 사회',
          professor: '윤하영',
          department: '교양',
          rating: 4.6,
          students: 98,
          tags: ['토론', '리포트', '참여형'],
          thumbnail: '📺',
          color: 'bg-amber-100 dark:bg-amber-950',
          reviewCount: 98
        }
      ]
    },
    {
      id: 'coding-projects',
      title: '💻 코딩과 프로젝트 중심 강의',
      color: 'text-cyan-600',
      courses: [
        {
          id: 2,
          name: '웹프로그래밍 기초',
          professor: '이서연',
          department: '전공',
          rating: 4.5,
          students: 87,
          tags: ['HTML', 'CSS', 'JavaScript'],
          thumbnail: '🌐',
          color: 'bg-blue-100 dark:bg-blue-950',
          reviewCount: 87
        },
        {
          id: 4,
          name: '데이터베이스 시스템',
          professor: '최민석',
          department: '전공',
          rating: 4.4,
          students: 142,
          tags: ['SQL', '과제많음', '프로젝트'],
          thumbnail: '💾',
          color: 'bg-purple-100 dark:bg-purple-950',
          reviewCount: 142
        },
        {
          id: 20,
          name: '프론트엔드 개발 실습',
          professor: '최나윤',
          department: '전공',
          rating: 4.9,
          students: 201,
          tags: ['React', 'TypeScript', '프로젝트'],
          thumbnail: '⚛️',
          color: 'bg-cyan-100 dark:bg-cyan-950',
          reviewCount: 201
        },
        {
          id: 16,
          name: '모바일 앱 개발',
          professor: '홍기훈',
          department: '전공',
          rating: 4.8,
          students: 154,
          tags: ['ReactNative', '프로젝트', '실습많음'],
          thumbnail: '📱',
          color: 'bg-green-100 dark:bg-green-950',
          reviewCount: 154
        }
      ]
    },
    {
      id: 'advanced-cs',
      title: '🎓 심화 전공 강의',
      color: 'text-red-600',
      courses: [
        {
          id: 6,
          name: '운영체제',
          professor: '정도윤',
          department: '전공',
          rating: 4.2,
          students: 77,
          tags: ['이론중심', '난이도높음', '시험중심'],
          thumbnail: '⚙️',
          color: 'bg-slate-100 dark:bg-slate-950',
          reviewCount: 77
        },
        {
          id: 14,
          name: '자료구조',
          professor: '이태훈',
          department: '전공',
          rating: 4.3,
          students: 97,
          tags: ['코딩', '이론중심', '난이도높음'],
          thumbnail: '🔗',
          color: 'bg-zinc-100 dark:bg-zinc-950',
          reviewCount: 97
        },
        {
          id: 10,
          name: '컴퓨터네트워크',
          professor: '한승우',
          department: '전공',
          rating: 4.1,
          students: 59,
          tags: ['이론중심', '코딩', '시험중심'],
          thumbnail: '🌐',
          color: 'bg-neutral-100 dark:bg-neutral-950',
          reviewCount: 59
        },
        {
          id: 18,
          name: '컴퓨터보안',
          professor: '백도현',
          department: '전공',
          rating: 4.2,
          students: 84,
          tags: ['네트워크', '암호화', '이론중심'],
          thumbnail: '🔒',
          color: 'bg-stone-100 dark:bg-stone-950',
          reviewCount: 84
        }
      ]
    }
  ];

  // 키워드 토글 (임시)
  const toggleKeyword = (keyword: string) => {
    setTempSelectedKeywords(prev =>
      prev.includes(keyword)
        ? prev.filter(k => k !== keyword)
        : [...prev, keyword]
    );
  };

  // 검색 실행
  const handleSearch = () => {
    setSelectedKeywords(tempSelectedKeywords);
    setSearchQuery(tempSearchQuery);
    setIsSidebarOpen(false);
  };

  // 사이드바 열 때 현재 선택된 키워드로 임시 키워드 초기화
  const handleOpenSidebar = () => {
    setTempSelectedKeywords(selectedKeywords);
    setTempSearchQuery(searchQuery);
    setIsSidebarOpen(true);
  };

  // 강의 상세보기
  const handleCourseDetail = (course: any) => {
    setSelectedCourse(course);
    setIsDetailOpen(true);
  };

  // 강의 상세 정보 생성
  const getCourseDetails = (course: any) => ({
    ...course,
    credits: 3,
    time: '화목 10:30-12:00',
    location: '공학관 305',
    capacity: 50,
    enrolled: course.students || Math.floor(Math.random() * 50),
    prerequisites: course.id === 8 || course.id === 14 ? ['프로그래밍기초'] : [],
    assessmentMethod: {
      midterm: 30,
      final: 30,
      assignment: 25,
      attendance: 15
    },
    description: `${course.name}은 ${course.department} 학생들을 위한 강의입니다. ${course.professor} 교수님이 진행하시며, 실무 중심의 교육으로 진행됩니다.`,
    difficulty: course.rating > 4.7 ? '쉬움' : course.rating > 4.4 ? '보통' : '어려움',
    reviews: course.reviewCount || course.students
  });

  // 필터링된 강의 목록
  const getFilteredCourses = () => {
    if (selectedKeywords.length === 0 && !searchQuery) {
      return null; // 필터가 없으면 null 반환 (큐레이션 섹션 표시)
    }

    const allCourses = curatedSections.flatMap(section => section.courses);
    return allCourses.filter(course => {
      const matchesKeywords = selectedKeywords.length === 0 || 
        selectedKeywords.some(keyword => course.tags.includes(keyword));
      const matchesSearch = !searchQuery || 
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.professor.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesKeywords && matchesSearch;
    });
  };

  const filteredCourses = getFilteredCourses();

  return (
    <div className="relative min-h-screen">
      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 h-full w-80 bg-background border-r z-50 overflow-y-auto"
          >
            <div className="p-6">
              {/* Sidebar Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  키워드 선택
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="강의명, 교수명 검색..."
                  className="pl-10"
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                />
              </div>

              {/* Selected Keywords */}
              {tempSelectedKeywords.length > 0 && (
                <div className="mb-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm">선택됨 ({tempSelectedKeywords.length})</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setTempSelectedKeywords([])}
                      className="h-auto py-1 px-2 text-xs"
                    >
                      전체 해제
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tempSelectedKeywords.map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => toggleKeyword(keyword)}
                        className="px-3 py-1.5 rounded-full text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all flex items-center gap-1"
                      >
                        #{keyword}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Separator className="my-6" />

              {/* All Keywords */}
              <div className="mb-6">
                <h4 className="text-sm text-muted-foreground mb-3">전체 키워드</h4>
                <div className="flex flex-wrap gap-2">
                  {allKeywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => toggleKeyword(keyword)}
                      className={`
                        px-3 py-1.5 rounded-full text-xs transition-all
                        ${tempSelectedKeywords.includes(keyword)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
                        }
                      `}
                    >
                      #{keyword}
                    </button>
                  ))}
                </div>
              </div>

              {/* Search Button */}
              <div className="sticky bottom-0 bg-background pt-4 pb-2 border-t">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleSearch}
                >
                  <Search className="h-4 w-4 mr-2" />
                  검색하기
                  {tempSelectedKeywords.length > 0 && (
                    <Badge className="ml-2 bg-white/20">
                      {tempSelectedKeywords.length}
                    </Badge>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <motion.main
        animate={{ 
          marginLeft: isSidebarOpen ? '320px' : '0px',
          transition: { type: 'spring', damping: 25, stiffness: 300 }
        }}
        className="container mx-auto px-4 py-6 pb-20"
      >
        <div className="mb-6">
          <h1>강의 추천</h1>
          <p className="text-muted-foreground mt-2">맞춤형 강의를 추천받아보세요</p>
        </div>

        {/* Search Bar */}
        <div
          onClick={handleOpenSidebar}
          className="mb-6 cursor-pointer"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="키워드로 강의 찾기..."
              className="pl-10 pr-10 h-12 cursor-pointer"
              readOnly
              value={selectedKeywords.length > 0 ? `${selectedKeywords.length}개 키워드 선택됨` : ''}
            />
            <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Active Filters Display */}
        {(selectedKeywords.length > 0 || searchQuery) && (
          <div className="mb-6 p-4 bg-muted rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="text-sm">필터 적용 중</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedKeywords([]);
                  setSearchQuery('');
                }}
              >
                전체 초기화
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  검색: {searchQuery}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {selectedKeywords.map((keyword) => (
                <Badge key={keyword} variant="default" className="gap-1">
                  #{keyword}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedKeywords(prev => prev.filter(k => k !== keyword));
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Content: Curated Sections or Filtered Results */}
        {filteredCourses === null ? (
          /* Curated Sections */
          <div className="space-y-8">
            {curatedSections.map((section) => (
              <div key={section.id}>
                {/* Section Header */}
                <div className="flex items-center justify-between mb-4">
                  <h2 className={section.color}>{section.title}</h2>
                  <Button variant="ghost" size="sm">
                    전체보기
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>

                {/* Horizontal Scroll Cards */}
                <div className="relative">
                  <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                    {section.courses.map((course) => (
                      <Card
                        key={course.id}
                        className="flex-shrink-0 w-64 hover:shadow-lg transition-shadow cursor-pointer snap-start"
                        onClick={() => handleCourseDetail(course)}
                      >
                        <CardContent className="pt-6">
                          {/* Thumbnail */}
                          <div className={`w-full h-32 rounded-lg ${course.color} flex items-center justify-center mb-4`}>
                            <span className="text-5xl">{course.thumbnail}</span>
                          </div>

                          {/* Course Info */}
                          <h3 className="mb-2 line-clamp-2">{course.name}</h3>
                          <p className="text-sm text-muted-foreground mb-3">
                            {course.professor} • {course.department}
                          </p>

                          {/* Rating */}
                          <div className="flex items-center space-x-1 mb-3">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm">{course.rating}</span>
                            <span className="text-xs text-muted-foreground">
                              ({course.students.toLocaleString()}명)
                            </span>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1">
                            {course.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Filtered Results Grid */
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3>검색 결과</h3>
              <Badge variant="secondary">
                {filteredCourses.length}개의 강의
              </Badge>
            </div>

            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handleCourseDetail(course)}
                  >
                    <CardContent className="pt-6">
                      {/* Thumbnail */}
                      <div className={`w-full h-24 rounded-lg ${course.color} flex items-center justify-center mb-4`}>
                        <span className="text-4xl">{course.thumbnail}</span>
                      </div>

                      {/* Course Info */}
                      <h4 className="mb-2 line-clamp-2">{course.name}</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        {course.professor} • {course.department}
                      </p>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-3">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{course.rating}</span>
                        <span className="text-xs text-muted-foreground">
                          ({course.students.toLocaleString()}명)
                        </span>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1">
                        {course.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant={selectedKeywords.includes(tag) ? 'default' : 'secondary'}
                            className="text-xs"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  검색 조건에 맞는 강의가 없습니다.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedKeywords([]);
                    setSearchQuery('');
                  }}
                >
                  필터 초기화
                </Button>
              </div>
            )}
          </div>
        )}
      </motion.main>

      {/* Scrollbar Hide Styles */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

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
                        <Badge variant="secondary">{selectedCourse.department}</Badge>
                        <span>•</span>
                        <span>{selectedCourse.professor}</span>
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
                          <p>{details.credits}학점</p>
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
                          <p>{details.time}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">강의실</p>
                          <p>{details.location}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">수강 정원</p>
                          <p>{details.enrolled}/{details.capacity}명</p>
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
                    <p className="text-muted-foreground">{details.description}</p>
                  </div>

                  <Separator />

                  {/* Keywords */}
                  <div>
                    <h4 className="mb-3">연관 키워드</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedCourse.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  {/* Prerequisites */}
                  {details.prerequisites.length > 0 && (
                    <>
                      <div>
                        <h4 className="mb-3">선수과목</h4>
                        <div className="flex flex-wrap gap-2">
                          {details.prerequisites.map((prereq: string) => (
                            <Badge key={prereq} variant="outline">
                              {prereq}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Separator />
                    </>
                  )}

                  {/* Assessment Method */}
                  <div>
                    <h4 className="mb-3">성적 평가</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl mb-1">{details.assessmentMethod.midterm}%</div>
                        <div className="text-xs text-muted-foreground">중간고사</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl mb-1">{details.assessmentMethod.final}%</div>
                        <div className="text-xs text-muted-foreground">기말고사</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl mb-1">{details.assessmentMethod.assignment}%</div>
                        <div className="text-xs text-muted-foreground">과제</div>
                      </div>
                      <div className="text-center p-3 bg-muted rounded-lg">
                        <div className="text-2xl mb-1">{details.assessmentMethod.attendance}%</div>
                        <div className="text-xs text-muted-foreground">출석</div>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-4">
                    <Button className="flex-1">수강신청</Button>
                    <Button variant="outline" className="flex-1">찜하기</Button>
                  </div>
                </div>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
