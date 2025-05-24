import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import type { Settings } from '../context/SettingsContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const themes = [
  { id: 'light', name: 'Light' },
  { id: 'dark', name: 'Dark' },
  { id: 'system', name: 'System' },
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
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <div className="flex justify-center items-center p-6">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-medium">Settings</DialogTitle>
          <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Time (minutes)</h3>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Input
                    type="number"
                    min="1"
                    max="60"
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
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    min="1"
                    max="60"
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
                    className="w-full"
                  />
                </div>
                <div>
                  <Input
                    type="number"
                    min="1"
                    max="60"
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
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="autostart-breaks" className="text-sm font-medium">Autostart breaks</Label>
              <Switch
                id="autostart-breaks"
                checked={localSettings.autoStartBreaks || false}
                onCheckedChange={(checked) => {
                  setLocalSettings({
                    ...localSettings,
                    autoStartBreaks: checked,
                  });
                }}
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2">Theme</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Color theme</h4>
                <div className="flex gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      className={cn(
                        "h-8 w-8 rounded-md border border-input",
                        localSettings.globalTheme === theme.id && "ring-2 ring-ring ring-offset-2"
                      )}
                      onClick={() =>
                        setLocalSettings({
                          ...localSettings,
                          globalTheme: theme.id,
                        })
                      }
                      aria-label={theme.name}
                    ></button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              Save Changes
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
