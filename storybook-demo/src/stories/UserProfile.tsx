import React from "react";
import { Avatar } from "./Avatar";
import { Badge } from "./Badge";
import { Button } from "./Button";
import "./components.css";

export interface UserProfileProps {
  name: string;
  role: string;
  avatarUrl?: string;
  stats?: { label: string; value: string | number }[];
  status?: "online" | "away" | "offline";
}

const statusLabels = { online: "オンライン", away: "離席中", offline: "オフライン" };

export const UserProfile = ({
  name,
  role,
  avatarUrl,
  stats = [
    { label: "プロジェクト", value: 12 },
    { label: "レビュー", value: 48 },
    { label: "コメント", value: 156 },
  ],
  status = "online",
}: UserProfileProps) => (
  <div className="user-profile">
    <Avatar name={name} src={avatarUrl} size="xl" />
    <div className="user-profile__info">
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className="user-profile__name">{name}</span>
        <Badge
          label={statusLabels[status]}
          variant={status === "online" ? "success" : status === "away" ? "warning" : "neutral"}
          dot
        />
      </div>
      <span className="user-profile__role">{role}</span>
      <div className="user-profile__stats">
        {stats.map((stat) => (
          <div key={stat.label} className="user-profile__stat">
            <div className="user-profile__stat-value">{stat.value}</div>
            <div className="user-profile__stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <Button variant="primary" size="sm" label="メッセージ" />
        <Button variant="outline" size="sm" label="プロフィール" />
      </div>
    </div>
  </div>
);
