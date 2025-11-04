import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">UniCourse</h1>
      <p className="text-muted-foreground mt-2">대학 강의 추천/검색 포털</p>

      <div className="mt-6 flex gap-3">
        <button className="px-4 py-2 rounded bg-primary text-white" onClick={() => navigate("/login")}>로그인</button>
        <Link to="/signup" className="px-4 py-2 rounded border">회원가입</Link>
      </div>
    </div>
  );
};

export default Home;
