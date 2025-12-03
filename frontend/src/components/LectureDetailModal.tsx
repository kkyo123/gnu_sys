import React, { useMemo, useState } from "react";
import "./LectureDetailModal.css";
import type { CourseOut } from "./lectureCard";

type SourceTab = "custom" | "system" | "graduation" | "current";

type Props = {
  open: boolean;
  onClose: () => void;
  course: CourseOut | null;
  studentId: string;
  sourceTab: SourceTab;
  token?: string | null;
};

const SEMESTER_OPTIONS = [
  "2021-1",
  "2021-2",
  "2022-1",
  "2022-2",
  "2023-1",
  "2023-2",
  "2024-1",
  "2024-2",
  "2025-1",
  "2025-2",
];

const API_BASE = (import.meta as any).env.VITE_API_BASE_URL as string;

// Authorization 포함한 헤더 생성 함수
const buildHeaders = (token?: string | null): HeadersInit => {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
};

const LectureDetailModal: React.FC<Props> = ({
  open,
  onClose,
  course,
  studentId,
  sourceTab,
  token,
}) => {
  const [selectedSemester, setSelectedSemester] = useState("");
  const [loading, setLoading] = useState(false);

  console.log("🧪 [Modal render] open:", open, "course:", course);

  // ----- Display Info (course가 null이어도 안전하게 처리) -----

  const codeWithClass = useMemo(() => {
    if (!course) return "-";
    const anyCourse = course as any;
    const cls = anyCourse.class as string | undefined;
    if (course.course_code && cls) return `${course.course_code}-${cls}`;
    return course.course_code ?? "-";
  }, [course]);

  const typeLabel = useMemo(() => {
    if (!course) return "구분 미정";
    return (
      course.group ||
      course.category ||
      course.general_type ||
      "구분 미정"
    );
  }, [course]);

  const credits = useMemo(() => {
    if (!course) return 0;
    const anyCourse = course as any;
    if (typeof anyCourse.credits === "number") return anyCourse.credits;

    const period = (anyCourse.period as string | undefined) ?? "";
    const digits = period.replace(/[^0-9]/g, "");
    if (!digits) return 0;
    return digits.length;
  }, [course]);

  const timeLabel = useMemo(() => {
    if (!course) return "-";
    const anyCourse = course as any;
    const day = (anyCourse.day as string | undefined) ?? "";
    const period = (anyCourse.period as string | undefined) ?? "";
    if (!day || !period) return "-";
    const digits = period.replace(/[^0-9]/g, "");
    if (!digits) return day;
    const start = digits[0];
    const end = digits[digits.length - 1];
    return `${day} ${start}-${end}교시`;
  }, [course]);

  const keywords = useMemo(() => {
    if (!course) return [];
    const anyCourse = course as any;
    return [
      anyCourse.plan_keyword,
      anyCourse.test_keyword,
      anyCourse.assignment_keyword,
    ]
      .filter(Boolean)
      .map(String);
  }, [course]);

  const description = useMemo(() => {
    if (!course) return "강의 소개 내용이 아직 등록되지 않았습니다.";
    const anyCourse = course as any;
    return (
      anyCourse.설명란 ||
      anyCourse.description ||
      "강의 소개 내용이 아직 등록되지 않았습니다."
    );
  }, [course]);

  // ----- Close Control -----
  const handleOverlayClick = () => {
    if (!loading) onClose();
  };

  const handleInnerClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();
  };

  // 📌 관심과목 등록
  const handleAddInterest = async () => {
    if (!course || !course.course_code) {
      window.alert("과목 코드가 없어 등록할 수 없습니다.");
      return;
    }

    const payload = {
      student_id: studentId,
      tab: sourceTab,
      course_code: course.course_code,
      course_name: course.course_name ?? "",
      professor: course.professor ?? "",
      credits,
    };

    console.log("📡 [interest] payload:", payload);

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/mypage/interest`, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("📥 [interest] status:", res.status, "response:", text);

      if (!res.ok) {
        window.alert(`관심과목 등록 실패! (status ${res.status})`);
        return;
      }

      window.alert("관심과목 등록 완료!");
    } catch (err) {
      console.error(err);
      window.alert("관심과목 등록 중 오류 발생!");
    } finally {
      setLoading(false);
    }
  };

  // 📌 이수 이력 등록
  const handleAddHistory = async () => {
    if (!course || !course.course_code) {
      window.alert("과목 코드가 없어 등록할 수 없습니다.");
      return;
    }
    if (!selectedSemester) {
      window.alert("학기를 선택해 주세요.");
      return;
    }

    const payload = {
      student_id: studentId,
      semester: selectedSemester,
      course: {
        course_code: course.course_code,
        course_name: course.course_name ?? "",
        category: course.category ?? course.general_type ?? "",
        credits,
      },
    };

    console.log("📡 [history] payload:", payload);

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/mypage/history`, {
        method: "POST",
        headers: buildHeaders(token),
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      console.log("📥 [history] status:", res.status, "response:", text);

      if (!res.ok) {
        window.alert(`이수 이력 등록 실패! (status ${res.status})`);
        return;
      }

      window.alert("이수 이력 등록 완료!");
    } catch (err) {
      console.error(err);
      window.alert("이수 이력 등록 중 오류 발생!");
    } finally {
      setLoading(false);
    }
  };

  // 🔚 여기서 조기 리턴 — 훅은 이미 다 호출됨
  if (!open || !course) {
    return null;
  }

  return (
    <div className="lec-modal-overlay" onClick={handleOverlayClick}>
      <div className="lec-modal" onClick={handleInnerClick}>
        {/* HEADER */}
        <header className="lec-modal__header">
          <div className="lec-modal__title-row">
            <h2 className="lec-modal__title">{course.course_name}</h2>
            <span className="lec-modal__badge">{typeLabel}</span>
          </div>
          <div className="lec-modal__subtitle">
            <span>{codeWithClass}</span>
          </div>
        </header>

        {/* TOP INFO */}
        <section className="lec-modal__info-row">
          <div className="lec-modal__info-item">
            <div className="lec-modal__info-label">교수명</div>
            <div className="lec-modal__info-value">
              {course.professor || "-"}
            </div>
          </div>
          <div className="lec-modal__info-item">
            <div className="lec-modal__info-label">학점</div>
            <div className="lec-modal__info-value">
              {credits ? `${credits}학점` : "-"}
            </div>
          </div>
          <div className="lec-modal__info-item">
            <div className="lec-modal__info-label">강의시간</div>
            <div className="lec-modal__info-value">{timeLabel}</div>
          </div>
        </section>

        <div className="lec-modal__divider" />

        {/* DESCRIPTION */}
        <section className="lec-modal__section">
          <h3 className="lec-modal__section-title">강의 소개</h3>
          <p className="lec-modal__description">{description}</p>
        </section>

        {keywords.length > 0 && (
          <>
            <div className="lec-modal__divider" />
            <section className="lec-modal__section">
              <h3 className="lec-modal__section-title">연관 키워드</h3>
              <div className="lec-modal__chips">
                {keywords.map((k) => (
                  <span key={k} className="lec-modal__chip">
                    {k}
                  </span>
                ))}
              </div>
            </section>
          </>
        )}

        <div className="lec-modal__divider" />

        {/* FOOTER */}
        <section className="lec-modal__footer">
          <div className="lec-modal__history">
            <select
              className="lec-modal__select"
              value={selectedSemester}
              onChange={(e) => setSelectedSemester(e.target.value)}
            >
              <option value="">학기 선택</option>
              {SEMESTER_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace("-", "년 ")}학기
                </option>
              ))}
            </select>
            <button
              className="lec-modal__btn lec-modal__btn-primary"
              onClick={handleAddHistory}
              disabled={loading}
            >
              이수 이력 등록
            </button>
          </div>

          <button
            className="lec-modal__btn lec-modal__btn-outline"
            onClick={handleAddInterest}
            disabled={loading}
          >
            관심과목
          </button>
        </section>
      </div>
    </div>
  );
};

export default LectureDetailModal;
