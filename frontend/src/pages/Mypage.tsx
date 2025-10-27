import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

const Mypage = () => {

  const navigate = useNavigate();

  return (
    <div>
      <h2>Mypage</h2>
      <p> 마이페이지입니다.</p>

      <main style={{ padding: "16px" }}>        
        {/* 대시보드로 이동하는 버튼 */}
        <Button 
          label="/home 으로 이동" 
          onClick={() => navigate("/home")} 
        />
      </main>

    </div>
  );
};

export default Mypage;