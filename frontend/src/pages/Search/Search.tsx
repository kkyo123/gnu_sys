import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  Clock,
  MapPin,
  User,
  Star,
  BookOpen,
  Users,
  FileText,
  Award,
} from "lucide-react";
import "./Search.css";

/* ─────────────────────────────
 *  Minimal UI Primitives
 * ───────────────────────────── */
// Types 섹션 어딘가에 추가
type SortKey = "rating" | "name" | "professor" | "capacity";


type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md";
  block?: boolean;
};
const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  block,
  className = "",
  ...props
}) => (
  <button
    className={[
      "btn",
      `btn--${variant}`,
      `btn--${size}`,
      block ? "btn--block" : "",
      className,
    ].join(" ")}
    {...props}
  />
);

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;
const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input className={["input", className].join(" ")} {...props} />
);

const SelectNative: React.FC<
  React.SelectHTMLAttributes<HTMLSelectElement>
> = ({ className = "", children, ...props }) => (
  <select className={["select", className].join(" ")} {...props}>
    {children}
  </select>
);

const Checkbox: React.FC<
  React.InputHTMLAttributes<HTMLInputElement>
> = ({ className = "", ...props }) => (
  <input type="checkbox" className={["checkbox", className].join(" ")} {...props} />
);

const Card: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => <div className={["card", className].join(" ")} {...props} />;


const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => <div className={["card__content", className].join(" ")} {...props} />;

const Badge: React.FC<
  React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "secondary" | "outline" | "destructive" }
> = ({ className = "", variant = "default", ...props }) => (
  <span className={["badge", `badge--${variant}`, className].join(" ")} {...props} />
);

const Separator: React.FC = () => <div className="separator" />;

const Modal: React.FC<{
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="modal__backdrop" onClick={onClose}>
      <div
        className="modal__content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </div>
    </div>
  );
};

/* ─────────────────────────────
 *  Types
 * ───────────────────────────── */

type Course = {
  id: number;
  name: string;
  professor: string;
  department: string;
  credits: number;
  time: string;
  location: string;
  capacity: number;
  enrolled: number;
  rating: number;
  type: string;
  description: string;
};

type CourseDetail = Course & {
  prerequisites: string[];
  keywords: string[];
  assessmentMethod: { midterm: number; final: number; assignment: number; attendance: number };
  syllabus: string;
  reviews: number;
  difficulty: "쉬움" | "보통" | "어려움";
};

/* ─────────────────────────────
 *  Sample Data (can be replaced by backend)
 * ───────────────────────────── */

const departments = [
  "전체",
  "컴퓨터과학과",
  "전자공학과",
  "기계공학과",
  "화학공학과",
  "경영학과",
  "경제학과",
  "심리학과",
  "영어영문학과",
  "수학과",
];

const days = ["전체", "월", "화", "수", "목", "금"];
const times = [
  "전체",
  "1교시(09:00-10:30)",
  "2교시(10:30-12:00)",
  "3교시(13:00-14:30)",
  "4교시(14:30-16:00)",
  "5교시(16:00-17:30)",
];

const initialCourses: Course[] = [
  {
    id: 1,
    name: "자료구조",
    professor: "김교수",
    department: "컴퓨터과학과",
    credits: 3,
    time: "화목 10:30-12:00",
    location: "공학관 305",
    capacity: 40,
    enrolled: 35,
    rating: 4.2,
    type: "전공필수",
    description: "기본적인 자료구조와 알고리즘을 학습합니다.",
  },
  {
    id: 2,
    name: "컴퓨터과학개론",
    professor: "이교수",
    department: "컴퓨터과학과",
    credits: 3,
    time: "월수 9:00-10:30",
    location: "공학관 201",
    capacity: 50,
    enrolled: 45,
    rating: 4.5,
    type: "전공기초",
    description: "컴퓨터과학의 전반적인 개념을 소개합니다.",
  },
  {
    id: 3,
    name: "선형대수학",
    professor: "박교수",
    department: "수학과",
    credits: 3,
    time: "화목 14:00-15:30",
    location: "수학관 102",
    capacity: 30,
    enrolled: 28,
    rating: 3.8,
    type: "교양필수",
    description: "벡터와 행렬의 기본 개념을 학습합니다.",
  },
  {
    id: 4,
    name: "영어회화",
    professor: "Smith",
    department: "영어영문학과",
    credits: 2,
    time: "월수금 15:00-16:00",
    location: "인문관 203",
    capacity: 25,
    enrolled: 20,
    rating: 4.7,
    type: "교양선택",
    description: "실용적인 영어 회화를 연습합니다.",
  },
  {
    id: 5,
    name: "데이터베이스",
    professor: "정교수",
    department: "컴퓨터과학과",
    credits: 3,
    time: "화목 16:00-17:30",
    location: "공학관 401",
    capacity: 35,
    enrolled: 30,
    rating: 4.1,
    type: "전공선택",
    description: "데이터베이스 설계와 관리를 학습합니다.",
  },
];

