import React from "react";
import Header from "../components/Header";
import Card from "../components/Card";
import Button from "../components/Button";

const Home = () => {
  const cards = [
    { title: "첫 번째 카드", description: "설명 텍스트" },
    { title: "두 번째 카드", description: "설명 텍스트" },
  ];

  return (
    <div>
      <main style={{ padding: "16px" }}>
        {cards.map((c, i) => (
          <Card key={i} title={c.title} description={c.description} />
        ))}
        <Button label="클릭" onClick={() => alert("버튼 클릭!")} />
        <div className="bg-red-500 text-white p-4">Tailwind Test</div>
      </main>
    </div>
    
  );
};

export default Home;
