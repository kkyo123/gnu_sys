import React, { useState } from 'react';
import {
  Search,
  X,
  Filter,
  Sparkles,
  BookOpen,
  FileText,
  Award,
  Clock,
  User,
} from 'lucide-react';

// ======================= DATA ===========================

const keywordCategories = [
  {
    title: '수업 방식',
    keywords: [
      'PPT강의',
      '토론',
      '조별활동',
      '코딩실습',
      '이론중심',
      '실험',
      '발표',
      '온라인강의',
      '오프라인강의',
      '영상강의',
      '참여형',
    ],
  },
  {
    title: '평가 방식',
    keywords: [
      '시험없음',
      '리포트',
      '프로젝트',
      '출석중요',
      '객관식',
      '주관식',
      '개인과제',
      '팀과제',
      '과제많음',
    ],
  },
  { title: '난이도', keywords: ['난이도쉬움', '난이도높음'] },
  { title: '기술/언어', keywords: ['HTML', 'CSS', 'JavaScript', 'React', 'Python', 'SQL'] },
];

const curatedSections = [
  {
    id: 'intro-ai',
    title: '비전공자도 쉽게 배우는 AI 및 코딩 초급 입문 강의',
    courses: [
      {
        id: 1,
        name: '소프트웨어입문',
        professor: '김철수',
        credits: 3,
        time: '월3,수3',
        department: '전공선택',
        badges: ['전공선택', '전공선택'],
        tags: ['키워드', '키워드', '키워드', '키워드', '키워드'],
        rating: 4.5,
        students: 120,
      },
      {
        id: 2,
        name: '인공지능의이해',
        professor: '이영희',
        credits: 3,
        time: '화2,목2',
        department: '전공선택',
        badges: ['전공선택', '전공선택'],
        tags: ['키워드', '키워드', '키워드', '키워드', '키워드'],
        rating: 4.2,
        students: 98,
      },
      {
        id: 3,
        name: '파이썬프로그래밍',
        professor: '박민수',
        credits: 3,
        time: '금1,금2',
        department: '전공선택',
        badges: ['전공선택', '전공선택'],
        tags: ['키워드', '키워드', '키워드', '키워드', '키워드'],
        rating: 4.8,
        students: 210,
      },
      {
        id: 4,
        name: '데이터과학기초',
        professor: '최지우',
        credits: 3,
        time: '월1,수1',
        department: '전공선택',
        badges: ['전공선택', '전공선택'],
        tags: ['키워드', '키워드', '키워드', '키워드', '키워드'],
        rating: 4.0,
        students: 85,
      },
    ],
  },
  {
    id: 'web-dev',
    title: '웹 개발 기초부터 실전까지',
    courses: [
      {
        id: 5,
        name: '웹프로그래밍',
        professor: '정수학',
        credits: 3,
        time: '화4,목4',
        department: '전공필수',
        badges: ['전공필수', '전공선택'],
        tags: ['HTML', 'CSS', 'JS'],
        rating: 4.6,
        students: 150,
      },
      {
        id: 6,
        name: '프론트엔드실습',
        professor: '오경영',
        credits: 3,
        time: '수5,금5',
        department: '전공선택',
        badges: ['전공선택', '실습'],
        tags: ['React', 'Vue'],
        rating: 4.9,
        students: 200,
      },
      {
        id: 7,
        name: '백엔드기초',
        professor: '강선생',
        credits: 3,
        time: '목5,목6',
        department: '전공선택',
        badges: ['전공선택', '이론'],
        tags: ['Node.js', 'DB'],
        rating: 4.3,
        students: 110,
      },
      {
        id: 8,
        name: '풀스택프로젝트',
        professor: '조혜진',
        credits: 3,
        time: '월5,수5',
        department: '전공선택',
        badges: ['전공선택', '프로젝트'],
        tags: ['배포', '클라우드'],
        rating: 4.7,
        students: 90,
      },
    ],
  },
  {
    id: 'design',
    title: '디자인 감각을 키우는 교양 강의',
    courses: [
      {
        id: 9,
        name: '디자인씽킹',
        professor: '홍길동',
        credits: 2,
        time: '금3,금4',
        department: '교양선택',
        badges: ['교양선택', '팀플'],
        tags: ['창의성', '기획'],
        rating: 4.4,
        students: 130,
      },
      {
        id: 10,
        name: '색채학',
        professor: '신사임',
        credits: 2,
        time: '월2,수2',
        department: '교양선택',
        badges: ['교양선택', '이론'],
        tags: ['색채', '예술'],
        rating: 4.1,
        students: 70,
      },
      {
        id: 11,
        name: 'UX/UI개론',
        professor: '장영실',
        credits: 3,
        time: '화5,목5',
        department: '전공선택',
        badges: ['전공선택', '실습'],
        tags: ['사용자경험', '인터페이스'],
        rating: 4.5,
        students: 180,
      },
      {
        id: 12,
        name: '영상제작기초',
        professor: '김유신',
        credits: 3,
        time: '수1,수2',
        department: '교양선택',
        badges: ['교양선택', '실습'],
        tags: ['영상', '편집'],
        rating: 4.8,
        students: 220,
      },
    ],
  },
];

