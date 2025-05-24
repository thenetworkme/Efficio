import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import {
  Paintbrush,
  Palette,
  Timer,
  CheckCircle,
  Settings as SettingsIcon,
  Trash2,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import type { Settings } from '../context/SettingsContext';
import { toast } from 'sonner';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ExtendedSettings extends Settings {
  autoDeleteCompletedTasks?: boolean;
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
  // Using sonner toast instead of Chakra UI

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
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
    } catch (error) {
      toast({
        title: 'Error saving settings',
        description: 'There was a problem saving your preferences.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error saving settings:', error);
    }
  };

  if (!localSettings || !settings) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-transparent border-none shadow-none">
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-lg max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <SettingsIcon className="h-6 w-6 text-blue-600" /> Settings
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 p-2">
          {/* Timer Colors */}
          <div>
            <Label className="block font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Palette className="h-5 w-5 text-blue-500" /> Timer Colors
            </Label>
            <div className="flex justify-center space-x-8">
              <div title="Pomodoro Timer Color">
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block text-center">
                    Pomodoro
                  </Label>
                  <Input
                    type="color"
                    value={localSettings.pomodoroColor}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        pomodoroColor: e.target.value,
                      })
                    }
                    className="w-14 h-14 rounded-lg cursor-pointer p-1 border-2 border-gray-200 hover:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              <div title="Short Break Timer Color">
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block text-center">
                    Short Break
                  </Label>
                  <Input
                    type="color"
                    value={localSettings.shortBreakColor}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        shortBreakColor: e.target.value,
                      })
                    }
                    className="w-14 h-14 rounded-lg cursor-pointer p-1 border-2 border-gray-200 hover:border-blue-400 transition-colors"
                  />
                </div>
              </div>

              <div title="Long Break Timer Color">
                <div>
                  <Label className="text-sm font-medium text-gray-600 mb-2 block text-center">
                    Long Break
                  </Label>
                  <Input
                    type="color"
                    value={localSettings.longBreakColor}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        longBreakColor: e.target.value,
                      })
                    }
                    className="w-14 h-14 rounded-lg cursor-pointer p-1 border-2 border-gray-200 hover:border-blue-400 transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          <hr className="my-4 border-gray-200" />

          {/* Timer Durations */}
          <div>
            <Label className="block font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Timer className="h-5 w-5 text-blue-500" /> Timer Durations
            </Label>
            <div className="grid grid-cols-3 gap-6">
              <div title="Set Pomodoro Duration">
                <div>
                  <Label className="block text-sm font-medium text-gray-600 mb-2">
                    Pomodoro
                  </Label>
                  <Input
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div title="Set Short Break Duration">
                <div>
                  <Label className="block text-sm font-medium text-gray-600 mb-2">
                    Short Break
                  </Label>
                  <Input
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div title="Set Long Break Duration">
                <div>
                  <Label className="block text-sm font-medium text-gray-600 mb-2">
                    Long Break
                  </Label>
                  <Input
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" /> Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
