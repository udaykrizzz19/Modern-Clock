import {
  AnimatePresence,
  motion,
  MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
  type SpringOptions,
} from "framer-motion";
import { 
  AlarmClock, 
  Globe, 
  Hourglass, 
  Moon, 
  Sun, 
  Timer as TimerIcon,
  BellOff // --- IMPORTED BellOff ICON ---
} from "lucide-react";
import React, {
  Children,
  cloneElement,
  ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { useClockContext } from "@/contexts/ClockContext";
import { Button } from "../ui/button";

const dockStyles = `
  .dock-outer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: center;
    z-index: 50;
    padding-bottom: 20px;
  }
  .dock-panel {
    display: flex;
    align-items: flex-end;
    gap: 25px;
    padding: 8px 25px;
    height: 60px;
    border-radius: 2rem;
    background-color: hsla(0, 0%, 15%, 0.5);
    border: 1px solid hsla(0, 0%, 100%, 0.1);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }
  .dock-item {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    outline: none;
    color: white;
  }
  .dock-icon {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .dock-label {
    position: absolute;
    top: -2.25rem;
    left: 50%;
    width: fit-content;
    white-space: pre;
    border-radius: 0.375rem;
    background-color: #111827;
    padding: 0.25rem 0.6rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #fff;
    transform: translateX(-50%);
    z-index: 60;
    pointer-events: none;
  }
  @media (min-width: 1024px) {
    .dock-panel {
      gap: 50px;
    }
  }
`;

// Type definitions for Dock items
export type DockItemData = {
  id: string;
  icon: React.ReactNode;
  label: React.ReactNode;
  onClick: () => void;
};

// Helper components for the Dock
function DockItem({ children, onClick, mouseX }: { children: React.ReactNode; onClick?: () => void; mouseX: MotionValue; }) {
  const ref = useRef<HTMLDivElement>(null);
  const isHovered = useMotionValue(0);
  const spring: SpringOptions = { mass: 0.1, stiffness: 150, damping: 12 };
  const baseItemSize = 40;
  const magnification = 60;
  const distance = 100;
  const mouseDistance = useTransform(mouseX, (val) => {
    const rect = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - rect.x - rect.width / 2;
  });
  const targetSize = useTransform(mouseDistance, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const size = useSpring(targetSize, spring);
  return <motion.div ref={ref} style={{ width: size, height: size }} onHoverStart={() => isHovered.set(1)} onHoverEnd={() => isHovered.set(0)} onClick={onClick} className="dock-item" tabIndex={0}>{Children.map(children, (child) => cloneElement(child as React.ReactElement, { isHovered }))}</motion.div>;
}

function DockLabel({ children, ...rest }: { children: React.ReactNode; isHovered?: MotionValue<number> }) {
  const { isHovered } = rest as { isHovered: MotionValue<number> };
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => { const unsubscribe = isHovered.on("change", (latest) => setIsVisible(latest === 1)); return () => unsubscribe(); }, [isHovered]);
  return <AnimatePresence>{isVisible && <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 5 }} transition={{ duration: 0.15, ease: "easeOut" }} className="dock-label" role="tooltip">{children}</motion.div>}</AnimatePresence>;
}

function DockIcon({ children, ...rest }: { children: React.ReactNode }) { return <div className="dock-icon">{children}</div>; }

function Dock({ items }: { items: DockItemData[] }) {
  const mouseX = useMotionValue(Infinity);
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: dockStyles }} />
      <div className="dock-outer">
        <motion.div onMouseMove={(e) => mouseX.set(e.pageX)} onMouseLeave={() => mouseX.set(Infinity)} className="dock-panel" role="toolbar" aria-label="Application dock">
          {items.map((item) => (
            <DockItem key={item.id} onClick={item.onClick} mouseX={mouseX}>
              <DockIcon>{item.icon}</DockIcon>
              <DockLabel {...(item.label as any)}>{item.label}</DockLabel>
            </DockItem>
          ))}
        </motion.div>
      </div>
    </>
  );
}


interface ClockLayoutProps {
  children: ReactNode;
}

export function ClockLayout({ children }: ClockLayoutProps) {
  // --- UPDATED TO GET RINGING ALARM STATE AND FUNCTION ---
  const { theme, toggleTheme, setActiveTab, activeTab, ringingAlarm, stopRingingAlarm } = useClockContext();

  const dockItems: DockItemData[] = [
    { id: "alarm", label: "Alarm", icon: <AlarmClock size={24} />, onClick: () => setActiveTab("alarm") },
    { id: "worldclock", label: "World Clock", icon: <Globe size={24} />, onClick: () => setActiveTab("worldclock") },
    { id: "stopwatch", label: "Stopwatch", icon: <Hourglass size={24} />, onClick: () => setActiveTab("stopwatch") },
    { id: "timer", label: "Timer", icon: <TimerIcon size={24} />, onClick: () => setActiveTab("timer") },
  ];
  
  return (
    <div 
      className={`flex flex-col h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'
      }`}
    >
      
      <main className="flex-1 overflow-hidden pb-24">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
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
      
      {/* Dock Navigation */}
      <Dock items={dockItems} />

      <AnimatePresence>
        {ringingAlarm && (
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
                {ringingAlarm.time}
              </motion.h1>
              <motion.p
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-2xl text-gray-300"
              >
                {ringingAlarm.label || "Alarm"}
              </motion.p>
            </div>

            {/* Bottom section for the stop button */}
            <div className="mb-20">
              <motion.button
                whileTap={{ scale: 0.9 }}
                // onClick with the timeout to ensure it works.
                onClick={() => stopRingingAlarm()}
                className="w-24 h-24 rounded-full bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center text-white shadow-lg"
              >
                <BellOff className="h-8 w-8" />
                <span className="mt-1 text-sm font-semibold">STOP</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}