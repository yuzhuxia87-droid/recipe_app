# Recipe App - Development Guide

このファイルは、Claude Codeでの開発をサポートするためのプロジェクトガイドです。

## 📚 プロジェクト概要

レシピ管理アプリケーション。手帳風のUIで、スクリーンショットからAIでレシピを抽出し、管理できます。

- **フレームワーク**: React + TypeScript + Vite
- **バックエンド**: Supabase
- **AI機能**: OpenAI GPT-4 Vision (レシピ抽出)
- **デプロイ**: Vercel

---

## 🌿 Git ブランチ戦略

### ブランチ構成

```
main (production)
  ├── develop (development)
  │   ├── feature/機能名
  │   ├── fix/修正内容
  │   └── refactor/リファクタ内容
  └── hotfix/緊急修正
```

### ブランチの種類と役割

#### 1. `main` ブランチ
- **役割**: 本番環境（Vercelにデプロイされる安定版）
- **保護**: 直接コミット禁止
- **マージ元**: `develop` または `hotfix/*`
- **命名規則**: `main` 固定

#### 2. `develop` ブランチ
- **役割**: 開発環境（次のリリース候補）
- **保護**: 直接の大きな変更は避ける
- **マージ元**: `feature/*`, `fix/*`, `refactor/*`
- **命名規則**: `develop` 固定

#### 3. `feature/*` ブランチ
- **役割**: 新機能開発
- **命名規則**: `feature/機能名` (例: `feature/add-shopping-list`)
- **ベース**: `develop` から分岐
- **マージ先**: `develop` にマージ

**例**:
```bash
# 新機能ブランチ作成
git checkout develop
git pull origin develop
git checkout -b feature/add-shopping-list

# 作業完了後
git add .
git commit -m "feat: Add shopping list feature"
git push origin feature/add-shopping-list
# → GitHubでPull Request作成 → developにマージ
```

#### 4. `fix/*` ブランチ
- **役割**: バグ修正（開発中のバグ）
- **命名規則**: `fix/修正内容` (例: `fix/recipe-image-not-saving`)
- **ベース**: `develop` から分岐
- **マージ先**: `develop` にマージ

**例**:
```bash
git checkout develop
git checkout -b fix/recipe-image-not-saving
```

#### 5. `refactor/*` ブランチ
- **役割**: コードリファクタリング
- **命名規則**: `refactor/対象` (例: `refactor/visionService`)
- **ベース**: `develop` から分岐
- **マージ先**: `develop` にマージ

#### 6. `hotfix/*` ブランチ
- **役割**: 本番環境の緊急修正
- **命名規則**: `hotfix/緊急修正内容` (例: `hotfix/critical-api-error`)
- **ベース**: `main` から分岐
- **マージ先**: `main` と `develop` の両方

**例**:
```bash
# 本番で緊急バグ発見
git checkout main
git pull origin main
git checkout -b hotfix/critical-api-error

# 修正後
git add .
git commit -m "hotfix: Fix critical API error"
git push origin hotfix/critical-api-error
# → mainとdevelopの両方にマージ
```

---

## 🚀 ワークフロー

### 新機能開発の流れ

1. **ブランチ作成**
   ```bash
   git checkout develop
   git pull origin develop
   git checkout -b feature/your-feature-name
   ```

2. **開発・コミット**
   ```bash
   # 作業...
   git add .
   git commit -m "feat: Add your feature"
   ```

3. **プッシュ**
   ```bash
   git push origin feature/your-feature-name
   ```

4. **Pull Request作成**
   - GitHubで `feature/your-feature-name` → `develop` のPRを作成
   - レビュー・承認後にマージ

5. **リリース準備**
   ```bash
   # developが安定したらmainにマージ
   git checkout main
   git pull origin main
   git merge develop
   git push origin main
   # → Vercelが自動デプロイ
   ```

### バグ修正の流れ

```bash
git checkout develop
git checkout -b fix/bug-description
# 修正...
git commit -m "fix: Fix bug description"
git push origin fix/bug-description
# → developにPR → マージ
```

---

## 📝 コミットメッセージ規約

### フォーマット

```
<type>: <subject>

<body>（任意）

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

### Type の種類

- `feat`: 新機能
- `fix`: バグ修正
- `refactor`: リファクタリング
- `docs`: ドキュメント変更
- `style`: コードスタイル変更（機能に影響なし）
- `test`: テスト追加・修正
- `chore`: ビルド・設定変更

### 例

```bash
feat: Add recipe search functionality

Implement full-text search for recipes by title and ingredients.
Uses Supabase text search with filtering.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 🔧 開発環境セットアップ

### 初回セットアップ

```bash
# リポジトリクローン
git clone https://github.com/yuzhuxia87-droid/recipe_app.git
cd recipe_app

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env.local
# .env.localを編集してAPIキーを設定

# 開発サーバー起動
npm run dev
```

### 必要な環境変数

`.env.local` に以下を設定：

```bash
# Supabase
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# OpenAI API
VITE_OPENAI_API_KEY=your-openai-api-key

# Unsplash API
VITE_UNSPLASH_ACCESS_KEY=your-unsplash-access-key
```

---

## 📦 デプロイ

### Vercel デプロイフロー

1. **mainブランチにマージ**
   ```bash
   git checkout main
   git merge develop
   git push origin main
   ```

2. **自動デプロイ**
   - Vercelが自動的にビルド・デプロイ
   - デプロイ状況: https://vercel.com/dashboard

3. **環境変数確認**
   - Vercel Dashboard → Settings → Environment Variables
   - 全ての環境変数が設定されているか確認

---

## 🎯 現在の状況（2025-11-17）

### 最近の変更

- ✅ Gemini API → OpenAI API に移行
- ✅ レシピ編集機能を実装
- ✅ 編集時はAI抽出セクションを非表示に

### 次にやること

- [ ] Vercelに `VITE_OPENAI_API_KEY` 環境変数を追加
- [ ] 本番環境でAI抽出機能をテスト
- [ ] developブランチを作成して、今後の開発はそこで行う

---

## 🤝 Claude Codeとの協働

このプロジェクトは Claude Code を使って開発しています。

### Claude Codeに依頼するときのベストプラクティス

1. **ブランチを指定する**
   ```
   「feature/shopping-listブランチで作業してください」
   ```

2. **変更範囲を明確にする**
   ```
   「RecipeForm.tsxだけを修正してください」
   ```

3. **コミットメッセージを依頼する**
   ```
   「コミットメッセージを作成してください」
   ```

4. **テストを依頼する**
   ```
   「ビルドを実行してエラーがないか確認してください」
   ```

---

## 📚 参考リンク

- **リポジトリ**: https://github.com/yuzhuxia87-droid/recipe_app
- **本番環境**: https://your-app.vercel.app
- **Supabase Dashboard**: https://supabase.com/dashboard
- **OpenAI Platform**: https://platform.openai.com/
