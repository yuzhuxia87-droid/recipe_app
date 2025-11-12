function App() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-handwriting text-ink mb-4">
          料理日記・レシピ手帳
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          プロジェクトセットアップ完了！🎉
        </p>
        <div className="bg-white p-8 rounded-lg shadow-lg border-2 border-accent/20">
          <h2 className="text-2xl font-bold mb-4">次のステップ</h2>
          <ol className="text-left space-y-2">
            <li>✅ Viteプロジェクト作成</li>
            <li>✅ 依存関係インストール</li>
            <li>✅ 設定ファイル作成</li>
            <li>⏳ Supabaseプロジェクト作成</li>
            <li>⏳ データベーステーブル作成</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default App
