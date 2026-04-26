import React from "react";
import "./components.css";

export interface AlertProps {
  variant?: "info" | "success" | "warning" | "error";
  title: string;
  message?: string;
}

const icons: Record<string, string> = {
  info: "ℹ️",
  success: "✅",
  warning: "⚠️",
  error: "❌",
};

export const Alert = ({ variant = "info", title, message }: AlertProps) => (
  <div className={`alert alert--${variant}`} style={{ maxWidth: 420 }}>
    <span className="alert__icon">{icons[variant]}</span>
    <div className="alert__content">
      <div className="alert__title">{title}</div>
      {message && <div className="alert__message">{message}</div>}
    </div>
  </div>
);
