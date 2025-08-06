// src/hooks/use-stopwatch.ts

import { useState, useRef, useCallback, useEffect } from 'react';

export interface Lap {
  id: number;
  lapTime: number;
  time: number;
}

export function useStopwatch() {
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState<Lap[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  // Refs for robust timer logic
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef(0);
  const elapsedTimeOnPauseRef = useRef(0);

  // ============================================================================
  // START: NEW SOUND LOGIC
  // ============================================================================
  // Create a ref to hold the audio object so we don't recreate it on every render.
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // This effect runs only once when the hook is first used.
  // It creates the Audio object and gets it ready.
  useEffect(() => {
    // The path '/sound.mp3' points to the file in your /public folder.
    audioRef.current = new Audio('/sound.mp3');
  }, []); // The empty array ensures this runs only once.
  
  // ============================================================================
  // END: NEW SOUND LOGIC
  // ============================================================================

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = Date.now();
      intervalRef.current = setInterval(() => {
        const now = Date.now();
        const currentRunTime = now - startTimeRef.current;
        setTime(elapsedTimeOnPauseRef.current + currentRunTime);
      }, 10);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const start = useCallback(() => {
    if (!isRunning) setIsRunning(true);
  }, [isRunning]);

  const pause = useCallback(() => {
    if (isRunning) {
      elapsedTimeOnPauseRef.current = time;
      setIsRunning(false);
    }
  }, [isRunning, time]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
    elapsedTimeOnPauseRef.current = 0;
  }, []);

  const addLap = useCallback(() => {
    if (isRunning) {
      // --- Play the sound when a lap is added ---
      if (audioRef.current) {
        audioRef.current.currentTime = 0; // Rewind the sound to the beginning
        audioRef.current.play().catch(e => console.error("Error playing sound:", e));
      }
      
      const lastLapTime = laps[0]?.time || 0;
      const newLap: Lap = {
        id: Date.now(),
        time: time,
        lapTime: time - lastLapTime,
      };
      setLaps(prevLaps => [newLap, ...prevLaps]);
    }
  }, [isRunning, time, laps]);

  return { time, laps, isRunning, start, pause, reset, addLap };
}