import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem, CheckInRecord, ManualProduct, ShelfItem, ToastMessage, UserState } from '../types';
import { daysBetween, getTodayDateStr } from '../lib/statusEngine';
import { getLevelInfo } from '../lib/xpEngine';
import { soundEffects } from '../lib/soundEffects';

const CART_STORAGE_KEY = 'be_bodywise_cart_v1';

interface AppContextType {
  user: UserState | null;
  isLoggedIn: boolean;
  login: (email: string) => boolean;
  signup: (firstName: string, email: string) => void;
  logout: () => void;
  toasts: ToastMessage[];
  addToast: (title: string, message?: string, type?: 'success' | 'xp' | 'info') => void;
  removeToast: (id: string) => void;
  logProductApplication: (shelfItemId: string) => void;
  unlogProductApplication: (shelfItemId: string) => void;
  saveCheckIn: (shelfItemId: string, checkIn: Omit<CheckInRecord, 'date'>) => void;
  addProductToShelf: (productId?: string, manual?: ManualProduct, customStartDate?: string, when?: string, frequency?: string, instructions?: string) => string;
  removeProductFromShelf: (shelfItemId: string) => void;
  updateShelfItemStartDate: (shelfItemId: string, newStartDate: string) => void;
  completeProductMatch: (answers: any, productIds: string[]) => void;
  completeWeeklyDecoderMission: () => void;
  toggleMission: (missionId: string, xpValue?: number) => void;
  todayStr: string;
  currentDay: number;
  setSimulatedDay: (targetDay: number) => void;
  soundEnabled: boolean;
  toggleSound: () => boolean;
  // Shopping Cart State
  cart: CartItem[];
  addToCart: (productId: string, quantity?: number) => void;
  updateCartQuantity: (productId: string, delta: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartItemCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'be_bodywise_users_v2';
const CURRENT_USER_EMAIL_KEY = 'be_bodywise_current_user_email_v2';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    const saved = localStorage.getItem(CURRENT_USER_EMAIL_KEY);
    if (saved && saved.toLowerCase() === 'aanya@example.com') {
      localStorage.removeItem(CURRENT_USER_EMAIL_KEY);
      return null;
    }
    return saved;
  });

  const [usersMap, setUsersMap] = useState<Record<string, UserState>>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed['aanya@example.com']) {
          delete parsed['aanya@example.com'];
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse users from localStorage', e);
      }
    }
    return {};
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

  const getDateNDaysAgo = (n: number): string => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const currentDay: number = (() => {
    if (!user || !user.shelf || user.shelf.length === 0) return 1;
    const days = user.shelf.map(item => {
      const diff = daysBetween(item.startDate, todayStr);
      return Math.max(1, diff + 1);
    });
    return Math.max(...days, 1);
  })();

  const setSimulatedDay = (targetDay: number) => {
    const boundedDay = Math.max(1, Math.min(90, Math.round(targetDay)));
    if (!user || !currentUserEmail) return;

    const currentLead = currentDay;
    const delta = boundedDay - currentLead;

    updateUser(prev => {
      const updatedShelf = prev.shelf.map(item => {
        const oldItemDay = Math.max(1, daysBetween(item.startDate, todayStr) + 1);
        const newItemDay = Math.max(1, Math.min(90, oldItemDay + delta));
        const newStartDate = getDateNDaysAgo(newItemDay - 1);

        // Populate logs ONLY for past days (1 to N).
        // Day 0 (today) is kept unlogged so the user can log in that product for the day.
        const newLogs: string[] = [];
        const isDaily = (item.frequency || 'Daily').toLowerCase().includes('daily');
        const maxPastDays = Math.max(0, newItemDay - 1);
        const maxLogs = isDaily ? maxPastDays : Math.ceil(maxPastDays * 0.4);
        for (let i = 1; i <= Math.min(28, maxLogs); i++) {
          newLogs.push(getDateNDaysAgo(i));
        }

        return {
          ...item,
          startDate: newStartDate,
          logs: newLogs,
        };
      });

      const newStreak = Math.max(0, Math.min(boundedDay - 1, Math.round((boundedDay - 1) * 0.8)));
      const newXp = Math.min(1600, Math.round(50 + ((boundedDay - 1) / 90) * 1400));

      return {
        ...prev,
        streak: newStreak,
        xp: newXp,
        shelf: updatedShelf,
        // Reset today's missions for the newly active day so the user can check them
        missions: {
          ...prev.missions,
          [todayStr]: [],
        },
      };
    });

    addToast(
      `Switched to Day ${boundedDay} of 90`,
      `Ready to log Day ${boundedDay} applications & missions.`,
      'info'
    );
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

  const unlogProductApplication = (shelfItemId: string) => {
    if (!user) return;
    const targetItem = user.shelf.find(s => s.id === shelfItemId);
    if (!targetItem) return;

    if (!targetItem.logs.includes(todayStr)) {
      return;
    }

    updateUser(prev => {
      const updatedShelf = prev.shelf.map(item => {
        if (item.id === shelfItemId) {
          return {
            ...item,
            logs: (item.logs || []).filter(d => d !== todayStr),
          };
        }
        return item;
      });

      const { streak, bestStreak } = recalculateStreak(updatedShelf, prev.streak, prev.bestStreak);
      const newXp = Math.max(0, prev.xp - 10);

      const dateMissions = (prev.missions[todayStr] || []).filter(m => m !== `apply-${shelfItemId}`);
      const updatedMissions = {
        ...prev.missions,
        [todayStr]: dateMissions,
      };

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
    addToast(`${productName} unlogged for today`, 'Marked as pending', 'info');
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
    try {
      localStorage.setItem(
        'be_bodywise_assessment_recommendation',
        JSON.stringify({
          category: answers?.primaryCategory || answers?.focus?.[0],
          answers,
          recommendedProductIds: productIds,
          completedAt: Date.now(),
        })
      );
    } catch (e) {
      console.error('Failed to save assessment to localStorage', e);
    }

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
      soundEffects.playChime();
      addToast('Decoder review completed · +25 XP', 'Weekly clinical review recorded', 'xp');
    }
  };

  const toggleMission = (missionId: string, xpValue: number = 20) => {
    if (!user) return;
    const currentMissions = user.missions[todayStr] || [];
    const isDone = currentMissions.includes(missionId);

    if (isDone) {
      // Toggle off
      updateUser(prev => ({
        ...prev,
        xp: Math.max(0, prev.xp - xpValue),
        missions: {
          ...prev.missions,
          [todayStr]: (prev.missions[todayStr] || []).filter(m => m !== missionId),
        },
      }));
      addToast('Mission unselected', undefined, 'info');
    } else {
      // Toggle on
      updateUser(prev => ({
        ...prev,
        xp: prev.xp + xpValue,
        missions: {
          ...prev.missions,
          [todayStr]: [...(prev.missions[todayStr] || []), missionId],
        },
      }));
      soundEffects.playChime();
      addToast(`+${xpValue} XP · Mission completed`, undefined, 'xp');
    }
  };

  // --- Shopping Cart State & Management ---
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(CART_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse cart', e);
      }
    }
    return [{ productId: 'prod-body-3', quantity: 1 }];
  });

  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to persist cart', e);
    }
  }, [cart]);

  const addToCart = (productId: string, quantity: number = 1) => {
    setCart(prev => {
      const existing = prev.find(item => item.productId === productId);
      if (existing) {
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { productId, quantity }];
    });
    soundEffects.playChime();
    setIsCartOpen(true);
    addToast('Added to bag', 'Free delivery on orders over ₹499', 'success');
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.productId === productId) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.productId !== productId));
    addToast('Item removed from bag', undefined, 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        signup,
        logout,
        toasts,
        addToast,
        removeToast,
        logProductApplication,
        unlogProductApplication,
        saveCheckIn,
        addProductToShelf,
        removeProductFromShelf,
        updateShelfItemStartDate,
        completeProductMatch,
        completeWeeklyDecoderMission,
        toggleMission,
        todayStr,
        currentDay,
        setSimulatedDay,
        soundEnabled,
        toggleSound,
        cart,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartItemCount,
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
