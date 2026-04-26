# Storyground

[Storybook](https://storybook.js.org) で作られた UI を、ピン留めコメントとストーリー間フローでレビュー・整理するための Web アプリです。

## 概要

プロジェクトに Storybook のベース URL を登録し、ストーリー一覧を同期して iframe でプレビューします。画面上の座標にスレッドを立て、コメントで議論やフィードバックを残せます。さらに React Flow ベースの **フロー** で、ストーリー同士の関係や画面遷移の意図を可視化できます。

## コンセプト

- **Storybook を正とする**: 既存の Storybook 成果物に寄り添い、余計なデプロイ先を増やさずにレビュー体験を足す。
- **場所のある議論**: iframe 上の相対座標にスレッドを紐づけ、文脈のある指摘にする。
- **一覧から関係図へ**: 同期したストーリーをノードにし、エッジで UX / 導線の意図を表現する（将来のホットスポット拡張の土台も Prisma に用意済み）。

## 使い方

1. **ログイン**  
   本番相当では Google ログイン。ローカルでは `.env` の `AUTH_DEBUG=true` により、OAuth なしのデバッグユーザーで入れます（ヘッダーに `DEBUG` 表示）。

2. **プロジェクトを作る**  
   「新規プロジェクト」から名前と **Storybook のトップ URL**（例: `https://.../`）を登録します。匿名アクセス可能な URL か、自前配信の Storybook を想定します。

3. **ストーリーを同期**  
   プロジェクト画面の「**Story を同期**」で、`index.json`（Storybook 7+）または `stories.json`（v6）を取得し、DB にストーリー行を upsert します。プレビュー用 URL は `iframe.html?id=...` 形式で保存されます。

4. **ストーリーを開いてコメント**  
   一覧からストーリーを選ぶ。`+ コメントを追加` で配置モードにし、プレビュー上をクリックしてスレッドを作成。解決済みの表示切替や Esc キャンセルに対応します。

5. **フローを編集**（任意）  
   プロジェクトの「+ 新しいフロー」でフローを作成し、ストーリーをノードとして配置・接続します。保存はフロー編集画面から API 経由で行います。

## 前提・制約

- Storybook 側の **index / stories 一覧** が、サーバー（Next の API 経由）から取得できる必要があります。CORS はクライアント直 fetch ではなく `proxy-storybook` API 経由で吸収していますが、**認証必須の Storybook** は未対応の場合があります。
- プレビューは **iframe**。Storybook 側の `X-Frame-Options` 等によっては埋め込めないことがあります。

## 技術スタック

- [Next.js](https://nextjs.org) 14（App Router） / React 18
- [PostgreSQL](https://www.postgresql.org/) + [Prisma](https://www.prisma.io/) 7（`@prisma/adapter-pg`）
- [NextAuth.js](https://next-auth.js.org) v5（Google）+ `@auth/prisma-adapter`
- [React Flow](https://reactflow.dev/)（フロー編集）

## ローカル開発

### 1. 環境変数

`.env.example` を `.env` にコピーし、少なくとも `DATABASE_URL` と `AUTH_SECRET` を設定します。ローカル試行だけなら `AUTH_DEBUG=true` を推奨します。

```bash
cp .env.example .env
```

### 2. データベースとマイグレーション

```bash
pnpm exec prisma migrate dev
```

### 3. 開発サーバー

```bash
pnpm install
pnpm dev
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開きます。トップは `/projects` へリダイレクトされます。

### 4. 本番相当の Google ログイン

`AUTH_DEBUG` を外すか `false` にし、`GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` / `NEXTAUTH_URL` を設定して OAuth クライアントを登録します。

## ドキュメント

- [アーキテクチャ](docs/architecture.md) — システム構成、データモデル、主要なリクエストフロー

## 参考

- [Next.js ドキュメント](https://nextjs.org/docs)
- [Prisma ドキュメント](https://www.prisma.io/docs)
- [Storybook — Publish](https://storybook.js.org/docs/sharing/publish-storybook)
