import React, { useState } from 'react';
import { Navbar } from './Navbar';
import { Avatar } from './Avatar';
import { Input } from './Input';
import { Button } from './Button';
import './components.css';

export interface SettingsPageProps {
  userName?: string;
}

const tabs = ['プロフィール', '通知', 'チーム', '請求'] as const;

const Toggle = ({ label, defaultOn = false }: { label: string; defaultOn?: boolean }) => {
  const [on, setOn] = useState(defaultOn);
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
      <span style={{ fontSize: 14 }}>{label}</span>
      <button
        onClick={() => setOn(!on)}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: on ? '#4f46e5' : '#d1d5db', position: 'relative', transition: 'background 0.2s',
        }}
      >
        <span style={{
          position: 'absolute', top: 2, left: on ? 22 : 2,
          width: 20, height: 20, borderRadius: '50%', background: '#fff',
          transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
        }} />
      </button>
    </div>
  );
};

export const SettingsPage = ({ userName = '太郎' }: SettingsPageProps) => {
  const [activeTab, setActiveTab] = useState<typeof tabs[number]>('プロフィール');

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      <Navbar userName={userName} />

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>設定</h1>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 0, borderBottom: '2px solid #e5e7eb', marginBottom: 32 }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px', fontSize: 14, fontWeight: 600, border: 'none', cursor: 'pointer',
                background: 'transparent',
                color: activeTab === tab ? '#4f46e5' : '#6b7280',
                borderBottom: activeTab === tab ? '2px solid #4f46e5' : '2px solid transparent',
                marginBottom: -2,
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'プロフィール' && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
            {/* Avatar section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, paddingBottom: 24, borderBottom: '1px solid #f3f4f6' }}>
              <Avatar name="山田太郎" src="https://i.pravatar.cc/150?u=taro" size="xl" />
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>山田太郎</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>senior-designer@example.com</div>
                <Button variant="outline" size="sm" label="写真を変更" />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Input label="名前" placeholder="太郎" />
                <Input label="姓" placeholder="山田" />
              </div>
              <Input label="メールアドレス" placeholder="senior-designer@example.com" type="email" />
              <Input label="役職" placeholder="シニアデザイナー" />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 8 }}>
                <Button variant="secondary" label="キャンセル" />
                <Button variant="primary" label="保存する" />
              </div>
            </div>
          </div>
        )}

        {activeTab === '通知' && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>メール通知</h2>
            <Toggle label="新しいコメントが追加されたとき" defaultOn />
            <Toggle label="コメントが解決されたとき" defaultOn />
            <Toggle label="レビューがリクエストされたとき" defaultOn />
            <Toggle label="週次サマリー" />
            <Toggle label="マーケティングメール" />

            <h2 style={{ fontSize: 16, fontWeight: 700, marginTop: 24, marginBottom: 16 }}>プッシュ通知</h2>
            <Toggle label="デスクトップ通知" defaultOn />
            <Toggle label="モバイル通知" />
          </div>
        )}

        {activeTab === 'チーム' && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700 }}>チームメンバー</h2>
              <Button variant="primary" size="sm" label="+ メンバーを招待" />
            </div>
            {[
              { name: '山田太郎', role: '管理者', email: 'taro@example.com', avatar: 'https://i.pravatar.cc/150?u=taro' },
              { name: '田中花子', role: '編集者', email: 'hanako@example.com', avatar: 'https://i.pravatar.cc/150?u=hanako' },
              { name: '鈴木一郎', role: '編集者', email: 'ichiro@example.com', avatar: 'https://i.pravatar.cc/150?u=ichiro' },
              { name: '佐藤美咲', role: '閲覧者', email: 'misaki@example.com', avatar: 'https://i.pravatar.cc/150?u=misaki' },
            ].map((m) => (
              <div key={m.email} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: '1px solid #f3f4f6' }}>
                <Avatar name={m.name} src={m.avatar} size="md" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{m.name}</div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{m.email}</div>
                </div>
                <span style={{ fontSize: 12, color: '#6b7280', background: '#f3f4f6', padding: '4px 10px', borderRadius: 6 }}>{m.role}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === '請求' && (
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700 }}>現在のプラン</h2>
                <p style={{ fontSize: 13, color: '#6b7280', marginTop: 4 }}>Pro プラン - ¥2,980/月</p>
              </div>
              <Button variant="outline" size="sm" label="プランを変更" />
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12 }}>利用状況</div>
              {[
                { label: 'プロジェクト', used: 3, max: 10 },
                { label: 'メンバー', used: 4, max: 15 },
                { label: 'ストレージ', used: 2.1, max: 10 },
              ].map((item) => (
                <div key={item.label} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#6b7280', marginBottom: 4 }}>
                    <span>{item.label}</span>
                    <span>{item.used} / {item.max}</span>
                  </div>
                  <div style={{ height: 6, background: '#e5e7eb', borderRadius: 3 }}>
                    <div style={{ height: '100%', width: `${(item.used / item.max) * 100}%`, background: '#4f46e5', borderRadius: 3 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
