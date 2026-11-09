import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CheckInRecord, ManualProduct, ShelfItem, ToastMessage, UserState } from '../types';
import { createDemoUser } from '../data/seed';
import { daysBetween, getTodayDateStr } from '../lib/statusEngine';
import { getLevelInfo } from '../lib/xpEngine';
import { soundEffects } from '../lib/soundEffects';

interface AppContextType {
  user: UserState | null;
  isLoggedIn: boolean;
  login: (email: string) => boolean;
  signup: (firstName: string, email: string) => void;
  loginAsDemo: () => void;
  logout: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'xp' | 'info') => void;
  removeToast: (id: string) => void;
  logProductApplication: (shelfItemId: string) => void;
  saveCheckIn: (shelfItemId: string, checkIn: Omit<CheckInRecord, 'date'>) => void;
  addProductToShelf: (productId?: string, manual?: ManualProduct, customStartDate?: string, when?: string, frequency?: string, instructions?: string) => string;
  removeProductFromShelf: (shelfItemId: string) => void;
  updateShelfItemStartDate: (shelfItemId: string, newStartDate: string) => void;
  completeProductMatch: (answers: any, productIds: string[]) => void;
  completeWeeklyDecoderMission: () => void;
  todayStr: string;
  soundEnabled: boolean;
  toggleSound: () => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'be_bodywise_users_v2';
