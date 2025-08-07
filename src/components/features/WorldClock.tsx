import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useClockContext } from "@/contexts/ClockContext";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Search, Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface City {
  name: string;
  timezone: string;
  offset: number;
  countryCode: string;
}

// Sample list of cities with their timezones and offsets
const allCities: City[] = [
  { name: "New York", timezone: "America/New_York", offset: -4, countryCode: "US" },
  { name: "London", timezone: "Europe/London", offset: 1, countryCode: "GB" },
  { name: "Tokyo", timezone: "Asia/Tokyo", offset: 9, countryCode: "JP" },
  { name: "Sydney", timezone: "Australia/Sydney", offset: 10, countryCode: "AU" },
  { name: "Los Angeles", timezone: "America/Los_Angeles", offset: -7, countryCode: "US" },
  { name: "Paris", timezone: "Europe/Paris", offset: 2, countryCode: "FR" },
  { name: "Dubai", timezone: "Asia/Dubai", offset: 4, countryCode: "AE" },
  { name: "Singapore", timezone: "Asia/Singapore", offset: 8, countryCode: "SG" },
  { name: "Berlin", timezone: "Europe/Berlin", offset: 2, countryCode: "DE" },
  { name: "Mumbai", timezone: "Asia/Kolkata", offset: 5.5, countryCode: "IN" },
  { name: "Toronto", timezone: "America/Toronto", offset: -4, countryCode: "CA" },
  { name: "Mexico City", timezone: "America/Mexico_City", offset: -5, countryCode: "MX" },
  { name: "Cairo", timezone: "Africa/Cairo", offset: 3, countryCode: "EG" },
  { name: "Moscow", timezone: "Europe/Moscow", offset: 3, countryCode: "RU" },
  { name: "Bangkok", timezone: "Asia/Bangkok", offset: 7, countryCode: "TH" },
];

export function WorldClock() {
  const { theme, worldClocks, addWorldClock, deleteWorldClock } = useClockContext();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddCity, setShowAddCity] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  // Update current time every second
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleAddCity = () => {
    if (!selectedCity) return;
    
    const city = allCities.find(c => c.name === selectedCity);
    if (city) {
      // Check if the city already exists in the world clocks
      const cityExists = worldClocks.some(wc => wc.city === city.name);
      if (!cityExists) {
        addWorldClock({
          city: city.name,
          timezone: city.timezone,
          offsetFromLocal: `${city.offset >= 0 ? '+' : ''}${city.offset % 1 === 0 ? city.offset.toFixed(2) : city.offset.toFixed(2)}`
        });
      }
      setShowAddCity(false);
      setSearchQuery("");
      setSelectedCity(null);
    }
  };
  
  const filteredCities = allCities.filter(city => 
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Calculate local offset to display differences correctly
  const localOffset = currentTime.getTimezoneOffset() / -60; // Convert to positive hours
  
  const getOffsetString = (offset: number) => {
    const difference = offset - localOffset;
    if (difference === 0) return "Local time";
    const hours = Math.trunc(difference);
    const minutes = Math.abs(difference % 1) * 60;
    const sign = difference > 0 ? "+" : "";

    if (minutes > 0) {
        return `${sign}${hours}h ${minutes}m`;
    }
    return `${sign}${hours}h`;
  };
  
  const getCityTime = (timezone: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: 'numeric', 
      minute: '2-digit', 
      hour12: false
    };
    
    return new Intl.DateTimeFormat('en-US', {
      ...options,
      timeZone: timezone
    }).format(currentTime);
  };

  const getCityDate = (timezone: string) => {
    const today = new Intl.DateTimeFormat('en-US', { timeZone: timezone, day: 'numeric' }).format(currentTime);
    const localToday = new Intl.DateTimeFormat('en-US', { day: 'numeric' }).format(currentTime);
    const yesterday = new Intl.DateTimeFormat('en-US', { timeZone: timezone, day: 'numeric' }).format(new Date(currentTime.getTime() - 86400000));
    const tomorrow = new Intl.DateTimeFormat('en-US', { timeZone: timezone, day: 'numeric' }).format(new Date(currentTime.getTime() + 86400000));

    if (today !== localToday) {
        if(new Date(currentTime.toLocaleString("en-US", {timeZone: timezone})).getDate() < new Date().getDate()){
            return "Yesterday";
        } else {
            return "Tomorrow";
        }
    }
    return "Today";
  };


  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h1 className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>World Clock</h1>
      </div>

      {/* City List */}
      <div className="flex-1 overflow-auto p-4 space-y-3 group/list">
        <AnimatePresence>
          {worldClocks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-32 text-gray-500"
            >
              No cities added yet
            </motion.div>
          ) : (
            worldClocks.map((worldClock) => {
                const cityDetails = allCities.find(c => c.name === worldClock.city);
                if (!cityDetails) return null;

                return (
                    <motion.div
                      key={worldClock.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.2 }}
                      className={`p-[1.8rem] rounded-[5rem] flex justify-between items-center group/item ${
                        theme === 'dark' 
                          ? 'bg-gray-900 border border-gray-800' 
                          : 'bg-white shadow-sm'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-4">
                            {/* You can add country flags here if you have a component for it */}
                        </div>
                        <div>
                          <div className="flex items-baseline space-x-2">
                            <span className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>{worldClock.city}</span>
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{getCityDate(worldClock.timezone)}</span>
                          </div>
                          <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                            {getOffsetString(cityDetails.offset)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className={`text-2xl font-light tabular-nums ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                          {getCityTime(worldClock.timezone)}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteWorldClock(worldClock.id)}
                          className="ml-2 rounded-full opacity-0 group-hover/list:opacity-100 group-focus-within/item:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                )
            })
          )}
        </AnimatePresence>
      </div>

      {/* Add Button */}
      <div className="p-4 mb-[4rem] flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddCity(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg"
        >
          <Plus className="h-7 w-7" />
        </motion.button>
      </div>

      {/* Add City Dialog */}
      <Dialog 
        open={showAddCity}
        onOpenChange={(open) => {
            if (!open) {
                setShowAddCity(false);
                setSearchQuery("");
                setSelectedCity(null);
            }
        }}
      >
        <DialogContent className={`sm:max-w-md ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
          <DialogHeader>
            <DialogTitle>Add City</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search for a city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
              />
            </div>

            {/* City Selection List */}
            <div className="max-h-60 overflow-y-auto space-y-1 pr-2">
                {filteredCities.length > 0 ? (
                    filteredCities.map((city) => (
                        <button
                            key={city.name}
                            onClick={() => setSelectedCity(city.name)}
                            className={`w-full text-left p-3 rounded-md transition-colors ${
                                selectedCity === city.name 
                                ? 'bg-indigo-600 text-white' 
                                : theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
                            }`}
                        >
                            {city.name} ({city.countryCode})
                        </button>
                    ))
                ) : (
                    <div className="text-center text-sm text-gray-500 p-4">No cities found.</div>
                )}
            </div>
            
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddCity(false);
                setSearchQuery("");
                setSelectedCity(null);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddCity}
              disabled={!selectedCity}
            >
              Add
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}