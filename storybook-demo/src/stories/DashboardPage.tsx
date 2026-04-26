import React from 'react';
import { Navbar } from './Navbar';
import { Card } from './Card';
import { Avatar } from './Avatar';
import { Badge } from './Badge';
import { Alert } from './Alert';
import './components.css';

export interface DashboardPageProps {
  userName?: string;
}

const recentActivity = [
  { user: '田中花子', action: 'Button コンポーネントにコメント', time: '5分前', avatar: 'https://i.pravatar.cc/150?u=hanako' },
  { user: '鈴木一郎', action: 'Card のデザインを更新', time: '23分前', avatar: 'https://i.pravatar.cc/150?u=ichiro' },
  { user: '佐藤美咲', action: 'LoginForm をレビュー完了', time: '1時間前', avatar: 'https://i.pravatar.cc/150?u=misaki' },
  { user: '山田太郎', action: 'Navbar の修正をリクエスト', time: '3時間前', avatar: 'https://i.pravatar.cc/150?u=taro' },
];

const stats = [
  { label: 'コンポーネント', value: '24', change: '+3' },
  { label: 'オープンコメント', value: '8', change: '-2' },
  { label: 'レビュー完了', value: '156', change: '+12' },
  { label: 'チームメンバー', value: '6', change: '' },
];

export const DashboardPage = ({ userName = '太郎' }: DashboardPageProps) => (
  <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
    <Navbar userName={userName} />

    <div style={{ maxWidth: 1080, margin: '0 auto', padding: '24px 24px' }}>
      <Alert variant="info" title="v2.0 リリース準備中" message="全コンポーネントのレビューを今週中に完了してください。" />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, margin: '24px 0' }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px 16px' }}>
            <div style={{ fontSize: 12, color: '#6b7280', fontWeight: 600, textTransform: 'uppercase' }}>{s.label}</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginTop: 4 }}>
              <span style={{ fontSize: 28, fontWeight: 800, color: '#1a1a2e' }}>{s.value}</span>
              {s.change && (
                <span style={{ fontSize: 13, fontWeight: 600, color: s.change.startsWith('+') ? '#16a34a' : '#dc2626' }}>{s.change}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Recent Activity */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>最近のアクティビティ</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {recentActivity.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Avatar name={item.user} src={item.avatar} size="sm" />
                <div style={{ flex: 1 }}>
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{item.user}</span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}> が {item.action}</span>
                </div>
                <span style={{ fontSize: 12, color: '#9ca3af', whiteSpace: 'nowrap' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Card
            title="デザインシステム v2.0"
            description="24 コンポーネント / 8 件の未対応コメント"
            tags={['進行中']}
            footerAction="開く →"
          />
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 16 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>レビュー待ち</h3>
            {['Modal コンポーネント', 'Tooltip の配置修正', 'Table ソート機能'].map((item) => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f3f4f6' }}>
                <span style={{ fontSize: 13 }}>{item}</span>
                <Badge label="レビュー待ち" variant="warning" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);
