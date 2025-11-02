import React, { ReactNode, useMemo } from "react";
import "./LectureCard.css";

export type CourseOut = {
  requirement_id?: string | null;
  category?: string | null;          // 전공필수/전공선택/핵심/균형/기초 등
  course_name?: string | null;
  course_code?: string | null;
  professor?: string | null;
  group?: string | null;             // 전공/교양/일반선택/교직
  year?: number | null;
  major_track?: string | null;       // 컴퓨터 과학/컴퓨터 소프트웨어/빅데이터
  general_type?: string | null;      // 핵심 교양/균형 교양/기초 교양/일반선택·교직
  source_collection?: string | null; // 데이터 출처
  source_sheet?: string | null;
  설명란?: string | null;
  비고?: string | null;
};

type Props = {
  course: CourseOut;
  /** 카드 전체 클릭 동작 (선택/상세 모달 등) */
  onClick?: () => void;
  /** 우측 상단 액션(즐겨찾기 버튼 등) */
  actions?: ReactNode;
  /** 검색어 하이라이트(여러 개 가능) */
  highlight?: string[]; // ex) ["알고리즘","홍길동"]
  /** 조밀한 레이아웃 */
  dense?: boolean;
  /** 출처 태그 숨기기 */
  hideSource?: boolean;
};

export default function LectureCard({
  course,
  onClick,
  actions,
  highlight = [],
  dense = false,
  hideSource = false,
}: Props) {
  const {
    course_name,
    course_code,
    professor,
    group,
    category,
    general_type,
    major_track,
    year,
    설명란,
    비고,
    source_collection,
  } = course;

  const title = useMemo(
    () => joinNonEmpty([course_name, course_code ? `(${course_code})` : ""]),
    [course_name, course_code]
  );

  const sub = useMemo(
    () => joinNonEmpty([professor ? `담당: ${professor}` : "", year ? `${year}년` : ""]),
    [professor, year]
  );

  const tags = useMemo(
    () =>
      [
        group && { label: group, tone: toneByGroup(group) },
        // 우선순위: category > general_type
        (category || general_type) && {
          label: (category ?? general_type)!,
          tone: "neutral",
        },
        major_track && { label: major_track, tone: "blue" },
      ].filter(Boolean) as Tag[],
    [group, category, general_type, major_track]
  );

  return (
    <article
      className={`lec-card ${dense ? "lec-card--dense" : ""} ${onClick ? "lec-card--clickable" : ""}`}
      onClick={onClick}
      role={onClick ? "button" : "article"}
      tabIndex={onClick ? 0 : -1}
      data-testid="lecture-card"
    >
      <header className="lec-card__header">
        <h3 className="lec-card__title" dangerouslySetInnerHTML={{ __html: highlightText(title, highlight) }} />
        {actions && <div className="lec-card__actions" onClick={stop}><span>{actions}</span></div>}
      </header>

      {sub && (
        <p
          className="lec-card__subtitle"
          dangerouslySetInnerHTML={{ __html: highlightText(sub, highlight) }}
        />
      )}

      {tags.length > 0 && (
        <ul className="lec-card__tags">
          {tags.map((t, i) => (
            <li key={i} className={`tag tag--${t.tone}`}>{t.label}</li>
          ))}
        </ul>
      )}

      {(설명란 || 비고) && (
        <p
          className="lec-card__desc"
          title={설명란 ?? 비고 ?? undefined}
          dangerouslySetInnerHTML={{
            __html: highlightText((설명란 ?? 비고 ?? "").slice(0, 160)),
          }}
        />
      )}

      {!hideSource && source_collection && (
        <footer className="lec-card__footer">
          <span className="lec-card__source" title="데이터 출처">{source_collection}</span>
        </footer>
      )}
    </article>
  );
}

/* ------------------------- 내부 유틸/타입 ------------------------- */

type Tag = { label: string; tone: "major" | "general" | "neutral" | "blue" };

function joinNonEmpty(parts: (string | undefined | null)[], sep = " ") {
  return parts.filter(Boolean).join(sep).trim();
}

function toneByGroup(group: string): Tag["tone"] {
  if (group.includes("전공")) return "major";
  if (group.includes("교양")) return "general";
  return "neutral";
}

function esc(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** 간단 하이라이트: 대소문자 무시, 여러 키워드, HTML 안전 */
function highlightText(text: string, words: string[] = []) {
  if (!text || words.length === 0) return escapeHtml(text);
  const uniq = Array.from(new Set(words.filter(Boolean)));
  if (uniq.length === 0) return escapeHtml(text);

  const pattern = new RegExp(uniq.map(w => esc(w)).join("|"), "gi");
  return escapeHtml(text).replace(pattern, (m) => `<mark class="lec-hl">${m}</mark>`);
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function stop(e: React.MouseEvent) {
  e.stopPropagation();
}

/* ------------------------ 스켈레톤 (선택) ------------------------ */

export function LectureCardSkeleton({ dense = false }: { dense?: boolean }) {
  return (
    <article className={`lec-card ${dense ? "lec-card--dense" : ""}`}>
      <header className="lec-card__header">
        <div className="skeleton sk-title" />
      </header>
      <div className="skeleton sk-sub" />
      <div className="sk-tags">
        <span className="skeleton sk-tag" />
        <span className="skeleton sk-tag" />
        <span className="skeleton sk-tag" />
      </div>
      <div className="skeleton sk-desc" />
    </article>
  );
}
