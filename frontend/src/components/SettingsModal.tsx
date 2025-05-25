import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from './ui/select';
import {
  CheckCircle,
  X,
  Clock,
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

// No necesitamos ExtendedSettings ya que autoDeleteCompletedTasks está en Settings



export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const { } = useAuth(); // Mantenemos la importación pero no usamos user
  const [localSettings, setLocalSettings] = useState<Settings>(settings);
  const [editingColor, setEditingColor] = useState<string | null>(null);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);



  const handleSave = async () => {
    if (!localSettings) return;
    try {
      await updateSettings(localSettings);
      // Guardar en localStorage para usuarios no autenticados o autenticados
      localStorage.setItem('userSettings', JSON.stringify(localSettings));
      toast.success('Configuración guardada', {
        description: 'Tus preferencias han sido actualizadas correctamente.',
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast.error('Error al guardar la configuración', {
        description: 'Hubo un problema al guardar tus preferencias.',
        duration: 5000,
      });
      console.error('Error saving settings:', error);
    }
  };

  if (settingsLoading || !localSettings) {
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
      <DialogContent className="bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-lg max-w-md" closeButton={false}>
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="flex items-center justify-between w-full">
            <span className="text-xl font-semibold">Settings</span>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 p-4">
          {/* Timer Durations */}
          <div>
            <Label className="block font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Clock className="h-5 w-5 text-blue-500" /> Tiempo (minutos)
            </Label>
            <div className="grid grid-cols-3 gap-4">
              <div title="Set Pomodoro Duration">
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

              <div title="Set Short Break Duration">
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

              <div title="Set Long Break Duration">
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

          <div className="flex items-center justify-between py-2">
            <Label htmlFor="autostart-breaks" className="text-sm font-medium">
              Iniciar descansos automáticamente
            </Label>
            <Switch
              id="autostart-breaks"
              checked={localSettings.autoStartBreaks ?? false}
              onCheckedChange={(checked) => {
                setLocalSettings({
                  ...localSettings,
                  autoStartBreaks: checked,
                });
              }}
            />
          </div>

          <div>
            <Label className="block font-semibold mb-4 text-gray-800">
              Theme
            </Label>
            <div className="space-y-4">
              <Label className="block text-sm font-medium text-gray-600 mb-2">
                Color theme
              </Label>
              <div className="grid grid-cols-3 gap-4">
                {[ 
                  { key: 'pomodoro', name: 'Pomodoro', color: localSettings.pomodoroColor, setColor: (color: string) => setLocalSettings({...localSettings, pomodoroColor: color}) },
                  { key: 'shortBreak', name: 'Descanso Corto', color: localSettings.shortBreakColor, setColor: (color: string) => setLocalSettings({...localSettings, shortBreakColor: color}) },
                  { key: 'longBreak', name: 'Descanso Largo', color: localSettings.longBreakColor, setColor: (color: string) => setLocalSettings({...localSettings, longBreakColor: color}) },
                ].map(item => (
                  <div key={item.key} className="flex flex-col items-center gap-2">
                    <span className="text-xs text-gray-600">{item.name}</span>
                    <div className="relative">
                      <button
                        className="h-10 w-10 rounded-md border border-input"
                        style={{ backgroundColor: item.color }}
                        onClick={() => setEditingColor(editingColor === item.key ? null : item.key)}
                        aria-label={`${item.name} color`}
                      />
                      {editingColor === item.key && (
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 z-10 bg-white p-2 rounded-md shadow-lg border w-32">
                          <input
                            type="color"
                            value={item.color}
                            onChange={(e) => {
                              item.setColor(e.target.value);
                            }}
                            onBlur={() => setEditingColor(null)}
                            className="w-full h-8 cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-4 pt-4 border-t">
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-2"
          >
            <CheckCircle className="h-4 w-4" /> Guardar Cambios
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
