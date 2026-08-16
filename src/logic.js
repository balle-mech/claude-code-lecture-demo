// タスク操作ロジック(純粋関数)。対応要件は doc/design.md を参照。

// REQ-ADD-001, REQ-ADD-003
export function addTask(tasks, text) {
  if (text.trim() === "") return tasks;
  return [...tasks, { id: crypto.randomUUID(), text, done: false }];
}

// REQ-DONE-001
export function toggleTask(tasks, id) {
  return tasks.map((task) =>
    task.id === id ? { ...task, done: !task.done } : task
  );
}

// REQ-DEL-001
export function deleteTask(tasks, id) {
  return tasks.filter((task) => task.id !== id);
}

// REQ-SAVE-002, REQ-SAVE-003
export function deserializeTasks(json) {
  try {
    const data = JSON.parse(json);
    if (!Array.isArray(data)) return [];
    if (!data.every(isTask)) return [];
    return data;
  } catch {
    return [];
  }
}

function isTask(value) {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof value.id === "string" &&
    typeof value.text === "string" &&
    typeof value.done === "boolean"
  );
}
