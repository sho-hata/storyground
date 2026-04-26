import React from 'react';
import { Avatar } from './Avatar';
import { Button } from './Button';
import './components.css';

export interface NavbarProps {
  brand?: string;
  links?: { label: string; active?: boolean }[];
  userName?: string;
  userAvatar?: string;
}

export const Navbar = ({
  brand = 'Acme Inc.',
  links = [
    { label: 'ダッシュボード', active: true },
    { label: 'プロジェクト' },
    { label: 'チーム' },
    { label: '設定' },
  ],
  userName = 'Taro',
  userAvatar,
}: NavbarProps) => (
  <nav className="navbar">
    <span className="navbar__brand">{brand}</span>
    <ul className="navbar__links">
      {links.map((link) => (
        <li key={link.label}>
          <a className={`navbar__link ${link.active ? 'navbar__link--active' : ''}`}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
    <div className="navbar__actions">
      <Button variant="primary" size="sm" label="新規作成" icon="＋" />
      <Avatar name={userName} src={userAvatar} size="sm" />
    </div>
  </nav>
);
