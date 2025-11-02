import React from "react";

export const Checkbox: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({
  className = "",
  ...props
}) => <input type="checkbox" className={["checkbox", className].join(" ")} {...props} />;

export default Checkbox;

