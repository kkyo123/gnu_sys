import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import LectureCard from "../components/lectureCard"; // 추가

const Home = () => {
  const navigate = useNavigate();

    // 샘플 강의 데이터
  const sampleCourse = {
    course_name: "운영체제",
    course_code: "CSE301",
    professor: "이교수",
    group: "전공",
    category: "전공필수",
    major_track: "컴퓨터 과학",
    year: 2025,
    설명란: "프로세스, 메모리, 파일시스템, 스케줄링 등 운영체제의 핵심 개념을 학습한다.",
    비고: "3학점 | 실습 포함",
    source_collection: "courses_2025_major_sci",
  };

  return (
    <div>
      <main style={{ padding: "16px" }}>
        
        {/* LectureCard 추가 */}
        <div style={{ marginTop: "24px" }}>
          <h3 style={{ fontWeight: 600, marginBottom: "12px" }}>강의 카드 미리보기</h3>
          <LectureCard
            course={sampleCourse}
            highlight={["운영체제", "이교수"]}
            onClick={() => alert("LectureCard 클릭!")}
            actions={<button>⭐</button>}
          />
        </div>

        {/* 버튼들 */}
        <Button label="클릭" onClick={() => alert("버튼 클릭!")} />
        <Button label="대시보드로 이동" onClick={() => navigate("/dashboard")} />

      </main>
    </div>
  );
};

export default Home;
