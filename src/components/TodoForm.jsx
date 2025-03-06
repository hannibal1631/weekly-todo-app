import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff } from 'lucide-react';

const TodoForm = ({ addTodo }) => {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const silenceTimerRef = useRef(null);
  const lastSpeechRef = useRef(Date.now());
  const previousTranscriptRef = useRef('');

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
        // Get the final transcript from the results
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join('');

        // Update the input field with the transcript
        setText(transcript);

        // Mark that we detected speech and update the timestamp
        console.log('Speech detected at:', new Date().toISOString());
        lastSpeechRef.current = Date.now();
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        console.log('Recognition ended naturally');
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      // Cleanup
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
      }

      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          console.error('Error stopping recognition during cleanup', e);
        }
      }
    };
  }, []);

  // Track when listening state changes to start/stop the silence detection
  useEffect(() => {
    // Clear any existing timer when listening state changes
    if (silenceTimerRef.current) {
      clearInterval(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Set up silence detection when listening is active
    if (isListening && recognition) {
      console.log('Starting silence detection timer');

      // Start the timer to check for silence
      silenceTimerRef.current = setInterval(() => {
        const timeSinceLastSpeech = Date.now() - lastSpeechRef.current;
        console.log(
          'Time since last speech:',
          Math.floor(timeSinceLastSpeech / 1000),
          'seconds'
        );

        // If 5 seconds have passed without speech, stop listening
        if (timeSinceLastSpeech >= 5000) {
          console.log('5 seconds of silence detected, stopping recognition');

          try {
            recognition.stop();
          } catch (e) {
            console.error('Error stopping recognition after silence', e);
          }

          setIsListening(false);
          clearInterval(silenceTimerRef.current);
          silenceTimerRef.current = null;
        }
      }, 1000); // Check every second
    }

    return () => {
      // Clean up timer when component unmounts or listening state changes
      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [isListening, recognition]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (text.trim()) {
      addTodo(text);
      setText('');
      console.log('Adding todo:', text);
    }
  };

  const toggleListening = () => {
    if (!recognition) {
      console.warn('Speech recognition not available');
      return;
    }

    if (isListening) {
      // Stop listening
      try {
        recognition.stop();
        console.log('Manually stopped recognition');
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }

      setIsListening(false);

      if (silenceTimerRef.current) {
        clearInterval(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    } else {
      // Start listening
      try {
        // Reset the last speech timestamp to now
        lastSpeechRef.current = Date.now();

        // Start recognition
        recognition.start();
        console.log('Started recognition at:', new Date().toISOString());
        setIsListening(true);
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className='mb-6'>
      <div className='w-full flex flex-col md:flex-row justify-center items-center gap-2'>
        <input
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder='Add a new task...'
          className='flex-grow md:w-[85%] w-full justify-center p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500'
        />

        <button
          type='button'
          onClick={toggleListening}
          className={`p-3 md:w-[5%] w-full flex justify-center rounded-lg transition-colors ${
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
          className='flex justify-center md:w-[10%] w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity'
        >
          Add
        </button>
      </div>
      {isListening && (
        <p className='text-sm text-indigo-600 mt-2 animate-pulse'>
          Listening... Will stop after 5 seconds of silence
        </p>
      )}
    </form>
  );
};

export default TodoForm;
