import React from "react";
import "./components.css";

export interface InputProps {
  label: string;
  placeholder?: string;
  type?: "text" | "email" | "password";
  hint?: string;
  error?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const Input = ({
  label,
  placeholder,
  type = "text",
  hint,
  error,
  value,
  onChange,
}: InputProps) => (
  <div className="input-group">
    <label className="input-label">{label}</label>
    <input
      className={`input ${error ? "input--error" : ""}`}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    {error ? (
      <span className="input-hint" style={{ color: "#ef4444" }}>
        {error}
      </span>
    ) : hint ? (
      <span className="input-hint">{hint}</span>
    ) : null}
  </div>
);
