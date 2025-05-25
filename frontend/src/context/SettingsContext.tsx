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
  const [settings, setSettings] = useState<Settings>(() => {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
      try {
        return JSON.parse(savedSettings);
      } catch (error) {
        console.error('Error parsing saved settings from localStorage:', error);
        return defaultSettings;
      }
    } 
    return defaultSettings;
  });
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const loadInitialSettings = async () => {
      setLoading(true);
      const savedSettings = localStorage.getItem('userSettings');
      let localSettingsToApply = defaultSettings;
      if (savedSettings) {
        try {
          localSettingsToApply = { ...defaultSettings, ...JSON.parse(savedSettings) };
        } catch (error) {
          console.error('Error parsing saved settings from localStorage:', error);
        }
      }

      if (user) {
        try {
          const apiSettings = await api.getSettings();
          // Merge API settings with local, API takes precedence for authenticated users
          const mergedSettings = {
            ...localSettingsToApply, // Start with local or default
            id: apiSettings.id,
            user_id: user.id, // Ensure user_id is set from auth
            globalTheme: apiSettings.global_theme,
            pomodoroColor: apiSettings.pomodoro_color,
            shortBreakColor: apiSettings.short_break_color,
            longBreakColor: apiSettings.long_break_color,
            times: apiSettings.times,
            sessions: apiSettings.sessions || [],
            autoStartBreaks: apiSettings.auto_start_breaks ?? false,
            autoDeleteCompletedTasks: apiSettings.auto_delete_completed_tasks ?? false,
          };
          setSettings(mergedSettings);
          localStorage.setItem('userSettings', JSON.stringify(mergedSettings)); // Update local storage with merged settings
        } catch (error) {
          console.error('Error loading settings from API, using local/default:', error);
          setSettings(localSettingsToApply); // Fallback to local/default if API fails
        }
      } else {
        setSettings(localSettingsToApply); // For non-authenticated users, apply local/default
      }
      setLoading(false);
    };

    loadInitialSettings();
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
      const settingsToSave = { ...settings, ...newSettings };
      
      // Prepare settings for API (snake_case)
      const apiFormattedSettings = {
        global_theme: settingsToSave.globalTheme,
        pomodoro_color: settingsToSave.pomodoroColor,
        short_break_color: settingsToSave.shortBreakColor,
        long_break_color: settingsToSave.longBreakColor,
        times: settingsToSave.times,
        sessions: settingsToSave.sessions,
        auto_start_breaks: settingsToSave.autoStartBreaks,
        auto_delete_completed_tasks: settingsToSave.autoDeleteCompletedTasks,
      };

      if (user) {
        await api.updateSettings(apiFormattedSettings);
      }
      // Update local state and localStorage
      setSettings(settingsToSave);
      localStorage.setItem('userSettings', JSON.stringify(settingsToSave));
    } catch (error) {
      console.error('Error updating settings:', error);
      // Optionally, revert local state if API call fails and user is logged in
      // if (user) setSettings(settings); // Revert to previous settings
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
