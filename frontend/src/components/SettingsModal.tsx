import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from './ui/dialog';
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
  X,
} from 'lucide-react';
import { useSettings } from '../context/SettingsContext';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import type { Settings } from '../context/SettingsContext';
import { toast } from 'sonner';
import { cn } from '../lib/utils';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// No necesitamos ExtendedSettings ya que autoDeleteCompletedTasks está en Settings

const themes = [
  { id: 'light', name: 'Claro' },
  { id: 'dark', name: 'Oscuro' },
  { id: 'system', name: 'Sistema' },
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
            <SettingsIcon className="h-6 w-6 text-blue-600" /> Configuración
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col space-y-6 p-2">
          {/* Timer Colors */}
          <div>
            <Label className="block font-semibold mb-4 flex items-center gap-2 text-gray-800">
              <Palette className="h-5 w-5 text-blue-500" /> Colores del
              Temporizador
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
                    Descanso Corto
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
                    Descanso Largo
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
              <Clock className="h-5 w-5 text-blue-500" /> Tiempo (minutos)
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
                    Descanso Corto
                  </Label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div title="Set Long Break Duration">
                <div>
                  <Label className="block text-sm font-medium text-gray-600 mb-2">
                    Descanso Largo
                  </Label>
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="autostart-breaks"
                  className="text-sm font-medium"
                >
                  Iniciar descansos automáticamente
                </Label>
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

              <div className="flex items-center justify-between">
                <Label
                  htmlFor="auto-delete-tasks"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4 text-red-500" /> Eliminar tareas al
                  completar
                </Label>
                <Switch
                  id="auto-delete-tasks"
                  checked={localSettings.autoDeleteCompletedTasks || false}
                  onCheckedChange={(checked) => {
                    setLocalSettings({
                      ...localSettings,
                      autoDeleteCompletedTasks: checked,
                    });
                  }}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium mb-2">Tema</h3>
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Tema de color</h4>
                <div className="flex gap-2">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      className={cn(
                        'h-8 w-8 rounded-md border border-input',
                        localSettings.globalTheme === theme.id &&
                          'ring-2 ring-ring ring-offset-2'
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
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 mt-8">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </Button>
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
