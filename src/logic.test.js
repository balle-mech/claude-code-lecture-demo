import { test } from "node:test";
import assert from "node:assert/strict";
import { addTask, toggleTask, deleteTask, deserializeTasks } from "./logic.js";

// ---- addTask ----

test("REQ-ADD-001: テキストを未完了タスクとして末尾に追加する", () => {
  const tasks = [{ id: "1", text: "既存", done: true }];
  const result = addTask(tasks, "新規タスク");
  assert.equal(result.length, 2);
  const added = result[1];
  assert.equal(added.text, "新規タスク");
  assert.equal(added.done, false);
  assert.ok(added.id);
});

test("REQ-ADD-001: 追加されるタスクのIDは一意である", () => {
  let tasks = [];
  tasks = addTask(tasks, "a");
  tasks = addTask(tasks, "b");
  assert.notEqual(tasks[0].id, tasks[1].id);
});

test("REQ-ADD-001: 元の配列を変更しない", () => {
  const tasks = [];
  addTask(tasks, "a");
  assert.equal(tasks.length, 0);
});

test("REQ-ADD-003: 空文字なら追加しない", () => {
  const tasks = [];
  assert.equal(addTask(tasks, "").length, 0);
});

test("REQ-ADD-003: 空白のみなら追加しない", () => {
  const tasks = [];
  assert.equal(addTask(tasks, "   ").length, 0);
  assert.equal(addTask(tasks, "\t\n").length, 0);
});

// ---- toggleTask ----

test("REQ-DONE-001: 未完了タスクを完了に切り替える", () => {
  const tasks = [{ id: "1", text: "a", done: false }];
  const result = toggleTask(tasks, "1");
  assert.equal(result[0].done, true);
});

test("REQ-DONE-001: 完了タスクを未完了に切り替える", () => {
  const tasks = [{ id: "1", text: "a", done: true }];
  const result = toggleTask(tasks, "1");
  assert.equal(result[0].done, false);
});

test("REQ-DONE-001: 対象以外のタスクは変更しない", () => {
  const tasks = [
    { id: "1", text: "a", done: false },
    { id: "2", text: "b", done: false },
  ];
  const result = toggleTask(tasks, "1");
  assert.equal(result[1].done, false);
});

test("REQ-DONE-001: 元の配列を変更しない", () => {
  const tasks = [{ id: "1", text: "a", done: false }];
  toggleTask(tasks, "1");
  assert.equal(tasks[0].done, false);
});

// ---- deleteTask ----

test("REQ-DEL-001: 該当タスクを一覧から削除する", () => {
  const tasks = [
    { id: "1", text: "a", done: false },
    { id: "2", text: "b", done: false },
  ];
  const result = deleteTask(tasks, "1");
  assert.equal(result.length, 1);
  assert.equal(result[0].id, "2");
});

test("REQ-DEL-001: 元の配列を変更しない", () => {
  const tasks = [{ id: "1", text: "a", done: false }];
  deleteTask(tasks, "1");
  assert.equal(tasks.length, 1);
});

// ---- deserializeTasks ----

test("REQ-SAVE-002: JSON文字列からタスク一覧を復元する", () => {
  const json = JSON.stringify([{ id: "1", text: "a", done: true }]);
  const result = deserializeTasks(json);
  assert.deepEqual(result, [{ id: "1", text: "a", done: true }]);
});

test("REQ-SAVE-003: null なら空配列を返す", () => {
  assert.deepEqual(deserializeTasks(null), []);
});

test("REQ-SAVE-003: 不正なJSONなら空配列を返す", () => {
  assert.deepEqual(deserializeTasks("{invalid"), []);
});

test("REQ-SAVE-003: タスク配列の形をしていないデータなら空配列を返す", () => {
  assert.deepEqual(deserializeTasks('"文字列"'), []);
  assert.deepEqual(deserializeTasks('{"a":1}'), []);
  assert.deepEqual(deserializeTasks('[{"foo":"bar"}]'), []);
});
