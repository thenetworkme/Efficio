import { useState } from 'react';
import PomodoroTimer from './components/PomodoroTimer';
import SettingsModal from './components/SettingsModal';
import LoginModal from './components/LoginModal';
import { AuthProvider } from './context/AuthContext';
import { SettingsProvider } from './context/SettingsContext';
import { useAuth } from './context/AuthContext';
import { useSettings } from './context/SettingsContext';
import { MoreVertical } from 'lucide-react';

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
  const { user, signOut, signInWithGithub } = useAuth();
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
            {user ? (
              <>
                <button className="text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors">
                  Report
                </button>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded text-sm transition-colors"
                >
                  Settings
                </button>
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
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => signInWithGithub()}
                  className="text-white bg-[#24292F] hover:bg-[#2c3238] px-4 py-2 rounded text-sm transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.022A9.606 9.606 0 0112 6.82c.85.004 1.705.115 2.504.337 1.909-1.29 2.747-1.022 2.747-1.022.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"
                    />
                  </svg>
                  Registrarse
                </button>
                <div className="relative">
                  <button
                    onClick={() => setIsLoginOpen(true)}
                    className="text-white bg-white/10 hover:bg-white/20 p-2 rounded text-sm transition-colors"
                  >
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-[620px] mx-auto px-5 py-4">
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
