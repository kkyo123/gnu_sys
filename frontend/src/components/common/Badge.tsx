import React from "react";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "outline" | "destructive";
};

export const Badge: React.FC<BadgeProps> = ({ className = "", variant = "default", ...props }) => (
  <span className={["badge", `badge--${variant}`, className].join(" ")} {...props} />
);

export default Badge;

