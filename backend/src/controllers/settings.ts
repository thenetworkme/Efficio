import { Request, Response, RequestHandler } from 'express';
import { supabase } from '../lib/supabase';
import { User, UserSettings } from '../types/interface';

interface AuthenticatedRequest extends Request {
  user?: User;
}

export const getSettings: RequestHandler = async (req, res): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching settings:', error);
      res.status(500).json({ error: 'Error fetching settings' });
      return;
    }

    res.json(data || getDefaultSettings(userId));
  } catch (error) {
    console.error('Error in getSettings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateSettings: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const userId = (req as AuthenticatedRequest).user?.id;
    if (!userId) {
      res.status(401).json({ error: 'Not authenticated' });
      return;
    }

    const settings: Partial<UserSettings> = {
      ...req.body,
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    let { data, error } = await supabase
      .from('user_settings')
      .update(settings)
      .eq('user_id', userId)
      .select()
      .single();

    if (error?.code === 'PGRST116') {
      const result = await supabase
        .from('user_settings')
        .insert({ ...settings, created_at: new Date().toISOString() })
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error updating settings:', error);
      res.status(500).json({ error: 'Error updating settings' });
      return;
    }

    res.json(data);
  } catch (error) {
    console.error('Error in updateSettings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

function getDefaultSettings(userId: string): UserSettings {
  return {
    user_id: userId,
    globalTheme: 'dark',
    pomodoroColor: '#ef4444',
    shortBreakColor: '#22c55e',
    longBreakColor: '#3b82f6',
    times: {
      pomodoro: 25,
      shortBreak: 5,
      longBreak: 15,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}
