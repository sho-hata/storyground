import React from "react";
import "./components.css";

export interface BadgeProps {
  label: string;
  variant?: "info" | "success" | "warning" | "error" | "neutral";
  dot?: boolean;
}

export const Badge = ({ label, variant = "neutral", dot = false }: BadgeProps) => (
  <span className={`badge badge--${variant}`}>
    {dot && (
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "currentColor" }} />
    )}
    {label}
  </span>
);
