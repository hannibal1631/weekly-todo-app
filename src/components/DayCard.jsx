// components/DayCard.jsx
import React from 'react';

const DayCard = ({ day, isSelected, todoCount, onSelect }) => {
  // Generate dynamic color based on day of week
  const getDayColor = (day) => {
    const colors = {
      Monday: 'from-pink-500 to-red-500',
      Tuesday: 'from-orange-400 to-amber-500',
      Wednesday: 'from-yellow-400 to-amber-500',
      Thursday: 'from-green-400 to-emerald-500',
      Friday: 'from-teal-400 to-cyan-500',
      Saturday: 'from-blue-400 to-indigo-500',
      Sunday: 'from-purple-400 to-violet-500',
    };
    return colors[day] || 'from-gray-400 to-gray-500';
  };

  return (
    <div
      className={`
        rounded-lg shadow-md p-4 cursor-pointer transition-all duration-200
        ${
          isSelected
            ? `bg-gradient-to-br ${getDayColor(
                day
              )} text-white transform scale-105`
            : 'bg-white hover:bg-gray-50 text-gray-800 hover:shadow-lg'
        }
      `}
      onClick={onSelect}
    >
      <h3
        className={`text-center font-semibold ${
          isSelected ? 'text-white' : 'text-gray-800'
        }`}
      >
        {day}
      </h3>
      <div className='flex justify-center mt-2'>
        <span
          className={`
          inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full
          ${
            isSelected
              ? 'bg-white text-indigo-600'
              : 'bg-indigo-100 text-indigo-800'
          }
        `}
        >
          {todoCount} {todoCount === 1 ? 'task' : 'tasks'}
        </span>
      </div>
    </div>
  );
};

export default DayCard;
