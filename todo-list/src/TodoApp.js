import React, { useState, useEffect } from 'react';
import { X, Check, Edit2, Filter } from 'lucide-react';

// Task 组件
const Task = ({ task, onComplete, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(task.text);

  const handleEdit = () => {
    onEdit(task.id, editedText);
    setIsEditing(false);
  };

  return (
    <div className={`flex items-center gap-2 p-3 mb-2 rounded-lg bg-white shadow-sm 
      ${task.completed ? 'bg-opacity-50' : ''}`}>
      {isEditing ? (
        <div className="flex flex-1 gap-2">
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            className="flex-1 px-2 py-1 border rounded"
          />
          <button
            onClick={handleEdit}
            className="px-2 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            保存
          </button>
        </div>
      ) : (
        <>
          <span
            className={`flex-1 ${
              task.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {task.text}
          </span>
          <button
            onClick={() => onComplete(task.id)}
            className={`p-1 rounded-full hover:bg-gray-100 
              ${task.completed ? 'text-green-500' : 'text-gray-400'}`}
          >
            <Check size={18} />
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-400"
          >
            <X size={18} />
          </button>
        </>
      )}
    </div>
  );
};

// 主应用组件
const TodoApp = () => {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [filter, setFilter] = useState('all'); // all, active, completed

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now(),
          text: newTask.trim(),
          completed: false
        }
      ]);
      setNewTask('');
    }
  };

  const toggleComplete = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const editTask = (id, newText) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, text: newText } : task
      )
    );
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          任务清单
        </h1>

        {/* 添加任务表单 */}
        <form onSubmit={addTask} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder="添加新任务..."
              className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              添加
            </button>
          </div>
        </form>

        {/* 过滤器 */}
        <div className="flex items-center gap-4 mb-6">
          <Filter size={18} className="text-gray-400" />
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded ${
              filter === 'all'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            全部
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1 rounded ${
              filter === 'active'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            进行中
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1 rounded ${
              filter === 'completed'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-200'
            }`}
          >
            已完成
          </button>
        </div>

        {/* 任务列表 */}
        <div className="space-y-2">
          {filteredTasks.map((task) => (
            <Task
              key={task.id}
              task={task}
              onComplete={toggleComplete}
              onDelete={deleteTask}
              onEdit={editTask}
            />
          ))}
        </div>

        {/* 任务统计 */}
        <div className="mt-6 text-sm text-gray-500 text-center">
          总计: {tasks.length} | 已完成: {tasks.filter((t) => t.completed).length} | 
          未完成: {tasks.filter((t) => !t.completed).length}
        </div>
      </div>
    </div>
  );
};

export default TodoApp;