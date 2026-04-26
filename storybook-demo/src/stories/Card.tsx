import React from "react";
import "./components.css";

export interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  tags?: string[];
  footerAction?: string;
}

export const Card = ({ title, description, imageUrl, tags = [], footerAction }: CardProps) => (
  <div className="card" style={{ maxWidth: 320 }}>
    {imageUrl && <img className="card__image" src={imageUrl} alt={title} />}
    <div className="card__body">
      <div className="card__title">{title}</div>
      <div className="card__desc">{description}</div>
      {tags.length > 0 && (
        <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
          {tags.map((tag) => (
            <span key={tag} className="badge badge--info">
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
    {footerAction && (
      <div className="card__footer">
        <span style={{ fontSize: 12, color: "#9ca3af" }}>2 min ago</span>
        <button className="btn btn--ghost btn--sm">{footerAction}</button>
      </div>
    )}
  </div>
);
