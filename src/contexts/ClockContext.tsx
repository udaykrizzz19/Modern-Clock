import { createContext, useContext, useEffect, ReactNode, useRef, useState } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { v4 as uuidv4 } from 'uuid';

// Type definitions
export type TabType = 'alarm' | 'worldclock' | 'stopwatch' | 'timer';
export type ThemeType = 'light' | 'dark';

export interface Alarm {
  id: string;
  time: string; // "HH:MM" format
  days: string[];
  enabled: boolean;
  label?: string;
  sound?: string; // Currently a placeholder, but good for future use
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
  alarms: Alarm[];
  addAlarm: (alarm: Omit<Alarm, 'id'>) => void;
  updateAlarm: (id: string, updates: Partial<Omit<Alarm, 'id'>>) => void;
  deleteAlarm: (id: string) => void;
  worldClocks: WorldClock[];
  addWorldClock: (worldClock: Omit<WorldClock, 'id'>) => void;
  updateWorldClock: (id: string, updates: Partial<Omit<WorldClock, 'id'>>) => void;
  deleteWorldClock: (id: string) => void;
  timers: Timer[];
  addTimer: (timer: Omit<Timer, 'id'>) => void;
  updateTimer: (id: string, updates: Partial<Omit<Timer, 'id'>>) => void;
  deleteTimer: (id: string) => void;
  // --- ADDED FOR RINGING ALARM ---
  ringingAlarm: Alarm | null;
  stopRingingAlarm: () => void;
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

  // --- NEW STATE FOR RINGING ALARM ---
  const [ringingAlarm, setRingingAlarm] = useState<Alarm | null>(null);

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
  
  // ============================================================================
  // START: ALARM WATCHER LOGIC - This makes the alarms ring
  // ============================================================================
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const lastTriggeredTimeRef = useRef<string>('');

  useEffect(() => {
    // This line determines the ringing sound.
    // Place your sound file (e.g., 'alarm.mp3') in the /public folder.
    audioRef.current = new Audio('/timer-sound.mp3'); 
    // --- ADDED LOOPING FOR ALARM SOUND ---
    if (audioRef.current) {
      audioRef.current.loop = true;
    }
    Notification.requestPermission(); // Ask for permission to show notifications
  }, []);

  // This is the core "Alarm Watcher" effect. It runs continuously in the background of the app.
  useEffect(() => {
    const checkAlarms = () => {
      const now = new Date();
      const dayMap = ['S', 'M', 'T', 'W', 'T', 'F', 'S']; // JS Days: Sunday=0, Monday=1...
      
      const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const currentDay = dayMap[now.getDay()];

      if (lastTriggeredTimeRef.current === currentTime) {
        return;
      }

      const alarmToRing = alarms.find(alarm => {
        const isOneTimeAlarm = alarm.days.length === 0;
        const isRecurringToday = alarm.days.includes(currentDay);
        return alarm.enabled && alarm.time === currentTime && (isOneTimeAlarm || isRecurringToday);
      });

      if (alarmToRing) {
        // --- UPDATED TO SET RINGING STATE & PLAY SOUND ---
        setRingingAlarm(alarmToRing);
        if (audioRef.current) {
          audioRef.current.play().catch(e => console.error("Audio playback error:", e));
        }
        
        if (Notification.permission === 'granted') {
          new Notification('Alarm!', { body: alarmToRing.label || `It's ${alarmToRing.time}` });
        }
        
        lastTriggeredTimeRef.current = currentTime;

        if (alarmToRing.days.length === 0) {
          updateAlarm(alarmToRing.id, { enabled: false });
        }
      }
    };

    const intervalId = setInterval(checkAlarms, 1000);
    return () => clearInterval(intervalId);
  }, [alarms, updateAlarm]); // The watcher needs to re-evaluate if the alarms list changes.
  
  // --- NEW FUNCTION TO STOP THE ALARM ---
  const stopRingingAlarm = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0; // Rewind sound
    }
    setRingingAlarm(null); // Clear the ringing alarm state
  };
  
  // ============================================================================
  // END: ALARM WATCHER LOGIC
  // ============================================================================

  // World Clock methods (Unchanged)
  const addWorldClock = (worldClock: Omit<WorldClock, 'id'>) => {
    const newWorldClock = { ...worldClock, id: uuidv4() };
    setWorldClocks(prev => [...prev, newWorldClock]);
  };
  const updateWorldClock = (id: string, updates: Partial<Omit<WorldClock, 'id'>>) => { /* ... */ };
  const deleteWorldClock = (id: string) => { /* ... */ };

  // Timer methods (Unchanged)
  const addTimer = (timer: Omit<Timer, 'id'>) => {
    const newTimer = { ...timer, id: uuidv4() };
    setTimers(prev => [...prev, newTimer]);
  };
  const updateTimer = (id: string, updates: Partial<Omit<Timer, 'id'>>) => { /* ... */ };
  const deleteTimer = (id: string) => { /* ... */ };

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
    // --- ADDED TO CONTEXT VALUE ---
    ringingAlarm,
    stopRingingAlarm,
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