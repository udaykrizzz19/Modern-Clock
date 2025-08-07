import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { useClockContext } from "@/contexts/ClockContext";
import { ChevronUp, ChevronDown, BellOff } from "lucide-react";

interface TimerSelectorProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  max: number;
}

const TimerSelector = ({ value, onChange, label, max }: TimerSelectorProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // Ref to hold the timeout for debouncing
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const values = Array.from({ length: max + 1 }, (_, i) => i);
  const itemHeight = 48; // h-12 in Tailwind

  // This effect correctly scrolls the wheel when a preset is clicked
  useEffect(() => {
    const ref = scrollContainerRef.current;
    if (ref) {
      const targetScrollTop = value * itemHeight;
      // Only scroll if it's not already at (or very close to) the target
      if (Math.abs(ref.scrollTop - targetScrollTop) > 1) {
        ref.scrollTo({ top: targetScrollTop, behavior: "smooth" });
      }
    }
  }, [value, itemHeight]);
  
  // THE FIX: Debounced scroll handler
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    
    // Clear any previous timeout to reset the debounce timer
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }
    
    // Set a new timeout. This will only run 150ms after the LAST scroll event.
    scrollTimeoutRef.current = setTimeout(() => {
      const selectedIndex = Math.round(target.scrollTop / itemHeight);
      if (value !== selectedIndex) {
        onChange(values[selectedIndex]);
      }
    }, 150);
  };

  return (
    <div className="flex flex-col items-center">
      <span className="text-xs font-medium uppercase tracking-widest text-gray-400">{label}</span>
      <div className="relative h-40 w-24 mt-2">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 rounded-[4rem] bg-white/5 z-10 pointer-events-none" />
        <div className="absolute top-0 inset-x-0 h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none" />
        <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black to-transparent z-20 pointer-events-none" />
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto no-scrollbar snap-y snap-mandatory"
        >
          <div className="pt-[56px] pb-[56px]">
            {values.map((val) => (
              <div key={val} className="h-12 flex items-center justify-center snap-center">
                <span className="text-4xl font-bold font-mono">
                  {String(val).padStart(2, '0')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export function Timer() {
  const { theme } = useClockContext();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [activePreset, setActivePreset] = useState<number | null>(5);

  const [isRunning, setIsRunning] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [initialDuration, setInitialDuration] = useState(0);
  // NEW STATE: Track if timer is ringing
  const [isRinging, setIsRinging] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const remainingOnPauseRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sound.mp3');
    audioRef.current.loop = true;
    Notification.requestPermission();
    return () => { audioRef.current?.pause(); };
  }, []);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const elapsedTime = Date.now() - startTimeRef.current;
        const newRemainingTime = Math.max(0, remainingOnPauseRef.current - elapsedTime);
        setRemainingTime(newRemainingTime);
        if (newRemainingTime <= 0) handleTimerComplete();
      }, 50);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning]);
  
  useEffect(() => {
    const presets = [5, 10, 30];
    if (hours === 0 && seconds === 0 && presets.includes(minutes)) {
      setActivePreset(minutes);
    } else {
      setActivePreset(null);
    }
  }, [hours, minutes, seconds]);

  const handleTimerComplete = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsRinging(true); // Set ringing state to true
    audioRef.current?.play().catch(e => console.error("Audio play error:", e));
    if (Notification.permission === "granted") {
      new Notification("Timer Complete", { body: "Your timer has finished!" });
    }
  };

  // NEW FUNCTION: Stop the ringing timer
  const stopRinging = useCallback(() => {
    setIsRinging(false);
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  const startTimer = useCallback(() => {
    const totalMs = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (totalMs <= 0) return;
    setInitialDuration(totalMs);
    setRemainingTime(totalMs);
    remainingOnPauseRef.current = totalMs;
    setIsRunning(true);
    setIsRinging(false); // Reset ringing state
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, [hours, minutes, seconds]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
    remainingOnPauseRef.current = remainingTime;
  }, [remainingTime]);

  const resumeTimer = useCallback(() => setIsRunning(true), []);
  
  const cancelTimer = useCallback(() => {
    setIsRunning(false);
    setRemainingTime(0);
    setIsRinging(false); // Reset ringing state
    audioRef.current?.pause();
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  }, []);

  const applyPreset = (mins: number) => {
    setHours(0);
    setMinutes(mins);
    setSeconds(0);
    // The useEffect will automatically set the active preset
  };
  
  const isTimerFinished = remainingTime === 0 && !isRunning && initialDuration > 0;
  const showTimerSelector = !isRunning && remainingTime === 0;
  const progress = initialDuration > 0 ? (remainingTime / initialDuration) : 0;

  return (
    <>
      <div className={`flex flex-col items-center justify-center h-full pt-10 pb-20 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
        <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
        
        <AnimatePresence mode="wait">
          {showTimerSelector ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center w-full space-y-12"
            >
              <div className="flex justify-center items-end gap-x-2">
                <TimerSelector value={hours} onChange={setHours} label="Hours" max={23} />
                <div className="text-4xl font-bold pb-8">:</div>
                <TimerSelector value={minutes} onChange={setMinutes} label="Minutes" max={59} />
                <div className="text-4xl font-bold pb-8">:</div>
                <TimerSelector value={seconds} onChange={setSeconds} label="Seconds" max={59} />
              </div>

              <div className="flex justify-center gap-4 w-full max-w-sm px-4">
                {[5, 10, 30].map((preset) => (
                  <Button 
                    key={preset} 
                    onClick={() => applyPreset(preset)} 
                    className={`flex-1 h-12 rounded-full font-medium transition-all duration-200 border
                      ${activePreset === preset
                        ? 'bg-[#394150] border-[#c0c7d8]'
                        : 'bg-[#292f3a] border-transparent hover:bg-[#394150]'
                      }`
                    }
                  >
                    {preset} min
                  </Button>
                ))}
              </div>

              <Button onClick={startTimer} disabled={hours === 0 && minutes === 0 && seconds === 0} className="w-full max-w-[200px] h-14 rounded-full text-lg font-semibold bg-indigo-600 hover:bg-indigo-700 text-white disabled:bg-gray-800 disabled:text-gray-500">
                Start
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="progress"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center space-y-10"
            >
              <div className="relative w-64 h-64">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="45" fill="none" stroke={theme === 'dark' ? '#1f2937' : '#e5e7eb'} strokeWidth="6" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke={isTimerFinished ? "#4ade80" : "#4f46e5"}
                    strokeWidth="6"
                    strokeLinecap="round"
                    pathLength="1"
                    strokeDasharray="1"
                    strokeDashoffset={1 - progress}
                    transform="rotate(-90 50 50)"
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-4xl font-mono font-bold">
                  {isTimerFinished ? "Done!" : formatTime(remainingTime, false)}
                </div>
              </div>

              <div className="flex gap-4 w-full max-w-xs">
                <Button onClick={cancelTimer} className="flex-1 h-12 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-semibold">Cancel</Button>
                {isRunning && !isTimerFinished && <Button onClick={pauseTimer} className="flex-1 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Pause</Button>}
                {!isRunning && !isTimerFinished && <Button onClick={resumeTimer} className="flex-1 h-12 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">Resume</Button>}
                {isTimerFinished && <Button onClick={startTimer} className="flex-1 h-12 rounded-full bg-green-500 hover:bg-green-600 text-white font-semibold">Restart</Button>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FULL-SCREEN RINGING OVERLAY - Similar to alarm */}
      <AnimatePresence>
        {isRinging && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-between p-8 bg-black/80 backdrop-blur-md"
          >
            {/* Top section for info */}
            <div className="text-center mt-20">
              <motion.h1
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="text-7xl font-light"
              >
                00:00
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-2xl text-gray-300"
              >
                Timer Complete!
              </motion.p>
            </div>

            {/* Bottom section for the stop button */}
            <div className="mb-20">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={stopRinging}
                className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center text-white shadow-lg"
              >
                <BellOff className="h-8 w-8" />
                <span className="mt-1 text-sm font-semibold">STOP</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}