import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { formatTime } from "@/lib/utils";
import { useClockContext } from "@/contexts/ClockContext";
import { Slider } from "@/components/ui/slider";

interface TimerSelectorProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  max: number;
}

const TimerSelector = ({ value, onChange, label, max }: TimerSelectorProps) => {
  const { theme } = useClockContext();
  const values = Array.from({ length: max + 1 }, (_, i) => i);

  return (
    <div className="flex flex-col items-center mx-2 w-24">
      <span className="text-sm text-gray-500 mb-2">{label}</span>
      <div 
        className={`relative h-40 overflow-hidden ${
          theme === 'dark' ? 'text-white' : 'text-black'
        }`}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <div className={`h-12 w-full ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-200/50'} rounded-md`}></div>
        </div>
        <div 
          className="h-40 overflow-y-auto no-scrollbar py-14 snap-y snap-mandatory"
          style={{ scrollBehavior: "smooth" }}
          onScroll={(e) => {
            const target = e.currentTarget;
            const scrollPosition = target.scrollTop;
            const itemHeight = 40; // height of each item
            const selectedIndex = Math.round(scrollPosition / itemHeight);
            if (selectedIndex >= 0 && selectedIndex < values.length) {
              onChange(values[selectedIndex]);
            }
          }}
          ref={(ref) => {
            if (ref) {
              ref.scrollTop = value * 40;
            }
          }}
        >
          {values.map((val) => (
            <div 
              key={val} 
              className="h-10 flex items-center justify-center snap-start text-2xl font-bold"
              onClick={() => onChange(val)}
            >
              {String(val).padStart(2, '0')}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export function Timer() {
  const { theme } = useClockContext();
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0);
  const [showTimerSelector, setShowTimerSelector] = useState(true);
  const timerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Timer presets in minutes
  const presets = [5, 10, 30];

  useEffect(() => {
    // Initialize audio element for timer completion
    audioRef.current = new Audio('/timer-sound.mp3');
    audioRef.current.loop = true;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isRunning) return;

    // Start the timer
    const startTime = Date.now();
    const totalDuration = remainingTime;
    
    timerRef.current = window.setInterval(() => {
      const elapsedTime = Date.now() - startTime;
      const newRemainingTime = Math.max(0, totalDuration - elapsedTime);
      
      setRemainingTime(newRemainingTime);
      
      if (newRemainingTime <= 0) {
        handleTimerComplete();
      }
    }, 10);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const handleTimerComplete = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRunning(false);
    setShowTimerSelector(true);
    
    // Play sound
    if (audioRef.current) {
      audioRef.current.play().catch((e) => console.error("Error playing audio:", e));
    }
    
    // Show notification if browser supports it
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification("Timer Complete", {
          body: "Your timer has finished!",
          icon: "/images/favicon.jpg"
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(permission => {
          if (permission === "granted") {
            new Notification("Timer Complete", {
              body: "Your timer has finished!",
              icon: "/images/favicon.jpg"
            });
          }
        });
      }
    }
  };

  const startTimer = () => {
    if (hours === 0 && minutes === 0 && seconds === 0) return;
    
    const totalMilliseconds = (hours * 3600 + minutes * 60 + seconds) * 1000;
    setRemainingTime(totalMilliseconds);
    setIsRunning(true);
    setIsPaused(false);
    setShowTimerSelector(false);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const pauseTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRunning(false);
    setIsPaused(true);
  };

  const resumeTimer = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const cancelTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setShowTimerSelector(true);
    
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const applyPreset = (minutes: number) => {
    setHours(0);
    setMinutes(minutes);
    setSeconds(0);
  };

  // Calculate progress percentage for the circular progress indicator
  const initialDuration = (hours * 3600 + minutes * 60 + seconds) * 1000;
  const progress = initialDuration > 0 ? 1 - (remainingTime / initialDuration) : 0;

  return (
    <div className={`flex flex-col items-center justify-start h-full py-10 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      <AnimatePresence mode="wait">
        {showTimerSelector ? (
          <motion.div
            key="timer-selector"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center w-full"
          >
            {/* Time Selector */}
            <div className="flex justify-center items-center mb-10">
              <TimerSelector
                value={hours}
                onChange={setHours}
                label="Hours"
                max={99}
              />
              <div className="text-3xl font-bold mx-1">:</div>
              <TimerSelector
                value={minutes}
                onChange={setMinutes}
                label="Minutes"
                max={59}
              />
              <div className="text-3xl font-bold mx-1">:</div>
              <TimerSelector
                value={seconds}
                onChange={setSeconds}
                label="Seconds"
                max={59}
              />
            </div>

            {/* Presets */}
            <div className="flex justify-center gap-4 mb-10 w-full max-w-sm">
              {presets.map((preset) => (
                <motion.div 
                  key={preset}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    onClick={() => applyPreset(preset)}
                    variant="outline"
                    className={`w-full h-14 rounded-full ${
                      theme === 'dark' 
                        ? 'bg-gray-800 hover:bg-gray-700' 
                        : 'bg-gray-200 hover:bg-gray-300'
                    }`}
                  >
                    {preset} min
                  </Button>
                </motion.div>
              ))}
            </div>

            {/* Start Button */}
            <motion.div 
              whileTap={{ scale: 0.95 }}
              className="w-full max-w-xs"
            >
              <Button
                onClick={startTimer}
                disabled={hours === 0 && minutes === 0 && seconds === 0}
                className="w-full h-14 rounded-full text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Start
              </Button>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="timer-running"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col items-center"
          >
            {/* Progress Ring */}
            <div className="relative w-60 h-60 mb-8">
              <svg className="w-full h-full" viewBox="0 0 100 100">
                {/* Background Circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke={theme === 'dark' ? '#333' : '#e5e7eb'}
                  strokeWidth="8"
                />
                
                {/* Progress Circle */}
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="#4f46e5"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray="283"
                  strokeDashoffset={283 * (1 - progress)}
                  transform="rotate(-90 50 50)"
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 * (1 - progress) }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                />
                
                {/* Time Text */}
                <foreignObject x="0" y="0" width="100" height="100">
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-3xl font-bold">
                      {formatTime(remainingTime, false)}
                    </div>
                  </div>
                </foreignObject>
              </svg>
            </div>

            {/* Control Buttons */}
            <div className="flex gap-4 w-full max-w-xs">
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                <Button
                  onClick={cancelTimer}
                  variant="outline"
                  className={`w-full h-14 rounded-full ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700' 
                      : 'bg-gray-200 hover:bg-gray-300'
                  }`}
                >
                  Cancel
                </Button>
              </motion.div>
              
              <motion.div 
                whileTap={{ scale: 0.95 }}
                className="flex-1"
              >
                {isPaused ? (
                  <Button
                    onClick={resumeTimer}
                    className="w-full h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Resume
                  </Button>
                ) : (
                  <Button
                    onClick={pauseTimer}
                    className="w-full h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Pause
                  </Button>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}