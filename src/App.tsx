import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClockProvider, useClockContext } from './contexts/ClockContext';
import { ClockLayout } from './components/layout/ClockLayout';
import { Alarm } from './components/features/Alarm';
import { WorldClock } from './components/features/WorldClock';
import { Stopwatch } from './components/features/Stopwatch';
import { Timer } from './components/features/Timer';
import './App.css';

// Create React Query client
const queryClient = new QueryClient();

// Main content component based on active tab
const TabContent = () => {
  const { activeTab } = useClockContext();
  
  switch (activeTab) {
    case 'alarm':
      return <Alarm />;
    case 'worldclock':
      return <WorldClock />;
    case 'stopwatch':
      return <Stopwatch />;
    case 'timer':
      return <Timer />;
    default:
      return <Alarm />;
  }
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ClockProvider>
        <Toaster />
        <ClockLayout>
          <TabContent />
        </ClockLayout>
      </ClockProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;