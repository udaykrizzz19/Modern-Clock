import { useState, useEffect, useRef, useCallback } from 'react';

interface Lap {
  id: number;
  time: number;
  lapTime: number;
}

export function useStopwatch() {
  const [time, setTime] = useState<number>(0); // Total time in milliseconds
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [laps, setLaps] = useState<Lap[]>([]);
  const timerRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  const start = useCallback(() => {
    if (!isRunning) {
      setIsRunning(true);
      lastTimeRef.current = Date.now() - time;
      
      timerRef.current = window.setInterval(() => {
        setTime(Date.now() - lastTimeRef.current);
      }, 10); // Update every 10ms for smoother animation
    }
  }, [isRunning, time]);

  const pause = useCallback(() => {
    if (isRunning && timerRef.current) {
      setIsRunning(false);
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    pause();
    setTime(0);
    setLaps([]);
  }, [pause]);

  const addLap = useCallback(() => {
    const lastLapTime = laps.length > 0 ? laps[0].time : 0;
    const lapTime = time - lastLapTime;
    
    setLaps((prevLaps) => [
      { id: Date.now(), time, lapTime },
      ...prevLaps,
    ]);
  }, [time, laps]);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return {
    time,
    isRunning,
    start,
    pause,
    reset,
    laps,
    addLap,
  };
}