const CURRENT_USER_EMAIL_KEY = 'be_bodywise_current_user_email_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_USER_EMAIL_KEY);
  });

  const [usersMap, setUsersMap] = useState<Record<string, UserState>>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse users from localStorage', e);
      }
    }
    // Default with demo user
    const demo = createDemoUser();
    return {
      [demo.profile.email.toLowerCase()]: demo,
    };
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(soundEffects.enabled);

  const toggleSound = () => {
    const next = soundEffects.toggleSound();
    setSoundEnabled(next);
    addToast(next ? 'Sound effects enabled' : 'Sound effects muted', undefined, 'info');
    return next;
  };

  const todayStr = getTodayDateStr();

  // Save usersMap to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersMap));
    } catch (e) {
      console.error('Failed to persist users', e);
    }
  }, [usersMap]);

  // Save current user email
  useEffect(() => {
    if (currentUserEmail) {
      localStorage.setItem(CURRENT_USER_EMAIL_KEY, currentUserEmail);
    } else {
      localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
    }
  }, [currentUserEmail]);

  const user: UserState | null = currentUserEmail && usersMap[currentUserEmail.toLowerCase()]
    ? usersMap[currentUserEmail.toLowerCase()]
    : null;

  const addToast = (title: string, message?: string, type: 'success' | 'xp' | 'info' = 'success') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = { id, title, message, type };
    setToasts(prev => [...prev, newToast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const updateUser = (updater: (prevUser: UserState) => UserState) => {
    if (!currentUserEmail) return;
    const key = currentUserEmail.toLowerCase();
    setUsersMap(prev => {
      const current = prev[key];
      if (!current) return prev;
      const updated = updater(current);
      return { ...prev, [key]: updated };
    });
  };

  const login = (email: string): boolean => {
    const key = email.trim().toLowerCase();
    if (usersMap[key]) {
      setCurrentUserEmail(key);
      addToast('Welcome back', `Signed in as ${usersMap[key].profile.firstName}`);
      return true;
    }
    // If user does not exist, create a fresh profile
    const newUser: UserState = {
      profile: {
        firstName: email.split('@')[0] || 'Friend',
        email: key,
      },
      xp: 0,
      streak: 0,
      bestStreak: 0,
      shelf: [],
      missions: {},
      oneTimeAwards: [],
    };
    setUsersMap(prev => ({ ...prev, [key]: newUser }));
    setCurrentUserEmail(key);
    addToast('Account created', `Welcome, ${newUser.profile.firstName}`);
    return true;
  };

  const signup = (firstName: string, email: string) => {
    const key = email.trim().toLowerCase();
    const newUser: UserState = {
      profile: {
        firstName: firstName.trim() || 'Friend',
        email: key,
      },
      xp: 0,
      streak: 0,
      bestStreak: 0,
      shelf: [],
      missions: {},
      oneTimeAwards: [],
    };
    setUsersMap(prev => ({ ...prev, [key]: newUser }));
    setCurrentUserEmail(key);
    addToast(`Welcome, ${newUser.profile.firstName} — let's find your match`, undefined, 'success');
  };

  const loginAsDemo = () => {
    const demo = createDemoUser();
    const key = demo.profile.email.toLowerCase();
    setUsersMap(prev => ({ ...prev, [key]: demo }));
    setCurrentUserEmail(key);
    addToast('Demo account loaded', 'Welcome back, Aanya · Day 52');
  };

  const logout = () => {
    setCurrentUserEmail(null);
    addToast('Signed out', 'See you tomorrow on your care journey');
  };

  // Check and recalculate streak based on daily applications
  const recalculateStreak = (shelf: ShelfItem[], currentStreak: number, bestStreak: number): { streak: number; bestStreak: number } => {
    const allLogs = new Set<string>();
    shelf.forEach(item => {
      (item.logs || []).forEach(d => allLogs.add(d));
    });

    let streak = 0;
    // Check backwards from today or yesterday
    let checkDay = todayStr;
    const hasToday = allLogs.has(checkDay);

    if (!hasToday) {
      // Check if logged yesterday
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yStr = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
      if (!allLogs.has(yStr)) {
        return { streak: 0, bestStreak };
      }
      checkDay = yStr;
    }

    // Walk backwards consecutive days
    const curDate = new Date(checkDay);
    while (true) {
      const y = curDate.getFullYear();
      const m = String(curDate.getMonth() + 1).padStart(2, '0');
      const d = String(curDate.getDate()).padStart(2, '0');
      const dateStr = `${y}-${m}-${d}`;

      if (allLogs.has(dateStr)) {
        streak++;
        curDate.setDate(curDate.getDate() - 1);
      } else {
        break;
      }
    }

    const newBest = Math.max(bestStreak, streak);
    return { streak, bestStreak: newBest };
  };

  const logProductApplication = (shelfItemId: string) => {
    if (!user) return;
    const targetItem = user.shelf.find(s => s.id === shelfItemId);
    if (!targetItem) return;

    if (targetItem.logs.includes(todayStr)) {
      addToast('Already logged today', 'This application was already marked for today.');
      return;
    }

    updateUser(prev => {
      const updatedShelf = prev.shelf.map(item => {
        if (item.id === shelfItemId) {
          return {
            ...item,
            logs: [...(item.logs || []), todayStr],
          };
        }
        return item;
      });

      const { streak, bestStreak } = recalculateStreak(updatedShelf, prev.streak, prev.bestStreak);

      const oldLevel = getLevelInfo(prev.xp).level;
      const newXp = prev.xp + 10;
      const newLevel = getLevelInfo(newXp).level;

      const dateMissions = prev.missions[todayStr] || [];
      const missionId = `apply-${shelfItemId}`;
      const updatedMissions = {
        ...prev.missions,
        [todayStr]: dateMissions.includes(missionId) ? dateMissions : [...dateMissions, missionId],
      };

      if (newLevel > oldLevel) {
        setTimeout(() => {
          addToast(`Level Up! You are now Level ${newLevel}`, getLevelInfo(newXp).title, 'xp');
        }, 500);
      }

      return {
        ...prev,
        shelf: updatedShelf,
        xp: newXp,
        streak,
        bestStreak,
        missions: updatedMissions,
      };
    });

    const productName = targetItem.productId
      ? (targetItem.productId.split('-').slice(1).join(' '))
      : (targetItem.manual?.name || 'Product');
    soundEffects.playChime();
    addToast(`+10 XP · ${productName} logged`, undefined, 'xp');
  };

  const saveCheckIn = (shelfItemId: string, checkIn: Omit<CheckInRecord, 'date'>) => {
    if (!user) return;
    soundEffects.playChime();

    updateUser(prev => {
      const updatedShelf = prev.shelf.map(item => {
        if (item.id === shelfItemId) {
          const newCheckIn: CheckInRecord = {
            ...checkIn,
            date: todayStr,
          };
          // Filter out existing for today if updating
          const filtered = (item.checkIns || []).filter(c => c.date !== todayStr);
          return {
            ...item,
            checkIns: [newCheckIn, ...filtered],
          };
        }
        return item;
      });

      const newXp = prev.xp + 40;
      return {
        ...prev,
        shelf: updatedShelf,
        xp: newXp,
      };
    });

    addToast('Check-in saved · +40 XP', 'Results Decoder status updated with your observations', 'xp');
  };

  const addProductToShelf = (
    productId?: string,
    manual?: ManualProduct,
    customStartDate?: string,
    when = 'AM',
    frequency = 'Daily',
    instructions = ''
  ): string => {
    if (!user) return '';

    const newId = `shelf-${Date.now()}`;
    const startDate = customStartDate || todayStr;

    const newItem: ShelfItem = {
      id: newId,
      productId,
      manual,
      startDate,
      when,
      frequency,
      instructions: instructions || (manual ? 'Apply gently as targeted.' : 'Apply as directed.'),
      logs: [startDate], // start date counts as Day 1 logged
      checkIns: [
        {
          date: startDate,
          score: 1,
          irritation: false,
          note: 'Baseline Day 1 start point recorded.',
        },
      ],
    };

    updateUser(prev => {
      const updatedShelf = [newItem, ...prev.shelf];
      const { streak, bestStreak } = recalculateStreak(updatedShelf, prev.streak, prev.bestStreak);
      return {
        ...prev,
        shelf: updatedShelf,
        streak,
        bestStreak,
      };
    });

    return newId;
  };

  const removeProductFromShelf = (shelfItemId: string) => {
    if (!user) return;
    updateUser(prev => ({
      ...prev,
      shelf: prev.shelf.filter(s => s.id !== shelfItemId),
    }));
    addToast('Product removed', 'Removed from your shelf');
  };

  const updateShelfItemStartDate = (shelfItemId: string, newStartDate: string) => {
    if (!user) return;
    updateUser(prev => ({
      ...prev,
      shelf: prev.shelf.map(item => {
        if (item.id === shelfItemId) {
          return {
            ...item,
            startDate: newStartDate,
          };
        }
        return item;
      }),
    }));
    addToast('Start date updated', 'Decoder timeline recalculated');
  };

  const completeProductMatch = (answers: any, productIds: string[]) => {
    if (!user) return;
    const isFirstTime = !user.oneTimeAwards.includes('match_done');

    updateUser(prev => {
      const newAwards = isFirstTime ? [...prev.oneTimeAwards, 'match_done'] : prev.oneTimeAwards;
      const newXp = isFirstTime ? prev.xp + 50 : prev.xp;
      return {
        ...prev,
        matchAnswers: answers,
        matchResults: productIds,
        xp: newXp,
        oneTimeAwards: newAwards,
      };
    });

    if (isFirstTime) {
      addToast('Your matches are ready · +50 XP', 'Formulas ranked for your personal profile', 'xp');
    } else {
      addToast('Assessment updated', 'Your match recommendations have refreshed', 'info');
    }
  };

  const completeWeeklyDecoderMission = () => {
    if (!user) return;
    const currentMissions = user.missions[todayStr] || [];
    const missionId = 'weekly-decoder-review';
    if (!currentMissions.includes(missionId)) {
      updateUser(prev => ({
        ...prev,
        xp: prev.xp + 25,
        missions: {
          ...prev.missions,
          [todayStr]: [...currentMissions, missionId],
        },
      }));
      addToast('Decoder review completed · +25 XP', 'Personalised AI insights awarded', 'xp');
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        loginAsDemo,
        logout,
        toasts,
        addToast,
        removeToast,
        logProductApplication,
        saveCheckIn,
        addProductToShelf,
        removeProductFromShelf,
        updateShelfItemStartDate,
        completeProductMatch,
        completeWeeklyDecoderMission,
        todayStr,
        soundEnabled,
        toggleSound,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
