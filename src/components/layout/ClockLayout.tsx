// This file now contains all the logic for the layout and the new Dock navigation.
// The "no-scrolling" fix has been applied.

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
  Timer as TimerIcon 
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

// ============================================================================
// 1. CSS for the Dock component (Unchanged)
// ============================================================================
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
              {/* Added a check to prevent error if isHovered is not passed */}
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
  const { theme, toggleTheme, setActiveTab, activeTab } = useClockContext();

  const dockItems: DockItemData[] = [
    { id: "alarm", label: "Alarm", icon: <AlarmClock size={24} />, onClick: () => setActiveTab("alarm") },
    { id: "worldclock", label: "World Clock", icon: <Globe size={24} />, onClick: () => setActiveTab("worldclock") },
    { id: "stopwatch", label: "Stopwatch", icon: <Hourglass size={24} />, onClick: () => setActiveTab("stopwatch") },
    { id: "timer", label: "Timer", icon: <TimerIcon size={24} />, onClick: () => setActiveTab("timer") },
  ];
  
  return (
    // Added overflow-hidden here as a best practice to contain the entire layout.
    <div 
      className={`flex flex-col h-screen overflow-hidden ${
        theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-gray-50 text-black'
      }`}
    >
      {/* Status Bar */}
      <div className={`flex justify-between items-center p-2 px-4 text-sm z-10 ${
        theme === 'dark' ? 'bg-black/30' : 'bg-gray-50/30'
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
                <motion.div key="moon" initial={{ opacity: 0, rotate: -90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: 90 }} transition={{ duration: 0.2 }}><Moon className="h-4 w-4" /></motion.div>
              ) : (
                <motion.div key="sun" initial={{ opacity: 0, rotate: 90 }} animate={{ opacity: 1, rotate: 0 }} exit={{ opacity: 0, rotate: -90 }} transition={{ duration: 0.2 }}><Sun className="h-4 w-4" /></motion.div>
              )}
            </AnimatePresence>
          </Button>
        </div>
      </div>
      
      {/* 
        --- THE KEY CHANGE IS HERE ---
        The `overflow-auto` class has been replaced with `overflow-hidden`.
        This prevents the main content area from ever having a scrollbar.
      */}
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
    </div>
  );
}