import { useStopwatch } from "@/hooks/use-stopwatch";
import { formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useClockContext } from "@/contexts/ClockContext";

export function Stopwatch() {
  const { time, isRunning, start, pause, reset, laps, addLap } = useStopwatch();
  const { theme } = useClockContext();
  
  const formattedTime = formatTime(time, true);
  const [hours, minutes, secondsAndMilliseconds] = formattedTime.split(':');
  const [seconds, milliseconds] = secondsAndMilliseconds.split('.');

  return (
    <div className={`flex flex-col items-center justify-center h-full py-10 ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      
      {/* Main timer display */}
      <motion.div 
        className="text-5xl md:text-7xl font-bold mb-16 tracking-wider"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.span>{hours}</motion.span>
        <motion.span>:</motion.span>
        <motion.span>{minutes}</motion.span>
        <motion.span>:</motion.span>
        <motion.span>{seconds}</motion.span>
        <motion.span>.</motion.span>
        <motion.span className="text-gray-500">{milliseconds}</motion.span>
      </motion.div>

      {/* Control buttons */}
      <div className="flex w-full max-w-sm justify-center gap-4 px-4">
        <AnimatePresence mode="wait">
          {isRunning ? (
            <>
              <motion.div
                key="lap-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <Button 
                  onClick={addLap}
                  variant="outline"
                  // CHANGE: Reduced size on mobile, made responsive
                  className={`w-full h-12 md:h-14 rounded-full text-base md:text-lg font-medium ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Lap
                </Button>
              </motion.div>
              <motion.div
                key="pause-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <Button 
                  onClick={pause}
                  // CHANGE: Reduced size on mobile, made responsive
                  className="w-full h-12 md:h-14 rounded-full text-base md:text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Pause
                </Button>
              </motion.div>
            </>
          ) : time > 0 ? (
            <>
              <motion.div
                key="reset-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <Button 
                  onClick={reset}
                  variant="outline" 
                  // CHANGE: Reduced size on mobile, made responsive
                  className={`w-full h-12 md:h-14 rounded-full text-base md:text-lg font-medium ${
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:bg-gray-700 text-gray-200' 
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                  }`}
                >
                  Reset
                </Button>
              </motion.div>
              <motion.div
                key="resume-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <Button 
                  onClick={start}
                  // CHANGE: Reduced size on mobile, made responsive
                  className="w-full h-12 md:h-14 rounded-full text-base md:text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Resume
                </Button>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                key="lap-button-disabled"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <Button 
                  disabled
                  variant="outline" 
                  // CHANGE: Reduced size on mobile, made responsive
                  className={`w-full h-12 md:h-14 rounded-full text-base md:text-lg font-medium ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-gray-600' 
                      : 'bg-gray-200 text-gray-400'
                  } opacity-50`}
                >
                  Lap
                </Button>
              </motion.div>
              <motion.div
                key="start-button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="flex-1"
              >
                <Button 
                  onClick={start}
                  // CHANGE: Reduced size on mobile, made responsive
                  className="w-full h-12 md:h-14 rounded-full text-base md:text-lg font-medium bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  Start
                </Button>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Laps list */}
      <AnimatePresence>
        {laps.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-sm mt-10 overflow-hidden"
          >
            <h3 className="text-lg font-medium mb-3 px-2">Laps</h3>
            <div 
              className={`rounded-lg overflow-hidden ${
                theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100'
              }`}
            >
              <AnimatePresence>
                {laps.map((lap, index) => (
                  <motion.div
                    key={lap.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className={`flex justify-between items-center px-4 py-3 ${
                      index % 2 === 0 
                        ? theme === 'dark' ? 'bg-gray-800' : 'bg-white' 
                        : ''
                    }`}
                  >
                    <span>Lap {laps.length - index}</span>
                    <div className="flex gap-4">
                      <span>{formatTime(lap.lapTime, true).substring(3)}</span>
                      <span className="text-gray-500">{formatTime(lap.time, true)}</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}