/* ─────────────────────────────
 *  Utils
 * ───────────────────────────── */

function buildDetails(course: Course): CourseDetail {
  const keywordMap: Record<number, string[]> = {
    1: ["알고리즘", "프로그래밍", "코딩", "문제해결", "데이터처리", "복잡도분석"],
    2: ["입문", "기초", "프로그래밍", "컴퓨팅사고", "소프트웨어", "하드웨어"],
    3: ["수학", "행렬", "벡터", "수치해석", "선형변환", "고유값"],
    4: ["영어", "회화", "커뮤니케이션", "실용영어", "스피킹", "리스닝"],
    5: ["SQL", "데이터관리", "백엔드", "DBMS", "데이터모델링", "쿼리최적화"],
  };

  const rating = course.rating;
  const difficulty: CourseDetail["difficulty"] =
    rating > 4.5 ? "쉬움" : rating > 4.0 ? "보통" : "어려움";

  return {
    ...course,
    prerequisites:
      course.id === 1 ? ["프로그래밍기초"] : course.id === 5 ? ["자료구조"] : [],
    keywords: keywordMap[course.id] || ["기초", "학습", "이론", "실습"],
    assessmentMethod: { midterm: 30, final: 30, assignment: 25, attendance: 15 },
    syllabus: `${course.name}의 강의계획서입니다.`,
    reviews: Math.floor(Math.random() * 50) + 20,
    difficulty,
  };
}

/* ─────────────────────────────
 *  Main Component
 * ───────────────────────────── */

