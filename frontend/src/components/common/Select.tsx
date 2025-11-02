import React from "react";

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({
  className = "",
  children,
  ...props
}) => (
  <select className={["select", className].join(" ")} {...props}>
    {children}
  </select>
);

export default Select;

