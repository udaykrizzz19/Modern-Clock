import { ReactNode } from "react";
import { TabNavigation } from "./TabNavigation";
import { useClockContext } from "@/contexts/ClockContext";
import { AnimatePresence, motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";

interface ClockLayoutProps {
  children: ReactNode;
}

export function ClockLayout({ children }: ClockLayoutProps) {
  const { theme, toggleTheme } = useClockContext();
  
  return (
    <div 
      className={`flex flex-col h-screen ${
        theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-gray-50 text-black'
      }`}
    >
      {/* Status Bar - Mocked */}
      <div className={`flex justify-between items-center p-2 px-4 text-sm ${
        theme === 'dark' ? 'bg-black' : 'bg-gray-50'
      }`}>
        <div>10:54</div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleTheme}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === 'dark' ? (
                <motion.div
                  key="moon"
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="h-4 w-4" />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ opacity: 0, rotate: 90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  exit={{ opacity: 0, rotate: -90 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="h-4 w-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
          <div className="flex space-x-1">
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
              <div className="w-1 h-1 bg-current rounded-full"></div>
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
              <div className="w-1 h-1 bg-current rounded-full"></div>
            </div>
            <div className="w-4 h-4 rounded-full border-2 border-current flex items-center justify-center">
              <div className="w-1 h-1 bg-current rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={useClockContext().activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
      
      {/* Tab Navigation */}
      <TabNavigation />
    </div>
  );
}