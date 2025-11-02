import React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input: React.FC<InputProps> = ({ className = "", ...props }) => (
  <input className={["input", className].join(" ")} {...props} />
);

export default Input;

