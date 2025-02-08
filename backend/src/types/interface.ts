export interface User {
  id: string;
  github_id?: string;
  username?: string;
  displayName: string;
  photos?: { value: string }[];
  emails?: { value: string }[];
  created_at?: string;
  updated_at?: string;
}

export interface Times {
  pomodoro: number;
  shortBreak: number;
  longBreak: number;
}

export interface UserSettings {
  id?: string;
  user_id: string;
  globalTheme: string;
  pomodoroColor: string;
  shortBreakColor: string;
  longBreakColor: string;
  times: Times;
  created_at?: string;
  updated_at?: string;
}
