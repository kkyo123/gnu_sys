import React, { useEffect, useState } from 'react';
import {
  Search as SearchIcon,
  Filter,
  User,
  BookOpen,
  X,
  Clock,
  FileText,
  Tag,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from 'lucide-react';

// ======================= UI COMPONENTS (Internal) ===========================

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'black' }>(
  ({ className = '', variant = 'default', ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4";
    const variants = {
      default: "bg-blue-600 text-white hover:bg-blue-700",
      black: "bg-black text-white hover:bg-gray-800",
      outline: "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50",
      secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
      ghost: "hover:bg-gray-100 text-gray-700",
    };
    return (
      <button ref={ref} className={`${baseStyles} ${variants[variant]} ${className}`} {...props} />
    );
  }
);
Button.displayName = "Button";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`flex h-12 w-full rounded-md border border-gray-200 bg-[#F5F5F5] px-4 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`rounded-xl border border-gray-200 bg-white text-gray-900 shadow-sm ${className}`} {...props} />
  )
);
Card.displayName = "Card";

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`p-6 ${className}`} {...props} />
  )
);
CardContent.displayName = "CardContent";

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'sky' | 'blue' | 'green' | 'gray';

const Badge = ({ className = '', variant = 'default', ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: BadgeVariant }) => {
  const variants: Record<BadgeVariant, string> = {
    default: "border-transparent bg-blue-500 text-white",
    secondary: "border-transparent bg-gray-100 text-gray-700",
    outline: "text-gray-700 border border-gray-300",
    sky: "bg-cyan-500 text-white",
    blue: "bg-blue-600 text-white",
    green: "bg-emerald-500 text-white",
    gray: "bg-gray-200 text-gray-600",
  };
  return (
    <div className={`inline-flex items-center justify-center rounded-[4px] px-2 py-[2px] text-[11px] font-medium ${variants[variant]} ${className}`} {...props} />
  );
};

// Simple Toast Component
function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 left-1/2 z-[70] -translate-x-1/2 rounded-full bg-black/80 text-white px-6 py-3 text-sm shadow-lg backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-300">
      {message}
    </div>
  );
}

// Dialog Components
const Dialog = ({ open, onOpenChange, children }: { open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-[600px] max-h-[90vh] flex justify-center" onClick={(e) => e.stopPropagation()}>
        {React.Children.map(children, child => {
          if (React.isValidElement(child)) {
             // eslint-disable-next-line @typescript-eslint/no-explicit-any
             return React.cloneElement(child as React.ReactElement<any>, { onClose: () => onOpenChange?.(false) });
          }
          return child;
        })}
      </div>
      <div className="absolute inset-0 -z-10" onClick={() => onOpenChange?.(false)} />
    </div>
  );
};
const DialogContent = ({ className = '', children, onClose }: { className?: string; children: React.ReactNode; onClose?: () => void }) => (
  <div className={`relative w-full bg-white shadow-xl rounded-2xl overflow-hidden my-8 flex flex-col max-h-[calc(90vh-4rem)] ${className}`} onClick={e => e.stopPropagation()}>
    <button onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full p-1 bg-white/50 hover:bg-gray-100 transition-colors">
      <X className="h-5 w-5 text-gray-500" />
      <span className="sr-only">Close</span>
    </button>
    {children}
  </div>
);

const Separator = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className = '', ...props }, ref) => (
    <div ref={ref} className={`shrink-0 bg-gray-100 h-[1px] w-full my-6 ${className}`} {...props} />
  )
);
Separator.displayName = "Separator";

// ======================= DATA & TYPES ===========================

interface CourseOut {
  id: string;
  course_code?: string;
  course_name?: string;
  name?: string;
  professor?: string;
  group?: string;
  general_type?: string;
  category?: string;
  credits?: number;
  timeslot?: string;
  rating?: number;
  description?: string;
  keywords?: string[];
}

const BASE_COURSES: CourseOut[] = [
  { id: '1', course_code: 'CS101', name: '운영체제', professor: '김철수', credits: 3, timeslot: '월3,수3', rating: 4.5, category: '전공필수', description: '운영체제의 기본 개념과 구조를 배웁니다.', keywords: ['이론', '시험위주'] },
  { id: '2', course_code: 'SEC201', name: '정보보안개론', professor: '이영희', credits: 3, timeslot: '화2,목2', rating: 4.2, category: '전공선택', description: '정보보안의 기초 이론과 실무를 다룹니다.', keywords: ['실습', '팀플'] },
  { id: '3', course_code: 'CS102', name: '알고리즘', professor: '박민수', credits: 3, timeslot: '금1,금2', rating: 3.8, category: '전공선택', description: '효율적인 알고리즘 설계 및 분석 방법을 학습합니다.', keywords: ['이론', '과제많음'] },
  { id: '4', course_code: 'PBL301', name: '전공종합설계PBL1', professor: '최지우', credits: 3, timeslot: '월1,수1', rating: 4.0, category: '전공필수', description: '실무 프로젝트를 통한 전공 지식의 종합적 활용.', keywords: ['프로젝트', '팀플', '발표'] },
  { id: '5', course_code: 'DS401', name: '데이터과학', professor: '정수학', credits: 3, timeslot: '화4,목4', rating: 3.5, category: '전공선택', description: '데이터 분석 및 처리에 관한 과학적 접근.', keywords: ['실습', '통계'] },
  { id: '6', course_code: 'ENG101', name: '글로벌영어', professor: '오경영', credits: 3, timeslot: '수5,금5', rating: 4.7, general_type: '핵심교양', description: '글로벌 커뮤니케이션을 위한 영어 능력 함양.', keywords: ['발표', '회화'] },
  { id: '7', course_code: 'AI101', name: '비전공자를위한인공지능', professor: '강선생', credits: 2, timeslot: '목5,목6', rating: 4.3, general_type: '핵심교양', description: '인공지능의 기초 원리와 사회적 영향을 이해합니다.', keywords: ['이론', '교양'] },
];

const MOCK_COURSES = Array.from({ length: 45 }).map((_, i) => ({
  ...BASE_COURSES[i % BASE_COURSES.length],
  id: `${i}`,
  name: `${BASE_COURSES[i % BASE_COURSES.length].name} ${Math.floor(i / 7) + 1}반`,
}));

const SEMESTER_OPTIONS = [
  '2021년 1학기', '2021년 2학기',
  '2022년 1학기', '2022년 2학기',
  '2023년 1학기', '2023년 2학기',
  '2024년 1학기', '2024년 2학기',
  '2025년 1학기',
];

// ======================= MAIN COMPONENT ===========================

export default function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  
  // Data State
  const [filteredCourses, setFilteredCourses] = useState<CourseOut[]>(MOCK_COURSES);
  const [selectedCourse, setSelectedCourse] = useState<CourseOut | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // History/Toast Logic
  const [showSemesterSelect, setShowSemesterSelect] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Filter Logic (Text Search Only)
  useEffect(() => {
    let result = MOCK_COURSES;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(c => 
        (c.name && c.name.toLowerCase().includes(q)) || 
        (c.professor && c.professor.toLowerCase().includes(q))
      );
    }
    setFilteredCourses(result);
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredCourses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  const handleCourseDetail = (course: CourseOut) => {
    setSelectedCourse(course);
    setIsDetailOpen(true);
    setShowSemesterSelect(false);
  };

  const openToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 2000);
  };

  const handleHistoryRegister = () => {
    setShowSemesterSelect(prev => !prev);
  };

  const handleSemesterSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value) {
      openToast('등록이 완료되었습니다.');
      setShowSemesterSelect(false);
    }
  };

  const handleInterestClick = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    openToast('등록이 완료되었습니다.');
  };

  const getBadgeInfo = (course: CourseOut): { variant: BadgeVariant, label: string } => {
    const cat = course.category || course.general_type || '';
    if (cat.includes('전공필수')) return { variant: 'blue', label: '전공필수' };
    if (cat.includes('전공선택')) return { variant: 'sky', label: '전공선택' };
    if (cat.includes('핵심교양')) return { variant: 'green', label: '핵심교양' };
    return { variant: 'gray', label: cat || '일반' };
  };

  // Mock Detail Data
  const getCourseDetails = (course: CourseOut) => ({
    ...course,
    location: '공학관 305',
    capacity: 50,
    enrolled: 35,
    prerequisites: ['프로그래밍기초'],
    description: `${course.name}은 ${course.category || course.general_type} 과목으로, ${course.professor} 교수님이 진행합니다. 실무 중심의 교육과 프로젝트 기반 학습이 이루어집니다.`,
  });

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans relative flex">
      <main className="flex-1 mx-auto max-w-[1200px] px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">강의 검색</h1>
          <p className="text-gray-500 text-sm">원하는 강의명 또는 교수명을 입력하세요</p>
        </div>

        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="강의명, 교수명으로 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 bg-[#F8F9FA] border-none shadow-sm cursor-text"
            />
          </div>
          {/* Optional Filter Button (Currently does nothing visible but toggles state) */}
          <Button variant="outline" className="h-12 px-6 rounded-md border-gray-300 gap-2 bg-white text-gray-700 hover:bg-gray-50" onClick={() => setShowFilters(!showFilters)}>
            <Filter className="h-4 w-4" /> 필터
          </Button>
        </div>

        <div className="space-y-4 min-h-[500px]">
          {currentItems.length > 0 ? (
            currentItems.map((course) => {
              const badgeInfo = getBadgeInfo(course);
              return (
                <Card key={course.id} className="hover:shadow-md transition-shadow border-gray-200 bg-white">
                  <CardContent className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 gap-4">
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg font-bold text-gray-900">{course.name}</h3>
                        <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
                        <Badge variant="gray">교과목코드-분반</Badge>
                      </div>
                      <p className="text-sm text-gray-500">{course.description}</p>
                    </div>
                    <div className="flex items-center gap-6 text-sm text-gray-600 w-full md:w-auto justify-between md:justify-end">
                      <div className="flex items-center gap-6">
                          <div className="flex items-center gap-1.5 min-w-[60px]"><User className="h-4 w-4 text-gray-400" /><span>{course.professor}</span></div>
                          <div className="flex items-center gap-1.5 min-w-[60px]"><BookOpen className="h-4 w-4 text-gray-400" /><span>{course.credits}학점</span></div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" className="h-9 text-xs px-3 border-gray-300 text-gray-700" onClick={() => handleCourseDetail(course)}>상세보기</Button>
                        <Button variant="black" className="h-9 text-xs px-3" onClick={handleInterestClick}>관심과목</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          ) : (
             <div className="text-center py-20 text-gray-500">검색 결과가 없습니다.</div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-30"><ChevronLeft className="h-5 w-5" /></button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button key={page} onClick={() => handlePageChange(page)} className={`w-8 h-8 flex items-center justify-center rounded-md text-sm font-medium transition-colors ${currentPage === page ? 'bg-black text-white' : 'text-gray-600 hover:bg-gray-100'}`}>{page}</button>
            ))}
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-100 disabled:opacity-30"><ChevronRight className="h-5 w-5" /></button>
          </div>
        )}
      </main>

      {/* Detail Modal */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-[600px] p-0 overflow-hidden rounded-2xl bg-white">
          {selectedCourse && (() => {
             const details = getCourseDetails(selectedCourse);
             const badgeInfo = getBadgeInfo(selectedCourse);
             return (
               <div className="flex flex-col h-full overflow-hidden">
                 <div className="p-8 pb-4 flex-1 overflow-y-auto">
                    {/* Header */}
                    <div className="mb-6">
                      <div className="flex items-center gap-2 mb-2">
                         <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.name}</h2>
                      </div>
                      <div className="flex gap-2">
                         <Badge variant={badgeInfo.variant}>{badgeInfo.label}</Badge>
                         <Badge variant="gray">교과목코드-분반</Badge>
                      </div>
                    </div>

                    {/* Meta Grid */}
                    <div className="flex justify-between border-b border-gray-100 pb-6 mb-6">
                       <div className="flex flex-col items-center flex-1 border-r border-gray-100 last:border-0">
                          <span className="text-xs text-gray-400 mb-1">교수명</span>
                          <div className="flex items-center gap-1 font-bold text-gray-900"><User className="w-4 h-4 text-gray-400"/> {selectedCourse.professor}</div>
                       </div>
                       <div className="flex flex-col items-center flex-1 border-r border-gray-100 last:border-0">
                          <span className="text-xs text-gray-400 mb-1">학점</span>
                          <div className="flex items-center gap-1 font-bold text-gray-900"><BookOpen className="w-4 h-4 text-gray-400"/> {selectedCourse.credits}학점</div>
                       </div>
                       <div className="flex flex-col items-center flex-1">
                          <span className="text-xs text-gray-400 mb-1">강의시간</span>
                          <div className="flex items-center gap-1 font-bold text-gray-900"><Clock className="w-4 h-4 text-gray-400"/> {selectedCourse.timeslot}</div>
                       </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                       <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2"><FileText className="w-4 h-4 text-blue-600"/> 강의 소개</h3>
                       <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100">
                         {details.description}
                         <br/>
                         본 수업은 다양한 실습과 이론을 병행하며, 학생들의 참여를 적극 권장합니다.
                       </p>
                    </div>

                    {/* Keywords */}
                    <div className="mb-6">
                       <h3 className="flex items-center gap-2 text-sm font-bold text-gray-900 mb-2"><Tag className="w-4 h-4 text-blue-600"/> 연관 키워드</h3>
                       <div className="flex flex-wrap gap-2">
                          {(selectedCourse.keywords || ['시험없음', '프로젝트', '실습', '팀플']).map(kw => (
                            <span key={`${kw}`} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">#{kw}</span>
                          ))}
                       </div>
                    </div>

                    {/* Info Grid (Map, Capacity) */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                       <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                          <MapPin className="w-5 h-5 text-gray-400" />
                          <div><p className="text-xs text-gray-500">강의실</p><p className="text-sm font-bold text-gray-900">{details.location}</p></div>
                       </div>
                       <div className="p-3 bg-gray-50 rounded-lg flex items-center gap-3">
                          <User className="w-5 h-5 text-gray-400" />
                          <div><p className="text-xs text-gray-500">수강정원</p><p className="text-sm font-bold text-gray-900">{details.enrolled}/{details.capacity}명</p></div>
                       </div>
                    </div>

                    {/* Semester Dropdown Area */}
                    {showSemesterSelect && (
                      <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <label className="block text-xs font-bold text-blue-800 mb-2">수강 학기 선택</label>
                        <div className="relative">
                          <select 
                            className="w-full h-10 rounded-md border border-blue-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white appearance-none cursor-pointer" 
                            onChange={handleSemesterSelect}
                            defaultValue=""
                          >
                            <option value="" disabled>학기를 선택하세요</option>
                            {SEMESTER_OPTIONS.map(sem => <option key={sem} value={sem}>{sem}</option>)}
                          </select>
                          <ChevronLeft className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 rotate-[-90deg] pointer-events-none" />
                        </div>
                      </div>
                    )}
                 </div>

                 {/* Footer Buttons */}
                 <div className="p-6 border-t border-gray-100 flex gap-3 bg-white z-20">
                    <Button variant="outline" className="flex-1 h-12 text-base font-bold border-gray-200 hover:bg-gray-50" onClick={handleHistoryRegister}>
                      {showSemesterSelect ? '취소' : '이수 이력 등록'}
                    </Button>
                    <Button variant="black" className="flex-1 h-12 text-base font-bold bg-black hover:bg-gray-800 text-white" onClick={() => handleInterestClick()}>
                      관심과목
                    </Button>
                 </div>
               </div>
             );
          })()}
        </DialogContent>
      </Dialog>

      <Toast message={toastMessage} />
    </div>
  );
}