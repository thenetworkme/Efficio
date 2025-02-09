import { Dialog } from '@headlessui/react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import type { Settings } from '../context/SettingsContext';
import {
  Dialog as diag,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Music, Volume2 } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const themes = [
  { id: 'light', name: 'Light Theme' },
  { id: 'dark', name: 'Dark Theme' },
  { id: 'system', name: 'System Theme' },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings } = useSettings();
  const { user } = useAuth();
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSave = async () => {
    if (!localSettings) return;
    try {
      if (user) {
        await updateSettings(localSettings);
      } else {
        updateSettings({
          ...localSettings,
          id: 'default',
          user_id: 'default',
        });
      }
      onClose();
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  if (!localSettings || !settings) {
    return (
      <Dialog open={isOpen} onClose={onClose} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-white p-6 w-full">
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-lg rounded-xl bg-white p-6 w-full">
          <Dialog.Title className="text-xl font-bold mb-6">
            Settings
          </Dialog.Title>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Theme</h3>
              <div className="grid grid-cols-3 gap-3">
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`p-2 rounded border transition-colors ${
                      localSettings.globalTheme === theme.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        globalTheme: theme.id,
                      })
                    }
                  >
                    {theme.name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Timer Colors</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <label className="w-32">Pomodoro:</label>
                  <input
                    type="color"
                    value={localSettings.pomodoroColor}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        pomodoroColor: e.target.value,
                      })
                    }
                    className="h-8 w-14"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32">Short Break:</label>
                  <input
                    type="color"
                    value={localSettings.shortBreakColor}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        shortBreakColor: e.target.value,
                      })
                    }
                    className="h-8 w-14"
                  />
                </div>
                <div className="flex items-center gap-3">
                  <label className="w-32">Long Break:</label>
                  <input
                    type="color"
                    value={localSettings.longBreakColor}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        longBreakColor: e.target.value,
                      })
                    }
                    className="h-8 w-14"
                  />
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Timer (minutes)</h3>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Pomodoro</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    value={localSettings.times.pomodoro}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(60, Number(e.target.value))
                      );
                      setLocalSettings({
                        ...localSettings,
                        times: {
                          ...localSettings.times,
                          pomodoro: value,
                        },
                      });
                    }}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Short Break</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    value={localSettings.times.shortBreak}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(60, Number(e.target.value))
                      );
                      setLocalSettings({
                        ...localSettings,
                        times: {
                          ...localSettings.times,
                          shortBreak: value,
                        },
                      });
                    }}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Long Break</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    step="1"
                    value={localSettings.times.longBreak}
                    onChange={(e) => {
                      const value = Math.max(
                        1,
                        Math.min(60, Number(e.target.value))
                      );
                      setLocalSettings({
                        ...localSettings,
                        times: {
                          ...localSettings.times,
                          longBreak: value,
                        },
                      });
                    }}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
