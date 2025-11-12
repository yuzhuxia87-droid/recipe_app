# セットアップガイド

## ✅ 完了した作業

1. ✅ Viteプロジェクト作成
2. ✅ 依存関係インストール
3. ✅ 設定ファイル作成（Vite, TypeScript, ESLint, Tailwind等）
4. ✅ プロジェクト構造作成
5. ✅ Supabase型定義とクライアント設定
6. ✅ 開発サーバー起動確認 → http://localhost:5173/

---

## 🚀 次のステップ

### 1. GitHubリポジトリ作成

1. https://github.com/new にアクセス
2. 以下の設定でリポジトリを作成:
   - **Repository name**: `recipe-app`
   - **Private / Public**: どちらでもOK（Privateを推奨）
   - **Initialize this repository with**: チェックなし（全て空欄）
3. 「Create repository」をクリック

### 2. GitHubリポジトリURL確認

作成後、以下のようなURLが表示されます：
```
https://github.com/あなたのユーザー名/recipe-app.git
```

このURLを後で使います。

---

## 📌 GitHub連携準備完了

プロジェクトは以下の状態です：

```
recipe-app/
├── .gitignore              ✅ 作成済み
├── package.json            ✅ 作成済み
├── vite.config.ts          ✅ 作成済み
├── tsconfig.json           ✅ 作成済み
├── tailwind.config.js      ✅ 作成済み
├── eslint.config.js        ✅ 作成済み
├── src/
│   ├── App.tsx             ✅ 作成済み
│   ├── main.tsx            ✅ 作成済み
│   ├── lib/supabase.ts     ✅ 作成済み
│   ├── types/supabase.ts   ✅ 作成済み
│   └── ...（全ディレクトリ構造）
└── ...
```

---

## 🎯 次は？

GitHubリポジトリを作成したら、そのURLを教えてください。
すぐにGit初期化とプッシュを行います！
