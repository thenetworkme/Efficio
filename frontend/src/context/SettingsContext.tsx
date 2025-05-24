import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { api } from '../lib/api';

interface Times {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export interface Session {
  date: string; // Fecha en formato ISO (YYYY-MM-DD)
  count: number; // Número de sesiones completadas ese día
}

export interface Settings {
  id: string;
  user_id: string;
  globalTheme: string;
  pomodoroColor: string;
  shortBreakColor: string;
  longBreakColor: string;
  times: Times;
  sessions: Session[];
  autoStartBreaks?: boolean;
  autoDeleteCompletedTasks: boolean;
}

interface SettingsContextType {
  settings: Settings;
  loading: boolean;
  updateSettings: (newSettings: Partial<Settings>) => Promise<void>;
}

const defaultSettings: Settings = {
  id: '',
  user_id: '',
  globalTheme: 'dark',
  autoStartBreaks: false,
  pomodoroColor: '#ef4444',
  shortBreakColor: '#0B7A75',
  longBreakColor: '#3b82f6',
  times: {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
  },
  sessions: [],
  autoDeleteCompletedTasks: false,
};

const SettingsContext = createContext<SettingsContextType | undefined>(
  undefined
);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadSettings();
    } else {
      setSettings(defaultSettings);
      setLoading(false);
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings({
        id: data.id,
        user_id: '',
        globalTheme: data.global_theme,
        pomodoroColor: data.pomodoro_color,
        shortBreakColor: data.short_break_color,
        longBreakColor: data.long_break_color,
        times: data.times,
        sessions: data.sessions || [],
        autoStartBreaks: data.auto_start_breaks || false,
        autoDeleteCompletedTasks: data.auto_delete_completed_tasks || false,
      });
    } catch (error) {
      console.error('Error loading settings:', error);
      setSettings(defaultSettings);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (newSettings: Partial<Settings>) => {
    try {
      setLoading(true);
      const updatedSettings = {
        global_theme: newSettings.globalTheme || settings.globalTheme,
        pomodoro_color: newSettings.pomodoroColor || settings.pomodoroColor,
        short_break_color:
          newSettings.shortBreakColor || settings.shortBreakColor,
        long_break_color: newSettings.longBreakColor || settings.longBreakColor,
        times: newSettings.times || settings.times,
        sessions: newSettings.sessions || settings.sessions,
        auto_start_breaks:
          newSettings.autoStartBreaks !== undefined
            ? newSettings.autoStartBreaks
            : settings.autoStartBreaks,
        auto_delete_completed_tasks:
          newSettings.autoDeleteCompletedTasks !== undefined
            ? newSettings.autoDeleteCompletedTasks
            : settings.autoDeleteCompletedTasks,
      };
      if (user) {
        await api.updateSettings(updatedSettings);
      }
      setSettings((prev) => ({ ...prev, ...newSettings }));
    } catch (error) {
      console.error('Error updating settings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
