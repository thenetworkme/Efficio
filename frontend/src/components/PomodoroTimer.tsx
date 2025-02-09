import { useState, useEffect } from 'react';
import { Task } from '../App';

type TimerMode = 'pomodoro' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  settings: {
    times: {
      pomodoro: number;
      shortBreak: number;
      longBreak: number;
    };
  };
  currentMode: TimerMode;
  onModeChange: (mode: TimerMode) => void;
}

export default function PomodoroTimer({
  settings,
  currentMode,
  onModeChange,
}: PomodoroTimerProps) {
  const [timeLeft, setTimeLeft] = useState(() => {
    return (
      (settings?.times?.[currentMode] ??
        (currentMode === 'pomodoro'
          ? 25
          : currentMode === 'shortBreak'
          ? 5
          : 15)) * 60
    );
  });
  const [isRunning, setIsRunning] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');

  // Reproducir sonido
  const playSound = (
    soundPath: string,
    volume: number = 1,
    duration: number = 10
  ) => {
    const audio = new Audio(soundPath);
    audio.volume = volume;
    audio.play().catch((error) => console.error('Error playing sound:', error));
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, duration * 1000);
  };

  useEffect(() => {
    if (settings?.times?.[currentMode]) {
      setTimeLeft(settings.times[currentMode] * 60);
      setIsRunning(false);
    }
  }, [settings, currentMode]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            if (currentMode === 'pomodoro') {
              setTasks((currentTasks) => {
                const firstUncompleted = currentTasks.findIndex(
                  (task) => !task.completed
                );
                if (firstUncompleted !== -1) {
                  return currentTasks.map((task, index) =>
                    index === firstUncompleted
                      ? { ...task, completed: true }
                      : task
                  );
                }
                return currentTasks;
              });
            }
            setIsRunning(false);
            playSound('/sounds/pomodoro.mp3', 0.5); // Sonido al finalizar el temporizador
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, currentMode]);

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(
        (settings?.times?.[currentMode] ??
          (currentMode === 'pomodoro'
            ? 25
            : currentMode === 'shortBreak'
            ? 5
            : 15)) * 60
      );
    }
    setIsRunning(!isRunning);
    if (!isRunning) {
      playSound('/sounds/click.mp3', 0.1); // Sonido al iniciar
    } else {
      playSound('/sounds/click.mp3', 0.1); // Sonido al pausar
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        { id: Date.now().toString(), text: newTask.trim(), completed: false },
      ]);
      setNewTask('');
    }
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-center gap-3 mb-8">
          {(['pomodoro', 'shortBreak', 'longBreak'] as const).map(
            (timerMode) => (
              <button
                key={timerMode}
                onClick={() => {
                  onModeChange(timerMode);
                  setTimeLeft(
                    (settings?.times?.[timerMode] ??
                      (timerMode === 'pomodoro'
                        ? 25
                        : timerMode === 'shortBreak'
                        ? 5
                        : 15)) * 60
                  );
                  setIsRunning(false);
                }}
                className={`px-3 py-2 rounded font-bold text-white transition-colors ${
                  currentMode === timerMode
                    ? 'bg-white/20'
                    : 'hover:bg-white/10'
                }`}
              >
                {timerMode === 'pomodoro'
                  ? 'Pomodoro'
                  : timerMode === 'shortBreak'
                  ? 'Short Break'
                  : 'Long Break'}
              </button>
            )
          )}
        </div>
        <div className="text-center">
          <div className="text-[120px] font-bold text-white mb-8 leading-none">
            {formatTime(timeLeft)}
          </div>
          <button
            onClick={toggleTimer}
            className="min-w-[200px] bg-white px-12 py-3 rounded-lg text-2xl font-bold tracking-[0.25em] uppercase transition-all duration-200"
            style={{
              color:
                currentMode === 'pomodoro'
                  ? '#ba4949'
                  : currentMode === 'shortBreak'
                  ? '#38858a'
                  : '#397097',
              boxShadow: isRunning ? 'none' : '0px 4px 0px  #D3BCCC', // Sombra sólida gris
              transform: isRunning ? 'translateY(6px)' : 'translateY(0px)', // Movimiento hacia abajo
            }}
          >
            {isRunning ? 'PAUSE' : timeLeft === 0 ? 'RESTART' : 'START'}
          </button>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Tasks</h2>
          <button className="p-2 text-white hover:bg-white/10 rounded transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        </div>
        <div className="space-y-2 mb-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex items-center justify-between gap-3 bg-white/10 p-4 rounded-lg group"
            >
              <span
                className={`flex-1 text-white ${
                  task.completed ? 'line-through opacity-50' : ''
                }`}
              >
                {task.text}
              </span>
              <button
                onClick={() => toggleTaskCompletion(task.id)}
                className="text-white/80 hover:text-white"
              >
                {task.completed ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            placeholder="What are you working on?"
            className="w-full bg-white/10 text-white placeholder-white/60 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white/20"
          />
        </form>
        {tasks.length === 0 && (
          <div className="mt-8 text-center text-white/60">Time to focus!</div>
        )}
      </div>
    </div>
  );
}
