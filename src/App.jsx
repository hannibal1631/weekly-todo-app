// App.jsx
import React, { useState, useEffect } from 'react';
import DayCard from './components/DayCard';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';

const App = () => {
  const days = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
  ];
  const [selectedDay, setSelectedDay] = useState(null);
  const [todos, setTodos] = useState({});

  // Initialize todos from localStorage on component mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('todos');
      if (savedTodos) {
        setTodos(JSON.parse(savedTodos));
      } else {
        // Initialize empty todo arrays for each day
        const initialTodos = days.reduce((acc, day) => {
          acc[day] = [];
          return acc;
        }, {});
        setTodos(initialTodos);
      }
    } catch (error) {
      console.error('Error loading todos from localStorage:', error);
      // Initialize with empty arrays if there's an error
      const initialTodos = days.reduce((acc, day) => {
        acc[day] = [];
        return acc;
      }, {});
      setTodos(initialTodos);
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    try {
      if (Object.keys(todos).length > 0) {
        localStorage.setItem('todos', JSON.stringify(todos));
      }
    } catch (error) {
      console.error('Error saving todos to localStorage:', error);
    }
  }, [todos]);

  const handleDaySelect = (day) => {
    setSelectedDay(day);
  };

  const addTodo = (text) => {
    if (!selectedDay || !text.trim()) return;

    // Create a new todo object
    const newTodo = {
      id: Date.now(),
      text: text.trim(),
      completed: false,
    };

    // Update the todos state
    setTodos((prevTodos) => {
      // Make a deep copy of the previous todos
      const newTodos = JSON.parse(JSON.stringify(prevTodos));

      // Ensure the selected day exists in our object
      if (!newTodos[selectedDay]) {
        newTodos[selectedDay] = [];
      }

      // Add the new todo
      newTodos[selectedDay].push(newTodo);

      return newTodos;
    });
  };

  const removeTodo = (id) => {
    if (!selectedDay) return;

    setTodos((prevTodos) => {
      const newTodos = { ...prevTodos };
      if (newTodos[selectedDay]) {
        newTodos[selectedDay] = newTodos[selectedDay].filter(
          (todo) => todo.id !== id
        );
      }
      return newTodos;
    });
  };

  const toggleComplete = (id) => {
    if (!selectedDay) return;

    setTodos((prevTodos) => {
      const newTodos = { ...prevTodos };
      if (newTodos[selectedDay]) {
        newTodos[selectedDay] = newTodos[selectedDay].map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo
        );
      }
      return newTodos;
    });
  };

  // For debugging
  console.log('Current todos state:', todos);
  console.log('Selected day:', selectedDay);

  return (
    <div className='flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6'>
      <div className='max-w-5xl mx-auto'>
        <h1 className='text-3xl font-bold text-indigo-800 mb-8 text-center'>
          Weekly Todo App
        </h1>

        <div className='grid grid-cols-1 md:grid-cols-7 gap-4 mb-8'>
          {days.map((day) => (
            <DayCard
              key={day}
              day={day}
              isSelected={selectedDay === day}
              todoCount={todos[day]?.length || 0}
              onSelect={() => handleDaySelect(day)}
            />
          ))}
        </div>

        {selectedDay && (
          <div className='bg-white rounded-lg shadow-lg p-6 mb-8'>
            <h2 className='text-2xl font-semibold text-indigo-700 mb-4'>
              {selectedDay}'s Tasks
            </h2>
            <TodoForm addTodo={addTodo} />
            <TodoList
              todos={todos[selectedDay] || []}
              removeTodo={removeTodo}
              toggleComplete={toggleComplete}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
