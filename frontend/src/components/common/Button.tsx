import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "destructive";
  size?: "sm" | "md";
  block?: boolean;
};

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  block,
  className = "",
  ...props
}) => (
  <button
    className={[
      "btn",
      `btn--${variant}`,
      `btn--${size}`,
      block ? "btn--block" : "",
      className,
    ].join(" ")}
    {...props}
  />
);

export default Button;

