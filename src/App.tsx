import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import './App.css';
import Title from './components/Title';
import AddTask from './components/AddTask';
import Filter from './components/Filter';
import TaskList from './components/TaskList';
import type { Task, FilterType } from './types';
import type { Priority, Category } from './types';

function App() {
  const [inputTask, setInputTask] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [id, setId] = useState(1);
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<Category>('work');
  const [filter, setFilter] = useState<FilterType>('ALL');
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const safeSetInputTask = (v: string) => {
    if (error) setError(null);
    setInputTask(v);
  };

  useEffect(() => {
  const items = localStorage.getItem('taskList');
  const currentId = localStorage.getItem('currentId');

  if (items) {
    const parsedItems: Task[] = JSON.parse(items);
    setTaskList(parsedItems);
  }
  if (currentId) {
    setId(Number(currentId));
  }
  }, []);

  const updateTasks = (newTaskList: Task[]) => {
    localStorage.setItem('taskList', JSON.stringify(newTaskList));
    setTaskList(newTaskList);
  };



  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputTask === '') return;

    const name = inputTask.trim();          
    if (name === '') return;

  const exists = taskList.some(
    (t: Task) => (t.name as string).trim().toLowerCase() === name.toLowerCase()
  );
    if (exists) {
      setError('同じ名前のタスクは追加できません');
      return;
    }

    const newTask: Task = {
      id: id,
      name,
      isDone: false,
      priority,
      category,
      createdAt: new Date(),
    };

    updateTasks([...taskList, newTask]);
    setId(id + 1);
    setInputTask('');
    setPriority('medium');
    setCategory('work');
    setError(null);
  };

  const handleTaskChange = (taskId: number) => {
    const newTaskList = taskList.map((task) => {
      if (task.id === taskId) {
        return { ...task, isDone: !task.isDone };
      }
      return task;
    });
    updateTasks(newTaskList);
  };


  const handleRemoveTask = (taskId: number) => {
    const newTaskList = taskList.filter(
      (task) => task.id !== taskId
    );
    updateTasks(newTaskList);
  };

  const handleAllRemoveTask = () => {
    if (window.confirm(`完了済みタスクをすべて削除してもよいですか？`)) {
      const newTaskList = taskList.filter((t) => !t.isDone);
      updateTasks(newTaskList);
    }
  };

  const normalize = (s: string) => s.trim().toLowerCase();

  const filteredBySearch = taskList.filter(t =>
    normalize(t.name).includes(normalize(search))
  );

  const visibleTasks = filteredBySearch.filter(t =>
    filter === 'ALL' ? true : filter === 'DONE' ? t.isDone : !t.isDone
  );

    return (
    <>
      <div className="todo">
        <Title str="ToDo App" />
        <AddTask
          inputTask={inputTask}
          setInputTask={safeSetInputTask} 
          handleSubmit={handleSubmit}
          priority={priority}
          setPriority={setPriority}
          category={category}
          setCategory={setCategory}
        />
        {error && <p className="error">{error}</p>}
        <hr />
        <Filter onChange={setFilter} value={filter} />

        <div style={{ margin: '8px 0' }}>
        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        </div>

        <TaskList
          taskList={visibleTasks} 
          filter={filter}
          handleTaskChange={handleTaskChange}
          handleRemoveTask={handleRemoveTask}
          handleAllRemoveTask={handleAllRemoveTask}
        />
      </div>
    </>
  );
}



export default App;