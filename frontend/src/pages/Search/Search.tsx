import React, { useState } from 'react';
import './Search.css';

interface Course {
  id: number;
  name: string;
  code: string;
  professor: string;
  credits: number;
  category: string;
  time: string;
  location: string;
  capacity: number;
  enrolled: number;
  rating: number;
  semester: string;
}

interface SearchProps {
  userData?: any;
}

export function Search({ userData }: SearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [selectedCredits, setSelectedCredits] = useState('전체');

  const categories = ['전체', '전공필수', '전공선택', '교양필수', '교양선택'];
  const creditOptions = ['전체', '1학점', '2학점', '3학점', '4학점'];

  const allCourses: Course[] = [
    {
      id: 1,
      name: '자료구조',
      code: 'CS201',
      professor: '김교수',
      credits: 3,
      category: '전공필수',
      time: '월수 09:00-10:30',
      location: '공학관 305',
      capacity: 50,
      enrolled: 45,
      rating: 4.5,
      semester: '2024-2'
    },
    {
      id: 2,
      name: '웹프로그래밍',
      code: 'CS305',
      professor: '이교수',
      credits: 3,
      category: '전공선택',
      time: '수 14:00-15:30',
      location: '공학관 401',
      capacity: 40,
      enrolled: 38,
      rating: 4.8,
      semester: '2024-2'
    },
    {
      id: 3,
      name: '선형대수학',
      code: 'MATH201',
      professor: '박교수',
      credits: 3,
      category: '전공필수',
      time: '화목 10:30-12:00',
      location: '수학관 102',
      capacity: 60,
      enrolled: 52,
      rating: 4.2,
      semester: '2024-2'
    },
    {
      id: 4,
      name: '영어회화',
      code: 'ENG101',
      professor: '최교수',
      credits: 3,
      category: '교양필수',
      time: '월금 13:00-14:30',
      location: '인문관 203',
      capacity: 30,
      enrolled: 28,
      rating: 4.6,
      semester: '2024-2'
    },
    {
      id: 5,
      name: '데이터베이스',
      code: 'CS301',
      professor: '정교수',
      credits: 3,
      category: '전공필수',
      time: '화목 14:00-15:30',
      location: '공학관 502',
      capacity: 45,
      enrolled: 40,
      rating: 4.4,
      semester: '2024-2'
    },
    {
      id: 6,
      name: '알고리즘',
      code: 'CS202',
      professor: '강교수',
      credits: 3,
      category: '전공필수',
      time: '월수 10:30-12:00',
      location: '공학관 201',
      capacity: 50,
      enrolled: 48,
      rating: 4.3,
      semester: '2024-2'
    },
    {
      id: 7,
      name: '운영체제',
      code: 'CS302',
      professor: '한교수',
      credits: 3,
      category: '전공선택',
      time: '화목 09:00-10:30',
      location: '공학관 405',
      capacity: 40,
      enrolled: 35,
      rating: 4.1,
      semester: '2024-2'
    },
    {
      id: 8,
      name: '인공지능개론',
      code: 'CS401',
      professor: '유교수',
      credits: 3,
      category: '전공선택',
      time: '수금 13:00-14:30',
      location: '공학관 601',
      capacity: 35,
      enrolled: 33,
      rating: 4.9,
      semester: '2024-2'
    }
  ];

  const filteredCourses = allCourses.filter(course => {
    const matchesSearch = course.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.professor.includes(searchTerm);
    const matchesCategory = selectedCategory === '전체' || course.category === selectedCategory;
    const matchesCredits = selectedCredits === '전체' || course.credits === parseInt(selectedCredits[0]);
    
    return matchesSearch && matchesCategory && matchesCredits;
  });

  const getEnrollmentStatus = (course: Course) => {
    const ratio = course.enrolled / course.capacity;
    if (ratio >= 0.9) return { text: '마감임박', class: 'status-danger' };
    if (ratio >= 0.7) return { text: '여석부족', class: 'status-warning' };
    return { text: '여유', class: 'status-available' };
  };

  const getRatingStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  return (
    <div className="search-page">
      <div className="container">
        <div className="header">
          <h1>강의 검색</h1>
          <p className="subtitle">원하는 강의를 검색하고 수강신청하세요</p>
        </div>

        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="search-bar-container">
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <circle cx="11" cy="11" r="8" strokeWidth={2}/>
              <path d="m21 21-4.35-4.35" strokeWidth={2}/>
            </svg>
            <input
              type="text"
              className="search-input"
              placeholder="강의명, 강의코드, 교수명으로 검색하세요..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filters">
            <div className="filter-group">
              <label className="filter-label">구분</label>
              <div className="filter-buttons">
                {categories.map(category => (
                  <button
                    key={category}
                    className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <label className="filter-label">학점</label>
              <div className="filter-buttons">
                {creditOptions.map(credit => (
                  <button
                    key={credit}
                    className={`filter-btn ${selectedCredits === credit ? 'active' : ''}`}
                    onClick={() => setSelectedCredits(credit)}
                  >
                    {credit}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div className="results-section">
          <div className="results-header">
            <h2 className="results-title">
              검색 결과 <span className="results-count">{filteredCourses.length}건</span>
            </h2>
            <div className="sort-options">
              <button className="sort-btn active">인기순</button>
              <button className="sort-btn">평점순</button>
              <button className="sort-btn">강의명순</button>
            </div>
          </div>

          <div className="course-grid">
            {filteredCourses.length > 0 ? (
              filteredCourses.map(course => {
                const status = getEnrollmentStatus(course);
                return (
                  <div key={course.id} className="course-card">
                    <div className="course-card-header">
                      <div className="course-code-badge">{course.code}</div>
                      <div className={`enrollment-status ${status.class}`}>
                        {status.text}
                      </div>
                    </div>

                    <h3 className="course-title">{course.name}</h3>
                    
                    <div className="course-info-grid">
                      <div className="info-item">
                        <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{course.professor}</span>
                      </div>
                      
                      <div className="info-item">
                        <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{course.time}</span>
                      </div>
                      
                      <div className="info-item">
                        <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{course.location}</span>
                      </div>
                      
                      <div className="info-item">
                        <svg className="info-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span>{course.credits}학점</span>
                      </div>
                    </div>

                    <div className="course-category-badge">{course.category}</div>

                    <div className="course-footer">
                      <div className="rating">
                        <span className="stars">{getRatingStars(course.rating)}</span>
                        <span className="rating-value">{course.rating}</span>
                      </div>
                      
                      <div className="enrollment-info">
                        <span className="enrolled-count">{course.enrolled}/{course.capacity}</span>
                        <div className="enrollment-bar">
                          <div 
                            className="enrollment-fill"
                            style={{ width: `${(course.enrolled / course.capacity) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    <button className="add-course-btn">
                      <svg className="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      수강신청
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="no-results">
                <svg className="no-results-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <circle cx="11" cy="11" r="8" strokeWidth={2}/>
                  <path d="m21 21-4.35-4.35" strokeWidth={2}/>
                </svg>
                <p className="no-results-text">검색 결과가 없습니다</p>
                <p className="no-results-subtext">다른 검색어를 입력해보세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}