// components/TodoForm.jsx
import React, { useState, useEffect } from 'react';
import { Mic, MicOff } from 'lucide-react';

const TodoForm = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    // Initialize speech recognition if supported
    if (
      typeof window !== 'undefined' &&
      ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;

      recognitionInstance.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');

        setText(transcript);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    // Cleanup function to stop recognition if component unmounts
    return () => {
      if (recognition && isListening) {
        recognition.stop();
      }
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.trim()) {
      addTodo(text);
      setText('');

      // For debugging
      console.log('Adding todo:', text);
    }
  };

  const toggleListening = () => {
    if (!recognition) return;

    try {
      if (isListening) {
        recognition.stop();
        setIsListening(false);
      } else {
        recognition.start();
        setIsListening(true);
      }
    } catch (error) {
      console.error('Error toggling speech recognition:', error);
      setIsListening(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mb-6'>
      <div className='flex justify-center items-center gap-2'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Add a new task...'
          className='flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />

        <button
          type='button'
          onClick={toggleListening}
          className={`p-3 rounded-lg transition-colors ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-700'
          }`}
          title={isListening ? 'Stop voice input' : 'Start voice input'}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        <button
          type='submit'
          className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity'
        >
          Add
        </button>
      </div>
      {isListening && (
        <p className='text-sm text-indigo-600 mt-2 animate-pulse'>
          Listening... Speak now
        </p>
      )}
    </form>
  );
};

export default TodoForm;
