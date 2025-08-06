import { motion } from "framer-motion";
import { useClockContext, TabType } from "@/contexts/ClockContext";
import { AlarmClock, Globe, Timer, Clock } from "lucide-react";

interface TabItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const TabItem = ({ icon, label, isActive, onClick }: TabItemProps) => {
  const { theme } = useClockContext();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`flex flex-col items-center justify-center py-2 relative ${
        isActive 
          ? theme === 'dark' 
            ? 'text-blue-400' 
            : 'text-blue-600' 
          : theme === 'dark' 
            ? 'text-gray-500' 
            : 'text-gray-600'
      }`}
    >
      <div className="w-6 h-6 mb-1 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-xs font-medium">{label}</span>
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className={`absolute bottom-0 w-14 h-0.5 ${
            theme === 'dark' ? 'bg-blue-400' : 'bg-blue-600'
          }`}
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

export function TabNavigation() {
  const { theme, activeTab, setActiveTab } = useClockContext();

  return (
    <div className={`${
      theme === 'dark' ? 'bg-[#121212] text-white' : 'bg-white text-black'
    } border-t ${
      theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
    } shadow-lg`}
    >
      <div className="grid grid-cols-4 h-14">
        <TabItem
          icon={<AlarmClock size={20} />}
          label="Alarm"
          isActive={activeTab === 'alarm'}
          onClick={() => setActiveTab('alarm')}
        />
        <TabItem
          icon={<Globe size={20} />}
          label="World clock"
          isActive={activeTab === 'worldclock'}
          onClick={() => setActiveTab('worldclock')}
        />
        <TabItem
          icon={<Clock size={20} />}
          label="Stopwatch"
          isActive={activeTab === 'stopwatch'}
          onClick={() => setActiveTab('stopwatch')}
        />
        <TabItem
          icon={<Timer size={20} />}
          label="Timer"
          isActive={activeTab === 'timer'}
          onClick={() => setActiveTab('timer')}
        />
      </div>
    </div>
  );
}