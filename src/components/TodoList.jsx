// components/TodoList.jsx
import React from 'react';
import { Trash2, Check } from 'lucide-react';

const TodoList = ({ todos, removeTodo, toggleComplete }) => {
  // For debugging
  console.log('TodoList received todos:', todos);

  if (!todos || todos.length === 0) {
    return (
      <div className='text-center py-6 text-gray-500'>
        No tasks for this day. Add one above!
      </div>
    );
  }

  return (
    <ul className='space-y-3'>
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={`
            flex items-center justify-between p-4 rounded-lg transition-all duration-200
            ${
              todo.completed
                ? 'bg-green-50 border border-green-200'
                : 'bg-indigo-50 border border-indigo-100'
            }
          `}
        >
          <span
            className={`flex-grow ${
              todo.completed ? 'line-through text-gray-500' : 'text-gray-800'
            }`}
          >
            {todo.text}
          </span>

          <div className='flex gap-2'>
            <button
              type='button'
              onClick={() => toggleComplete(todo.id)}
              className={`
                p-2 rounded-full transition-colors
                ${
                  todo.completed
                    ? 'bg-green-200 text-green-700 hover:bg-green-300'
                    : 'bg-indigo-200 text-indigo-700 hover:bg-indigo-300'
                }
              `}
              title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              <Check size={18} />
            </button>

            <button
              type='button'
              onClick={() => removeTodo(todo.id)}
              className='p-2 rounded-full bg-red-200 text-red-700 hover:bg-red-300 transition-colors'
              title='Remove task'
            >
              <Trash2 size={18} />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default TodoList;
