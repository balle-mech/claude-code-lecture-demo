// UI層: DOMイベントと logic.js・localStorage をつなぐ。対応要件は doc/design.md を参照。
import { addTask, toggleTask, deleteTask, deserializeTasks } from "./logic.js";

const STORAGE_KEY = "todo-tasks";

const input = document.getElementById("task-input");
const addButton = document.getElementById("add-button");
const list = document.getElementById("task-list");

// REQ-SAVE-002, REQ-SAVE-003: ページ読み込み時に localStorage から復元
let tasks = deserializeTasks(localStorage.getItem(STORAGE_KEY));
render();

// REQ-ADD-001: 追加ボタン押下または Enter キーで追加
addButton.addEventListener("click", handleAdd);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleAdd();
});

function handleAdd() {
  const next = addTask(tasks, input.value);
  if (next !== tasks) {
    // REQ-ADD-002: タスクが追加された場合のみ入力欄を空にする
    input.value = "";
    update(next);
  }
}

// REQ-SAVE-001: 状態変更のたびに保存して再描画
function update(next) {
  tasks = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  render();
}

function render() {
  list.replaceChildren(
    ...tasks.map((task) => {
      const li = document.createElement("li");
      // REQ-DONE-002: 完了タスクに取り消し線用クラスを付与
      if (task.done) li.classList.add("done");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = task.done;
      // REQ-DONE-001: チェックボックス操作で完了状態を切り替え
      checkbox.addEventListener("change", () => update(toggleTask(tasks, task.id)));

      const span = document.createElement("span");
      span.className = "task-text";
      span.textContent = task.text;

      const deleteButton = document.createElement("button");
      deleteButton.className = "delete-button";
      deleteButton.type = "button";
      deleteButton.textContent = "削除";
      // REQ-DEL-001: 削除ボタンでタスクを削除
      deleteButton.addEventListener("click", () => update(deleteTask(tasks, task.id)));

      li.append(checkbox, span, deleteButton);
      return li;
    })
  );
}
