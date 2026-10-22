import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { Toasts, type ToastMessage } from './components/Toast';
import type { UserProfile } from './types';

export const DEFAULT_USER: UserProfile = {
  id: 'usr_01',
  name: 'Dr. Anita Prasad',
  email: 'anita.prasad@city.gov.in',
  role: 'Chief Resilience Officer',
  department: 'Urban Heat Mitigation Taskforce',
  avatarInitials: 'AP',
  badge: 'Municipal Lead'
};

type AppContextValue = {
  notify: (text: string, type?: 'success' | 'info') => void;
  user: UserProfile | null;
  login: (profile: UserProfile) => void;
  logout: () => void;
};

const AppContext = createContext<AppContextValue>({
  notify: () => undefined,
  user: DEFAULT_USER,
  login: () => undefined,
  logout: () => undefined
});

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const stored = localStorage.getItem('thermacity-user');
      return stored ? (JSON.parse(stored) as UserProfile) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const value = useMemo(
    () => ({
      user,
      login: (profile: UserProfile) => {
        setUser(profile);
        try {
          localStorage.setItem('thermacity-user', JSON.stringify(profile));
        } catch {
          // ignore localStorage error
        }
      },
      logout: () => {
        setUser(null);
        try {
          localStorage.removeItem('thermacity-user');
        } catch {
          // ignore localStorage error
        }
      },
      notify: (text: string, type: 'success' | 'info' = 'success') => {
        const id = Date.now();
        setToasts((items) => [...items, { id, text, type }]);
        window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 3500);
      }
    }),
    [user]
  );

  return (
    <AppContext.Provider value={value}>
      {children}
      <Toasts items={toasts} onDismiss={(id) => setToasts((items) => items.filter((item) => item.id !== id))} />
    </AppContext.Provider>
  );
}
