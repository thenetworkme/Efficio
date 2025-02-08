export interface UserSettings {
  id: string;
  user_id: string;
  global_theme: string;
  pomodoro_color: string;
  short_break_color: string;
  long_break_color: string;
  times: {
    pomodoro: number;
    shortBreak: number;
    longBreak: number;
  };
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  github_id: string;
  username: string;
  display_name: string;
  avatar_url: string;
  email: string;
  provider: string;
  github_access_token: string;
  last_sign_in: string;
  settings?: UserSettings;
}
