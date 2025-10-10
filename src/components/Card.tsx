import React from "react";

type CardProps = {
  title: string;
  description: string;
};

const Card: React.FC<CardProps> = ({ title, description }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
        marginBottom: "12px",
      }}
    >
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
};

export default Card;
