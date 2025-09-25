import type { Task, FilterType } from '../types';
import './TaskList.css';
import { PRIORITY_LABELS, CATEGORY_LABELS, PRIORITY_COLORS } from '../types';

type TaskListProps = {
  taskList: Task[];
  filter: FilterType;
  handleTaskChange: (id: number) => void;
  handleRemoveTask: (id: number) => void;
  handleAllRemoveTask: (tasks: Task[]) => void;
};

const TaskList = ({
  taskList,
  filter,
  handleTaskChange,
  handleRemoveTask,
  handleAllRemoveTask,
}: TaskListProps) => {
  const doneTasks = taskList.filter((t) => t.isDone);
  const todoTasks = taskList.filter(({ isDone }) => !isDone);
  const displayTasks = taskList.filter(({ isDone }) => {
     if (filter === 'ALL') return true;
     if (filter === 'TODO') return !isDone;
     if (filter === 'DONE') return isDone;
  });

  return (
    <>
      <ul>
        {displayTasks.length === 0 && filter === 'ALL' ? (
          <p>タスクを追加してください</p>
          ) : displayTasks.length === 0 ? (
            <p>該当するタスクがありません</p>
        ) : (
          taskList.map(({ id, name, isDone, priority, category }) => (
            <li key={id}>
              <input
                type="checkbox"
                checked={isDone}
                onChange={() => handleTaskChange(id)}
              />
              <span
               className="priority-label"
               style={{ backgroundColor: PRIORITY_COLORS[priority] }}
              >
               {PRIORITY_LABELS[priority]}
             </span>
              <span style={{ textDecoration: isDone ? 'line-through' : 'none' }}>
                {name}
              </span>
              <span className="category-label">
                {CATEGORY_LABELS[category]}
              </span>
              <button className="danger" onClick={() => handleRemoveTask(id)}>
                ☓
              </button>
            </li>
          ))
        )}
      </ul>

      <button
        className="danger delete"
        disabled={todoTasks.length === taskList.length}
        onClick={() => handleAllRemoveTask(todoTasks)}
      >
        delete all
      </button>
    </>
  );
};

export default TaskList;
