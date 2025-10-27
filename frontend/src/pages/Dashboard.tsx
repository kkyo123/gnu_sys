import React from 'react';
import './Dashboard.css';


interface StatBoxProps {
  label: string;
  value: string;
  subValue?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, subValue }) => (
  <div className="stat-box">
    <div className="stat-label">{label}</div>
    <div className="stat-value">{value}</div>
    {subValue && <div className="stat-subvalue">{subValue}</div>}
  </div>
);

interface CourseItemProps {
  name: string;
  color: string;
  credits: string;
  grade: string;
}

const CourseItem: React.FC<CourseItemProps> = ({ name, color, credits, grade }) => (
  <div className="course-item">
    <div className="course-info">
      <div className="course-color" style={{ backgroundColor: color }}></div>
      <div className="course-name">{name}</div>
    </div>
    <div className="course-grade">
      <div className="grade-badge">{credits}</div>
      <div className="grade-text">{grade}</div>
    </div>
  </div>
);

interface ClassItemProps {
  name: string;
  room: string;
  color: string;
  gridRow?: string;
}

const ClassItem: React.FC<ClassItemProps> = ({ name, room, color, gridRow }) => (
  <div className={`class-item ${color}`} style={{ gridRow }}>
    <div className="class-name">{name}</div>
    <div className="class-room">{room}</div>
  </div>
);

interface NoticeItemProps {
  title: string;
  date: string;
  badge?: string;
  badgeType?: string;
}

const NoticeItem: React.FC<NoticeItemProps> = ({ title, date, badge, badgeType }) => (
  <div className="notice-item">
    <div className="notice-content">
      {badge && <span className={`badge ${badgeType}`}>{badge}</span>}
      <span className="notice-title">{title}</span>
    </div>
    <div className="notice-date">{date}</div>
  </div>
);

const App: React.FC = () => {
  const courses = [
    { name: '자료구조', color: '#4A90E2', credits: '3학점', grade: 'A+' },
    { name: '웹프로그래밍', color: '#F5A623', credits: '3학점', grade: 'A0' },
    { name: '선형대수학', color: '#BD10E0', credits: '3학점', grade: 'B+' },
    { name: '영어회화', color: '#7ED321', credits: '3학점', grade: 'A+' }
  ];

  const notices = [
    { title: '2024-2학기 전공 수강신청 안내', date: '2024.10.10', badge: '중요', badgeType: 'important' },
    { title: '학과 MT 참가 신청 안내', date: '2024.10.08' },
    { title: '캡스톤 디자인 프로젝트 설명회', date: '2024.10.05', badge: '중요', badgeType: 'important' },
    { title: '산학협력 기업 초청 세미나', date: '2024.10.03' },
    { title: '학과 동아리 신입생 모집', date: '2024.10.01' }
  ];

  const updates = [
    { title: '강의 추천 알고리즘 업데이트', date: '2024.10.15', badge: '업데이트', badgeType: 'update' },
    { title: '모바일 앱 출시 예정 안내', date: '2024.10.12', badge: '공지', badgeType: 'notice' },
    { title: '시간표 PDF 내보내기 기능 추가', date: '2024.10.10', badge: '신규', badgeType: 'new' },
    { title: '강의평 작성 이벤트 진행 중', date: '2024.10.08', badge: '이벤트', badgeType: 'event' },
    { title: '서비스 점검 안내 (10/20)', date: '2024.10.05', badge: '점검', badgeType: 'maintenance' }
  ];

  return (
    <div className="container">
      <div className="main-content">
        {/* 이번 학기 학점 현황 */}
        <div className="card">
          <div className="card-header">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <h2 className="card-title">이번 학기 학점 현황</h2>
          </div>
          <p className="card-subtitle">2024학년도 2학기 성적 진행 상황</p>

          <div className="stats-grid">
            <StatBox label="현재 평점" value="3.8" subValue="/ 4.5" />
            <StatBox label="신청 학점" value="18" subValue="학점" />
          </div>

          <div className="progress-section">
            <div className="progress-header">
              <span>진행 중인 학점</span>
              <span>12/18</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill"></div>
            </div>
          </div>

          <div className="courses-section">
            <h3 className="section-title">수강 중인 강의</h3>
            {courses.map((course, idx) => (
              <CourseItem key={idx} {...course} />
            ))}
          </div>

          <button className="view-all-btn">
            전체 성적 보기
            <span>→</span>
          </button>
        </div>

        {/* 이번 학기 시간표 */}
        <div className="card">
          <div className="card-header">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth={2}/>
              <line x1="16" y1="2" x2="16" y2="6" strokeWidth={2}/>
              <line x1="8" y1="2" x2="8" y2="6" strokeWidth={2}/>
              <line x1="3" y1="10" x2="21" y2="10" strokeWidth={2}/>
            </svg>
            <h2 className="card-title">이번 학기 시간표</h2>
          </div>
          <p className="schedule-header">주간 강의 일정</p>

          <div className="calendar">
            <div></div>
            <div className="day-header">월</div>
            <div className="day-header">화</div>
            <div className="day-header">수</div>
            <div className="day-header">목</div>
            <div className="day-header">금</div>

            <div className="time-slot">⏰ 09:00</div>
            <ClassItem name="자료구조" room="공학관 305" color="blue" />
            <div></div>
            <ClassItem name="자료구조" room="공학관 305" color="blue" />
            <div></div>
            <div></div>

            <div className="time-slot">⏰ 10:00</div>
            <div></div>
            <ClassItem name="선형대수학" room="수학관 102" color="purple" />
            <div></div>
            <ClassItem name="선형대수학" room="수학관 102" color="purple" />
            <div></div>

            <div className="time-slot">⏰ 11:00</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>

            <div className="time-slot">⏰ 12:00</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>

            <div className="time-slot">⏰ 13:00</div>
            <ClassItem name="영어회화" room="인문관 203" color="green" />
            <div></div>
            <div></div>
            <div></div>
            <ClassItem name="영어회화" room="인문관 203" color="green" />

            <div className="time-slot">⏰ 14:00</div>
            <div></div>
            <div></div>
            <ClassItem name="웹프로그래밍" room="공학관 401" color="yellow" />
            <div></div>
            <div></div>

            <div className="time-slot">⏰ 15:00</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>

            <div className="time-slot">⏰ 16:00</div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>

          <button className="view-all-btn">
            시간표 변경하기
            <span>→</span>
          </button>
        </div>

        {/* 학과 공지사항 */}
        <div className="card">
          <div className="card-header">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <h2 className="card-title">학과 공지사항</h2>
          </div>
          <p className="card-subtitle">컴퓨터과학과 최신 소식</p>

          <div className="notices-list">
            {notices.map((notice, idx) => (
              <NoticeItem key={idx} {...notice} />
            ))}
          </div>

          <button className="view-all-btn">
            전체 공지 보기
            <span>→</span>
          </button>
        </div>

        {/* 서비스 업데이트 */}
        <div className="card">
          <div className="card-header">
            <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
            </svg>
            <h2 className="card-title">서비스 업데이트</h2>
          </div>
          <p className="card-subtitle">UniCourse 새로운 소식</p>

          <div className="updates-list">
            {updates.map((update, idx) => (
              <NoticeItem key={idx} {...update} />
            ))}
          </div>

          <button className="view-all-btn">
            전체 업데이트 보기
            <span>→</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;