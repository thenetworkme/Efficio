import { useState } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import SettingsModal from './components/SettingsModal';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { useAuth } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

function AppContent() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState<
    'pomodoro' | 'shortBreak' | 'longBreak'
  >('pomodoro');
  const { user, signOut } = useAuth();
  const { settings, loading } = useSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor:
          currentMode === 'pomodoro'
            ? settings?.pomodoroColor
            : currentMode === 'shortBreak'
            ? settings?.shortBreakColor
            : settings?.longBreakColor || '#ba4949',
      }}
    >
      <nav
        className="w-full transition-colors duration-300"
        style={{
          backgroundColor:
            currentMode === 'pomodoro'
              ? `${settings?.pomodoroColor}dd`
              : currentMode === 'shortBreak'
              ? `${settings?.shortBreakColor}dd`
              : `${settings?.longBreakColor}dd` || '#ba4949dd',
        }}
      >
        <div className="max-w-[620px] mx-auto px-5 py-3 flex justify-between items-center">
          <div className="text-white font-bold text-2xl">Efficio</div>
          <div className="flex items-center gap-2">
            {user && (
              <button className="text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors">
                Report
              </button>
            )}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors"
            >
              Settings
            </button>
            {user ? (
              <button
                onClick={signOut}
                className="text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors flex items-center gap-2"
              >
                <img
                  src={user.photos?.[0]?.value || '/default-avatar.png'}
                  alt={user.displayName || 'Profile'}
                  className="w-5 h-5 rounded-full"
                />
                Logout
              </button>
            ) : (
              // <button
              //   onClick={() => setIsLoginOpen(true)}
              //   className="text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors"
              // >
              //   Login
              // </button>
              <></>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[620px] mx-auto px-5 py-8">
        <PomodoroTimer
          settings={settings!}
          currentMode={currentMode}
          onModeChange={setCurrentMode}
        />
      </main>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppContent />
      </SettingsProvider>
    </AuthProvider>
  );
}
