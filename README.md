# claude-code-lecture-demo

社内新入社員研修「Claude Code入門」の検証実装リポジトリです。

登壇資料の作成・デモに向けた動作検証・私の学習を目的としています。

## 内容

- [研修内容検討/](研修内容検討/) — 研修(座学・デモ)内容の検討用ファイル置き場。研修背景・内容検討・TODO など、TODOアプリ開発以外はすべてここ
- [doc/](doc/) — TODOアプリの仕様書置き場(要件定義・設計)
- `src/` — TODOアプリのソースコード置き場

## TODOアプリについて

**登壇者が事前学習を兼ねて Claude Code で作る検証用アプリであり、研修本番では使用しません。**

研修で伝えるAI駆動開発フロー(要件のすり合わせ → 段階的な実装 → テスト → MCP / skills の活用)を、登壇者自身が一度体験することを目的としています。

- 技術構成: HTML + CSS + JavaScript(フレームワークなし)
- 実行方法: VSCode の Live Server で `src/index.html` を開く
- 開発プロセス: AI-DLC・スペック駆動開発 + TDD([.claude/rules/development-process.md](.claude/rules/development-process.md) 参照)
- 要件定義: [doc/requirements.md](doc/requirements.md)(EARS 記法・要件IDによるトレーサビリティ付き)