const SEMESTER_OPTIONS = [
  '2021년 1학기',
  '2021년 2학기',
  '2022년 1학기',
  '2022년 2학기',
  '2023년 1학기',
  '2023년 2학기',
  '2024년 1학기',
  '2024년 2학기',
  '2025년 1학기',
];

// ======================= MAIN COMPONENT ===========================

export default function CourseRecommendation() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedKeywords, setSelectedKeywords] = useState<string[]>([]);
  const [tempSelectedKeywords, setTempSelectedKeywords] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [tempSearchQuery, setTempSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState('');
  const [showSemesterSelect, setShowSemesterSelect] = useState(false);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  const openToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  // Handlers
  const toggleKeyword = (keyword: string) => {
    setTempSelectedKeywords((prev) =>
      prev.includes(keyword) ? prev.filter((k) => k !== keyword) : [...prev, keyword],
    );
  };

  const handleSearch = () => {
    setSelectedKeywords(tempSelectedKeywords);
    setSearchQuery(tempSearchQuery);
    setIsSidebarOpen(false);
  };

  const handleOpenSidebar = () => {
    setTempSelectedKeywords(selectedKeywords);
    setTempSearchQuery(searchQuery);
    setIsSidebarOpen(true);
  };

  const handleCourseDetail = (course: any) => {
    setSelectedCourse(course);
    setIsDetailOpen(true);
    setShowSemesterSelect(false);
    setSelectedSemester(null);
  };

  // Mock Detail Generator
  const getCourseDetails = (course: any) => ({
    ...course,
    location: '공학관 305',
    capacity: 50,
    enrolled: course.students,
    prerequisites: ['프로그래밍기초'],
    assessmentMethod: { midterm: 30, final: 30, assignment: 25, attendance: 15 },
    description: `${course.name}은 ${course.department} 학생들을 위한 강의입니다. ${course.professor} 교수님이 진행하시며, 실무 중심의 교육으로 진행됩니다.`,
    difficulty: course.rating > 4.5 ? '쉬움' : '보통',
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-20">
      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/20 z-40 transition-opacity"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed left-0 top-0 h-full w-[360px] bg-white z-50 shadow-2xl overflow-y-auto animate-in slide-in-from-left duration-300">
            <div className="p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-xl font-bold text-gray-900">키워드 선택</h3>
                <button
                  className="p-2 hover:bg-gray-100 rounded-full"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="강의명, 교수명 검색"
                  className="w-full h-12 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-200 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={tempSearchQuery}
                  onChange={(e) => setTempSearchQuery(e.target.value)}
                />
              </div>

              {tempSelectedKeywords.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-medium text-gray-500">
                      선택됨 ({tempSelectedKeywords.length})
                    </span>
                    <button
                      onClick={() => setTempSelectedKeywords([])}
                      className="text-xs text-gray-400 underline"
                    >
                      전체 해제
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tempSelectedKeywords.map((keyword) => (
                      <button
                        key={keyword}
                        onClick={() => toggleKeyword(keyword)}
                        className="px-3 py-1.5 rounded-full text-sm bg-blue-600 text-white flex items-center gap-1 font-medium hover:bg-blue-700 transition-colors"
                      >
                        #{keyword}
                        <X className="h-3 w-3" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-8">
                {keywordCategories.map((category) => (
                  <div key={category.title}>
                    <h4 className="text-sm font-bold text-gray-900 mb-3">{category.title}</h4>
                    <div className="flex flex-wrap gap-2">
                      {category.keywords.map((keyword) => (
                        <button
                          key={keyword}
                          onClick={() => toggleKeyword(keyword)}
                          className={`px-3 py-1.5 rounded-full text-sm transition-all font-medium ${
                            tempSelectedKeywords.includes(keyword)
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {keyword}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="sticky bottom-0 bg-white pt-6 pb-2">
                <button
                  className="w-full h-12 text-lg font-bold bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                  onClick={handleSearch}
                >
                  검색하기
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Main Content */}
      <main className="mx-auto max-w-[1280px] px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">강의 추천</h1>
          <p className="text-gray-500 text-sm">맞춤형 강의를 추천받아보세요.</p>
        </div>

        {/* Search Bar */}
        <div className="mb-12 cursor-pointer" onClick={handleOpenSidebar}>
          <div className="relative flex items-center w-full h-14 bg-gray-50 rounded-lg border border-gray-100 px-4 hover:border-gray-300 transition-colors">
            <Search className="h-5 w-5 text-gray-400 mr-3" />
            <input
              type="text"
              placeholder="키워드로 강의 찾기..."
              className="bg-transparent border-none outline-none flex-1 text-base text-gray-900 placeholder:text-gray-400 cursor-pointer"
              readOnly
              value={
                selectedKeywords.length > 0
                  ? `${selectedKeywords.length}개 키워드 선택됨`
                  : ''
              }
            />
            <Filter className="h-5 w-5 text-gray-400 ml-auto" />
          </div>
        </div>

        {/* Sections – centered cards */}
        <div className="space-y-16">
          {curatedSections.map((section) => (
            <div key={section.id}>
              <h2 className="text-lg font-bold text-gray-800 mb-6">{section.title}</h2>

              <div className="flex justify-center">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {section.courses.map((course) => (
                    <div
                      key={course.id}
                      className="w-[280px] bg-white border border-gray-200 rounded-xl p-5 flex flex-col justify-between hover:shadow-lg transition-shadow cursor-pointer"
                      onClick={() => handleCourseDetail(course)}
                    >
                      {/* Top: Title & Credits */}
                      <div className="mb-4">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="text-lg font-bold text-gray-900 leading-tight line-clamp-1">
                            {course.name}
                          </h3>
                          <div className="flex items-center text-gray-400 text-sm flex-shrink-0 ml-2">
                            <BookOpen className="w-4 h-4 mr-1" />
                            <span>{course.credits}학점</span>
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex gap-2 mt-2">
                          {course.badges.map((badge: string, i: number) => (
                            <span
                              key={i}
                              className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>

                        {/* Keywords */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {course.tags.slice(0, 3).map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Bottom: Info & Button */}
                      <div>
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                          <div className="flex items-center gap-1">
                            <User className="w-4 h-4" />
                            {course.professor}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            시간표
                          </div>
                        </div>

                        <button className="w-full border border-gray-200 rounded py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors font-medium">
                          상세보기
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Detail Modal */}
      {isDetailOpen && selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setIsDetailOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {(() => {
              const details = getCourseDetails(selectedCourse);
              return (
                <div className="flex flex-col">
                  <div className="p-8 pb-4">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                        <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
                      </div>
                      <div className="flex gap-2 items-center text-sm">
                        <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-xs font-medium">
                          전공필수
                        </span>
                        <span className="bg-gray-100 text-gray-500 px-2 py-1 rounded text-xs">
                          교과목코드-분반
                        </span>
                      </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="flex justify-between border-b border-gray-100 pb-6 mb-6">
                      <div className="flex flex-col items-center flex-1 border-r border-gray-100 last:border-0">
                        <span className="text-xs text-gray-400 mb-1">교수명</span>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <User className="w-4 h-4 text-gray-400" />
                          {selectedCourse.professor}
                        </div>
                      </div>
                      <div className="flex flex-col items-center flex-1 border-r border-gray-100 last:border-0">
                        <span className="text-xs text-gray-400 mb-1">학점</span>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <BookOpen className="w-4 h-4 text-gray-400" /> {details.credits}학점
                        </div>
                      </div>
                      <div className="flex flex-col items-center flex-1">
                        <span className="text-xs text-gray-400 mb-1">강의시간</span>
                        <div className="flex items-center gap-1 font-bold text-gray-900">
                          <Clock className="w-4 h-4 text-gray-400" /> {details.time}
                        </div>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="space-y-6">
                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                          <FileText className="w-4 h-4 text-blue-600" /> 강의 소개
                        </h4>
                        <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                          {details.description}
                        </p>
                      </div>

                      <div>
                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                          <Sparkles className="w-4 h-4 text-blue-600" /> 연관 키워드
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedCourse.tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* 이수 이력 학기 선택 */}
                      {showSemesterSelect && (
                        <div>
                          <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2">
                            <Award className="w-4 h-4 text-blue-600" /> 수강 학기 선택
                          </h4>
                          <select
                            className="h-10 rounded-md border border-gray-300 px-3 text-sm w-full"
                            value={selectedSemester ?? ''}
                            onChange={(e) => {
                              const value = e.target.value;
                              if (!value) return;
                              setSelectedSemester(value);
                              openToast('등록이 완료되었습니다.');
                            }}
                          >
                            <option value="">학기를 선택하세요</option>
                            {SEMESTER_OPTIONS.map((sem) => (
                              <option key={sem} value={sem}>
                                {sem}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="p-6 border-t border-gray-100 flex gap-3 sticky bottom-0 bg-white">
                    <button
                      className="flex-1 h-12 rounded-lg border border-gray-200 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={() => setShowSemesterSelect((prev) => !prev)}
                    >
                      이수 이력 등록
                    </button>
                    <button
                      className="flex-1 h-12 rounded-lg bg-black text-white font-bold hover:bg-gray-800 transition-colors"
                      onClick={() => openToast('등록이 완료되었습니다.')}
                    >
                      관심과목
                    </button>
                  </div>

                  {/* Close Button */}
                  <button
                    onClick={() => setIsDetailOpen(false)}
                    className="absolute right-4 top-4 p-2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[60] rounded-md bg-white px-4 py-2 text-sm shadow-lg border border-gray-200">
          {toastMessage}
        </div>
      )}
    </div>
  );
}