export const CourseSearch: React.FC = () => {
  // query & filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("전체");
  const [selectedDay, setSelectedDay] = useState("전체");
  const [selectedTime, setSelectedTime] = useState("전체");
  const [showFilters, setShowFilters] = useState(false);
  const [sortKey, setSortKey] = useState<"rating" | "name" | "professor" | "capacity">("rating");

  const [filters, setFilters] = useState({
    balancedGeneral: false, // 균형교양
    basicGeneral: false, // 기초교양
    coreGeneral: false, // 핵심교양
    teacherTraining: false, // 교직
    generalElective: false, // 일반선택
    majorRequired: false, // 전공필수
    majorElective: false, // 전공선택
  });

  // data (replace this with backend fetch)
  const [courses] = useState<Course[]>(initialCourses);

  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // filtering
  const filteredCourses = useMemo(() => {
    const lower = searchQuery.toLowerCase().trim();

    let list = courses.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(lower) ||
        c.professor.toLowerCase().includes(lower);
      const matchesDepartment =
        selectedDepartment === "전체" || c.department === selectedDepartment;

      // 요일/시간 필터는 샘플 데이터 포맷(문자열)이라 단순 포함으로 처리
      const matchesDay =
        selectedDay === "전체" || c.time.includes(selectedDay);
      const matchesTime =
        selectedTime === "전체" || c.time.includes(selectedTime.split("(")[0].replace("교시", "").trim());

      return matchesSearch && matchesDepartment && matchesDay && matchesTime;
    });

    // type filters (매핑)
    const activeTypeBadges: string[] = [];
    if (filters.majorRequired) activeTypeBadges.push("전공필수");
    if (filters.majorElective) activeTypeBadges.push("전공선택");
    if (filters.basicGeneral) activeTypeBadges.push("전공기초"); // 예시: 전공기초를 기초교양 필터에 임시 매핑
    if (filters.coreGeneral) activeTypeBadges.push("교양필수");
    if (filters.generalElective) activeTypeBadges.push("교양선택");
    // 균형교양/교직은 샘플에 없으므로 패스(실데이터 매핑 시 수정)

    if (activeTypeBadges.length > 0) {
      list = list.filter((c) => activeTypeBadges.includes(c.type));
    }

    // sorting
    const sorters: Record<typeof sortKey, (a: Course, b: Course) => number> = {
      rating: (a, b) => b.rating - a.rating,
      name: (a, b) => a.name.localeCompare(b.name, "ko"),
      professor: (a, b) => a.professor.localeCompare(b.professor, "ko"),
      capacity: (a, b) =>
        b.capacity - b.enrolled - (a.capacity - a.enrolled),
    };
    list.sort(sorters[sortKey]);

    return list;
  }, [courses, searchQuery, selectedDepartment, selectedDay, selectedTime, filters, sortKey]);

  const handleFilterChange = (key: keyof typeof filters, checked: boolean) => {
    setFilters((prev) => ({ ...prev, [key]: checked }));
  };

  const openDetail = (course: Course) => {
    setSelectedCourse(course);
    setDetailOpen(true);
  };

  return (
    <main className="cs-container">
      <header className="cs-header">
        <h1>강의 검색</h1>
        <p className="muted">키워드와 필터로 원하는 강의를 찾아보세요</p>
      </header>

      {/* Search Bar */}
      <section className="cs-searchbar">
        <div className="cs-searchbar__left">
          <div className="input-icon">
            <Search className="icon" size={16} />
            <Input
              placeholder="강의명, 교수명으로 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="cs-searchbar__right">
          <Button variant="outline" onClick={() => setShowFilters((v) => !v)}>
            <Filter size={16} style={{ marginRight: 8 }} />
            필터
          </Button>
        </div>
      </section>

      {/* Filters */}
      {showFilters && (
        <Card className="cs-filters">
          <CardContent>
            <div className="grid grid--3">
              <div className="field">
                <label className="label">학과</label>
                <SelectNative
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  {departments.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </SelectNative>
              </div>
              <div className="field">
                <label className="label">요일</label>
                <SelectNative
                  value={selectedDay}
                  onChange={(e) => setSelectedDay(e.target.value)}
                >
                  {days.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </SelectNative>
              </div>
              <div className="field">
                <label className="label">시간</label>
                <SelectNative
                  value={selectedTime}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  {times.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </SelectNative>
              </div>
            </div>

            <div className="field" style={{ marginTop: 16 }}>
              <label className="label" style={{ marginBottom: 8 }}>
                강의 유형
              </label>
              <div className="checks">
                {(
                  [
                    ["balancedGeneral", "균형교양"],
                    ["basicGeneral", "기초교양"],
                    ["coreGeneral", "핵심교양"],
                    ["teacherTraining", "교직"],
                    ["generalElective", "일반선택"],
                    ["majorRequired", "전공필수"],
                    ["majorElective", "전공선택"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="check">
                    <Checkbox
                      checked={filters[key]}
                      onChange={(e) =>
                        handleFilterChange(key, e.currentTarget.checked)
                      }
                    />
                    <span>{label}</span>
                  </label>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Result header */}
      <section className="cs-resultbar">
        <p className="muted">총 {filteredCourses.length}개의 강의를 찾았습니다</p>
        <div className="field">
          <SelectNative
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="rating">평점순</option>
            <option value="name">이름순</option>
            <option value="professor">교수순</option>
            <option value="capacity">여석순</option>
          </SelectNative>
        </div>
      </section>

      {/* Results */}
      <section className="cs-results">
        {filteredCourses.map((course) => (
          <Card key={course.id} className="course-card">
            <CardContent>
              <div className="course-card__row">
                <div className="course-card__main">
                  <div className="course-card__title">
                    <h3 className="h3">{course.name}</h3>
                    <Badge variant="secondary">{course.type}</Badge>
                    <div className="rating">
                      <Star size={16} className="rating__icon" />
                      <span className="rating__text">{course.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="muted" style={{ margin: "8px 0 12px" }}>
                    {course.description}
                  </p>

                  <div className="facts">
                    <div className="fact">
                      <User size={16} className="fact__icon" />
                      <span>
                        {course.professor} • {course.credits}학점
                      </span>
                    </div>
                    <div className="fact">
                      <Clock size={16} className="fact__icon" />
                      <span>{course.time}</span>
                    </div>
                    <div className="fact">
                      <MapPin size={16} className="fact__icon" />
                      <span>{course.location}</span>
                    </div>
                  </div>
                </div>

                <div className="course-card__side">
                  <div className="capacity">
                    수강인원: {course.enrolled}/{course.capacity}
                  </div>
                  <div className="actions">
                    <Button variant="outline" size="sm" onClick={() => openDetail(course)}>
                      상세보기
                    </Button>
                    <Button size="sm">수강신청</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Detail Modal */}
      <Modal open={detailOpen} onClose={() => setDetailOpen(false)}>
        {selectedCourse && (
          <div className="detail">
            <div className="detail__header">
              <div>
                <h2 className="h2">{selectedCourse.name}</h2>
                <div className="detail__meta">
                  <Badge variant="secondary">{selectedCourse.type}</Badge>
                  <span className="dot">•</span>
                  <span>{selectedCourse.department}</span>
                </div>
              </div>
              <Button variant="outline" onClick={() => setDetailOpen(false)}>
                닫기
              </Button>
            </div>

            <div className="detail__body">
              <div className="grid grid--2">
                <div className="stack">
                  <div className="fact">
                    <User size={18} className="fact__icon" />
                    <div>
                      <p className="muted small">교수명</p>
                      <p>{selectedCourse.professor}</p>
                    </div>
                  </div>
                  <div className="fact">
                    <BookOpen size={18} className="fact__icon" />
                    <div>
                      <p className="muted small">학점</p>
                      <p>{selectedCourse.credits}학점</p>
                    </div>
                  </div>
                  <div className="fact">
                    <Star size={18} className="rating__icon" />
                    <div>
                      <p className="muted small">평점</p>
                      <p>
                        {selectedCourse.rating.toFixed(1)} (
                        {buildDetails(selectedCourse).reviews}개의 리뷰)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="stack">
                  <div className="fact">
                    <Clock size={18} className="fact__icon" />
                    <div>
                      <p className="muted small">강의 시간</p>
                      <p>{selectedCourse.time}</p>
                    </div>
                  </div>
                  <div className="fact">
                    <MapPin size={18} className="fact__icon" />
                    <div>
                      <p className="muted small">강의실</p>
                      <p>{selectedCourse.location}</p>
                    </div>
                  </div>
                  <div className="fact">
                    <Users size={18} className="fact__icon" />
                    <div>
                      <p className="muted small">수강 정원</p>
                      <p>
                        {selectedCourse.enrolled}/{selectedCourse.capacity}명
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="stack">
                <div className="subsection">
                  <h4 className="h4">
                    <FileText size={16} style={{ marginRight: 6 }} />
                    강의 소개
                  </h4>
                  <p className="muted">{selectedCourse.description}</p>
                </div>

                <Separator />

                <div className="subsection">
                  <h4 className="h4">연관 키워드</h4>
                  <div className="chips">
                    {buildDetails(selectedCourse).keywords.map((k) => (
                      <Badge key={k} variant="secondary" className="chip">
                        {k}
                      </Badge>
                    ))}
                  </div>
                </div>

                {buildDetails(selectedCourse).prerequisites.length > 0 && (
                  <>
                    <Separator />
                    <div className="subsection">
                      <h4 className="h4">선수과목</h4>
                      <div className="chips">
                        {buildDetails(selectedCourse).prerequisites.map((p) => (
                          <Badge key={p} variant="outline" className="chip">
                            {p}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div className="subsection">
                  <h4 className="h4">
                    <Award size={16} style={{ marginRight: 6 }} />
                    평가 방식
                  </h4>
                  <div className="grid grid--2">
                    {Object.entries(buildDetails(selectedCourse).assessmentMethod).map(
                      ([k, v]) => (
                        <div key={k} className="assess">
                          <span className="muted small">
                            {k === "midterm"
                              ? "중간고사"
                              : k === "final"
                              ? "기말고사"
                              : k === "assignment"
                              ? "과제"
                              : "출석"}
                          </span>
                          <span>{v}%</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <Separator />

                <div className="grid grid--2">
                  <div>
                    <p className="muted small mb-4">난이도</p>
                    <Badge
                      variant={
                        buildDetails(selectedCourse).difficulty === "쉬움"
                          ? "secondary"
                          : buildDetails(selectedCourse).difficulty === "보통"
                          ? "outline"
                          : "destructive"
                      }
                    >
                      {buildDetails(selectedCourse).difficulty}
                    </Badge>
                  </div>
                  <div>
                    <p className="muted small mb-4">수강 가능 여부</p>
                    <Badge
                      variant={
                        selectedCourse.enrolled < selectedCourse.capacity
                          ? "default"
                          : "destructive"
                      }
                    >
                      {selectedCourse.enrolled < selectedCourse.capacity
                        ? "수강 가능"
                        : "정원 마감"}
                    </Badge>
                  </div>
                </div>

                <div className="actions actions--modal">
                  <Button
                    block
                    disabled={selectedCourse.enrolled >= selectedCourse.capacity}
                  >
                    수강신청
                  </Button>
                  <Button variant="outline" block>
                    강의계획서 보기
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
};

export default CourseSearch;
