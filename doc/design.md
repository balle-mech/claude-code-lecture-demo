# TODOアプリ 設計(Step 1)

要件は `doc/requirements.md` を参照。本書は Step 1 の要件のみを対象とする。

## 全体構成

2層構成でロジックとUIを分離する(テスト戦略は `.claude/rules/development-process.md` を参照)。

| ファイル | 役割 |
|---|---|
| `src/index.html` | 画面構造(入力欄・追加ボタン・タスク一覧) |
| `src/style.css` | 見た目(完了タスクの取り消し線を含む) |
| `src/logic.js` | 純粋関数によるタスク操作ロジック(`node:test` の対象) |
| `src/app.js` | DOMイベントと logic.js・localStorage をつなぐ層 |
| `src/logic.test.js` | ユニットテスト(要件IDをテスト名に含める) |

## データモデル

タスクは以下のプロパティを持つオブジェクトとし、配列で一覧を表現する。

| プロパティ | 型 | 説明 |
|---|---|---|
| `id` | string | 一意なID(生成方法は実装に委ねる) |
| `text` | string | タスクのテキスト |
| `done` | boolean | 完了状態(初期値 false) |

## ロジック層(src/logic.js)— 純粋関数

すべて「現在のタスク配列 + 引数 → 新しいタスク配列(または値)」の純粋関数。
元の配列は変更しない(イミュータブル)。

| 関数 | 振る舞い | 対応要件 |
|---|---|---|
| `addTask(tasks, text)` | text を未完了タスクとして末尾に追加した新配列を返す | REQ-ADD-001 |
| `addTask(tasks, text)` | text が空文字または空白のみなら元の配列をそのまま返す | REQ-ADD-003 |
| `toggleTask(tasks, id)` | 該当タスクの `done` を反転した新配列を返す | REQ-DONE-001 |
| `deleteTask(tasks, id)` | 該当タスクを除いた新配列を返す | REQ-DEL-001 |
| `deserializeTasks(json)` | JSON文字列をタスク配列に復元する。null・不正なJSON・タスク配列の形をしていないデータの場合は空配列を返す | REQ-SAVE-003 |

※ シリアライズは `JSON.stringify` で足りるため専用関数は設けない。

## UI層(src/app.js)

localStorage のキー: `todo-tasks`

| 処理 | 振る舞い | 対応要件 |
|---|---|---|
| 追加操作ハンドラ | 追加ボタン click と入力欄の Enter keydown で `addTask` を呼び、再描画・保存する | REQ-ADD-001 |
| 追加操作ハンドラ | タスクが追加された場合のみ入力欄を空にする | REQ-ADD-002 |
| チェックボックスハンドラ | change で `toggleTask` を呼び、再描画・保存する | REQ-DONE-001 |
| 削除ボタンハンドラ | click で `deleteTask` を呼び、再描画・保存する | REQ-DEL-001 |
| 保存処理 | 状態変更(追加・切替・削除)のたびにタスク配列を JSON にして localStorage に保存する | REQ-SAVE-001 |
| 初期化処理 | ページ読み込み時に localStorage から `deserializeTasks` で復元し描画する | REQ-SAVE-002, REQ-SAVE-003 |
| 描画処理 | タスク配列から一覧のDOMを生成する。完了タスクには取り消し線用のクラスを付与する | REQ-DONE-002 |

## UI構造(src/index.html / style.css)

- 入力欄(text)+ 追加ボタン + タスク一覧(ul)
- 各タスク行: チェックボックス + テキスト + 削除ボタン
- 完了タスクのテキストは CSS(`text-decoration: line-through`)で取り消し線表示(REQ-DONE-002)

## 検証方法

- ロジック層: `node --test src/logic.test.js` によるユニットテスト(TDDで作成)
- UI層: Playwright MCP による受け入れ確認(要件ID単位で報告)
