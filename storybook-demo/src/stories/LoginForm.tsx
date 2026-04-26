import React from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import "./components.css";

export interface LoginFormProps {
  title?: string;
  subtitle?: string;
  onSubmit?: () => void;
}

export const LoginForm = ({
  title = "ログイン",
  subtitle = "アカウントにサインインしてください",
  onSubmit,
}: LoginFormProps) => (
  <div className="login-form">
    <div className="login-form__header">
      <div className="login-form__title">{title}</div>
      <div className="login-form__subtitle">{subtitle}</div>
    </div>
    <div className="login-form__fields">
      <Input label="メールアドレス" placeholder="user@example.com" type="email" />
      <Input label="パスワード" type="password" placeholder="••••••••" />
    </div>
    <Button variant="primary" size="lg" label="ログイン" onClick={onSubmit} />
    <div className="login-form__footer">
      アカウントをお持ちでない方は <a href="#">新規登録</a>
    </div>
  </div>
);
