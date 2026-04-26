import React from 'react';
import './components.css';

export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  label: string;
  disabled?: boolean;
  icon?: string;
  onClick?: () => void;
}

export const Button = ({
  variant = 'primary',
  size = 'md',
  label,
  disabled = false,
  icon,
  onClick,
}: ButtonProps) => (
  <button
    className={`btn btn--${variant} btn--${size}`}
    disabled={disabled}
    onClick={onClick}
  >
    {icon && <span>{icon}</span>}
    {label}
  </button>
);
