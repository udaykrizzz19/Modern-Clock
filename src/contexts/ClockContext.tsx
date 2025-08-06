import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export type TabType = 'alarm' | 'worldclock' | 'stopwatch' | 'timer';
export type ThemeType = 'light' | 'dark';

export interface Alarm {
  id: string;
  time: string;
  days: string[];
  enabled: boolean;
  label?: string;
  sound?: string;
  vibrate?: boolean;
  crescendoMode?: boolean;
  challengeToDismiss?: boolean;
}

export interface WorldClock {
  id: string;
  city: string;
  timezone: string;
  offsetFromLocal: string;
}

export interface Timer {
  id: string;
  duration: number;
  label?: string;
  sound?: string;
  vibrate?: boolean;
}

// Context interface
interface ClockContextType {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  theme: ThemeType;
  toggleTheme: () => void;
  
  // Alarm methods
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  updateAlarm: (id: string, updates: Partial<Omit<Alarm, 'id'>>) => void;
  deleteAlarm: (id: string) => void;
  
  // World Clock methods
  worldClocks: WorldClock[];
  addWorldClock: (worldClock: Omit<WorldClock, 'id'>) => void;
  updateWorldClock: (id: string, updates: Partial<Omit<WorldClock, 'id'>>) => void;
  deleteWorldClock: (id: string) => void;
  
  // Timer methods
  timers: Timer[];
  addTimer: (timer: Omit<Timer, 'id'>) => void;
  updateTimer: (id: string, updates: Partial<Omit<Timer, 'id'>>) => void;
  deleteTimer: (id: string) => void;
}

// Create context
const ClockContext = createContext<ClockContextType | undefined>(undefined);

// Context provider component
interface ClockProviderProps {
  children: ReactNode;
}

export const ClockProvider = ({ children }: ClockProviderProps) => {
  // Retrieve system theme preference
  const prefersDarkMode = 
    typeof window !== 'undefined' && window.matchMedia
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
      : false;

  // Persistent state using localStorage
  const [activeTab, setActiveTab] = useLocalStorage<TabType>('android-clock-active-tab', 'alarm');
  const [theme, setTheme] = useLocalStorage<ThemeType>('android-clock-theme', prefersDarkMode ? 'dark' : 'light');
  const [alarms, setAlarms] = useLocalStorage<Alarm[]>('android-clock-alarms', []);
  const [worldClocks, setWorldClocks] = useLocalStorage<WorldClock[]>('android-clock-world-clocks', []);
  const [timers, setTimers] = useLocalStorage<Timer[]>('android-clock-timers', []);

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(theme);
  }, [theme]);

  // Theme toggle function
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Alarm methods
  const addAlarm = (alarm: Omit<Alarm, 'id'>) => {
    const newAlarm = { ...alarm, id: uuidv4() };
    setAlarms(prev => [...prev, newAlarm]);
  };

  const updateAlarm = (id: string, updates: Partial<Omit<Alarm, 'id'>>) => {
    setAlarms(prev => 
      prev.map(alarm => 
        alarm.id === id ? { ...alarm, ...updates } : alarm
      )
    );
  };

  const deleteAlarm = (id: string) => {
    setAlarms(prev => prev.filter(alarm => alarm.id !== id));
  };

  // World Clock methods
  const addWorldClock = (worldClock: Omit<WorldClock, 'id'>) => {
    const newWorldClock = { ...worldClock, id: uuidv4() };
    setWorldClocks(prev => [...prev, newWorldClock]);
  };

  const updateWorldClock = (id: string, updates: Partial<Omit<WorldClock, 'id'>>) => {
    setWorldClocks(prev => 
      prev.map(worldClock => 
        worldClock.id === id ? { ...worldClock, ...updates } : worldClock
      )
    );
  };

  const deleteWorldClock = (id: string) => {
    setWorldClocks(prev => prev.filter(worldClock => worldClock.id !== id));
  };

  // Timer methods
  const addTimer = (timer: Omit<Timer, 'id'>) => {
    const newTimer = { ...timer, id: uuidv4() };
    setTimers(prev => [...prev, newTimer]);
  };

  const updateTimer = (id: string, updates: Partial<Omit<Timer, 'id'>>) => {
    setTimers(prev => 
      prev.map(timer => 
        timer.id === id ? { ...timer, ...updates } : timer
      )
    );
  };

  const deleteTimer = (id: string) => {
    setTimers(prev => prev.filter(timer => timer.id !== id));
  };

  // Context value
  const contextValue: ClockContextType = {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    
    alarms,
    addAlarm,
    updateAlarm,
    deleteAlarm,
    
    worldClocks,
    addWorldClock,
    updateWorldClock,
    deleteWorldClock,
    
    timers,
    addTimer,
    updateTimer,
    deleteTimer,
  };

  return (
    <ClockContext.Provider value={contextValue}>
      {children}
    </ClockContext.Provider>
  );
};

// Custom hook to use the context
export const useClockContext = () => {
  const context = useContext(ClockContext);
  if (context === undefined) {
    throw new Error('useClockContext must be used within a ClockProvider');
  }
  return context;
};