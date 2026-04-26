import React from 'react';
import './components.css';

export interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
}

const colors = ['#4f46e5', '#0891b2', '#059669', '#d97706', '#dc2626', '#7c3aed'];

export const Avatar = ({ src, name, size = 'md', color }: AvatarProps) => {
  const bg = color || colors[name.charCodeAt(0) % colors.length];
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return src ? (
    <img className={`avatar avatar--${size}`} src={src} alt={name} />
  ) : (
    <div className={`avatar avatar--${size}`} style={{ background: bg }} title={name}>
      {initials}
    </div>
  );
};
