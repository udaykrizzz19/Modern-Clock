import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useClockContext } from "@/contexts/ClockContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreVertical, Edit, Settings, Clock, Trash } from "lucide-react";

interface Day {
  value: string;
  label: string;
  short: string;
}

const days: Day[] = [
  { value: "mon", label: "Monday", short: "M" },
  { value: "tue", label: "Tuesday", short: "T" },
  { value: "wed", label: "Wednesday", short: "W" },
  { value: "thu", label: "Thursday", short: "T" },
  { value: "fri", label: "Friday", short: "F" },
  { value: "sat", label: "Saturday", short: "S" },
  { value: "sun", label: "Sunday", short: "S" },
];

interface AlarmFormValues {
  time: string;
  days: string[];
  label: string;
  sound: string;
  vibrate: boolean;
  crescendoMode: boolean;
  challengeToDismiss: boolean;
}

const alarmSounds = [
  "Default",
  "Morning Glory",
  "Gentle Wake",
  "Energetic",
  "Nature",
  "Zen",
  "Classic Bell",
];

export function Alarm() {
  const { theme, alarms, addAlarm, updateAlarm, deleteAlarm } = useClockContext();
  const [showAddAlarm, setShowAddAlarm] = useState(false);
  const [editingAlarmId, setEditingAlarmId] = useState<string | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  
  const [formValues, setFormValues] = useState<AlarmFormValues>({
    time: "07:00",
    days: [],
    label: "",
    sound: "Default",
    vibrate: true,
    crescendoMode: false,
    challengeToDismiss: false,
  });

  const resetForm = () => {
    setFormValues({
      time: "07:00",
      days: [],
      label: "",
      sound: "Default",
      vibrate: true,
      crescendoMode: false,
      challengeToDismiss: false,
    });
  };

  const handleAddAlarm = () => {
    addAlarm({
      time: formValues.time,
      days: formValues.days,
      enabled: true,
      label: formValues.label,
      sound: formValues.sound,
      vibrate: formValues.vibrate,
      crescendoMode: formValues.crescendoMode,
      challengeToDismiss: formValues.challengeToDismiss,
    });
    setShowAddAlarm(false);
    resetForm();
  };

  const handleEditAlarm = () => {
    if (editingAlarmId) {
      updateAlarm(editingAlarmId, {
        time: formValues.time,
        days: formValues.days,
        label: formValues.label,
        sound: formValues.sound,
        vibrate: formValues.vibrate,
        crescendoMode: formValues.crescendoMode,
        challengeToDismiss: formValues.challengeToDismiss,
      });
      setEditingAlarmId(null);
      resetForm();
    }
  };

  const handleDeleteAlarm = (id: string) => {
    deleteAlarm(id);
  };

  const handleToggleAlarm = (id: string, enabled: boolean) => {
    updateAlarm(id, { enabled });
  };

  const handleEditClick = (id: string) => {
    const alarm = alarms.find(a => a.id === id);
    if (alarm) {
      setFormValues({
        time: alarm.time,
        days: alarm.days || [],
        label: alarm.label || "",
        sound: alarm.sound || "Default",
        vibrate: alarm.vibrate !== undefined ? alarm.vibrate : true,
        crescendoMode: alarm.crescendoMode || false,
        challengeToDismiss: alarm.challengeToDismiss || false,
      });
      setEditingAlarmId(id);
    }
  };

  const formatDays = (selectedDays: string[]) => {
    if (selectedDays.length === 0) return "Once";
    if (selectedDays.length === 7) return "Every day";
    if (selectedDays.length === 5 && selectedDays.includes("mon") && selectedDays.includes("tue") && selectedDays.includes("wed") && selectedDays.includes("thu") && selectedDays.includes("fri"))
      return "Weekdays";
    if (selectedDays.length === 2 && selectedDays.includes("sat") && selectedDays.includes("sun"))
      return "Weekend";
    
    // Map over the selected day strings (e.g., "mon")
    return selectedDays.map(dayValue => {
      // Find the corresponding object in the module-level `days` constant
      const dayObject = days.find(d => d.value === dayValue);
      return dayObject ? dayObject.short : "";
    }).join(", ");
  };

  return (
    <div className={`flex flex-col h-full ${theme === 'dark' ? 'bg-black text-white' : 'bg-gray-50 text-black'}`}>
      {/* Header */}
      <div className="flex justify-between items-center p-4">
        <h1 className={`text-xl font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>Alarm</h1>
        <div className="flex">
          <Popover open={showSettingsMenu} onOpenChange={setShowSettingsMenu}>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <MoreVertical className={`h-5 w-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-56 ${theme === 'dark' ? 'bg-gray-900 text-white border-gray-800' : 'bg-white text-black'}`}>
              <div className="grid gap-1">
                <Button variant="ghost" className="w-full justify-start rounded-md">
                  <Clock className="mr-2 h-4 w-4" />
                  Set Sleep mode schedule
                </Button>
                <Button variant="ghost" className="w-full justify-start rounded-md">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost" className="w-full justify-start rounded-md">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Alarm List */}
      <div className="flex-1 overflow-auto p-4">
        <AnimatePresence>
          {alarms.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex justify-center items-center h-32 text-gray-500"
            >
              All alarms are off
            </motion.div>
          ) : (
            <div className="space-y-3">
              {alarms.map((alarm) => (
                <motion.div
                  key={alarm.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className={`p-7 rounded-[4rem] mb-3 ${
                    theme === 'dark' 
                      ? 'bg-gray-900 border border-gray-800' 
                      : 'bg-white shadow-sm'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className={`text-4xl font-normal ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>
                        {alarm.time}
                      </div>
                      <div className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        {formatDays(alarm.days || [])}
                        {alarm.label && ` • ${alarm.label}`}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={alarm.enabled}
                        onCheckedChange={(checked) => handleToggleAlarm(alarm.id, checked)}
                        className={`${alarm.enabled && (theme === 'dark' ? 'bg-blue-500' : 'bg-blue-600')}`}
                      />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className={`h-4 w-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          className={theme === 'dark' ? 'bg-gray-900 border border-gray-800' : 'bg-white'}
                        >
                          <DropdownMenuItem onClick={() => handleEditClick(alarm.id)} className="focus:bg-gray-800">
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteAlarm(alarm.id)} className="focus:bg-gray-800">
                            <Trash className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Button */}
      <div className="p-4 mb-[4rem] flex justify-center">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddAlarm(true)}
          className="w-14 h-14 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-lg"
        >
          <Plus className="h-7 w-7" />
        </motion.button>
      </div>

      {/* Add/Edit Alarm Dialog */}
      <Dialog 
        open={showAddAlarm || editingAlarmId !== null}
        onOpenChange={(open) => {
          if (!open) {
            setShowAddAlarm(false);
            setEditingAlarmId(null);
            resetForm();
          }
        }}
      >
        <DialogContent className={`sm:max-w-md ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
          <DialogHeader>
            <DialogTitle>
              {editingAlarmId ? "Edit Alarm" : "Add Alarm"}
            </DialogTitle>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            {/* Time Picker */}
            <div className="flex justify-center">
              <Input
                type="time"
                value={formValues.time}
                onChange={(e) => setFormValues({...formValues, time: e.target.value})}
                className={`text-3xl text-center ${
                  theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                }`}
              />
            </div>

            {/* Repeat Days */}
            <div>
              <Label className="block mb-2">Repeat</Label>
              <div className="flex justify-between">
                {days.map((day) => (
                  <div key={day.value} className="flex flex-col items-center">
                    <Label 
                      htmlFor={`day-${day.value}`} 
                      className="text-xs mb-1"
                    >
                      {day.short}
                    </Label>
                    <Checkbox
                      id={`day-${day.value}`}
                      checked={formValues.days.includes(day.value)}
                      onCheckedChange={(checked) => {
                        setFormValues({
                          ...formValues,
                          days: checked 
                            ? [...formValues.days, day.value] 
                            : formValues.days.filter(d => d !== day.value)
                        });
                      }}
                      className={theme === 'dark' ? 'border-gray-600' : 'border-gray-300'}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Label */}
            <div>
              <Label htmlFor="alarm-label">Label</Label>
              <Input
                id="alarm-label"
                value={formValues.label}
                onChange={(e) => setFormValues({...formValues, label: e.target.value})}
                placeholder="Alarm"
                className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
              />
            </div>

            {/* Sound */}
            <div>
              <Label htmlFor="alarm-sound">Sound</Label>
              <Select
                value={formValues.sound}
                onValueChange={(value) => setFormValues({...formValues, sound: value})}
              >
                <SelectTrigger className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                  <SelectValue placeholder="Select a sound" />
                </SelectTrigger>
                <SelectContent className={theme === 'dark' ? 'bg-gray-800' : 'bg-white'}>
                  {alarmSounds.map((sound) => (
                    <SelectItem key={sound} value={sound}>{sound}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="vibrate" className="cursor-pointer">Vibrate</Label>
                <Switch
                  id="vibrate"
                  checked={formValues.vibrate}
                  onCheckedChange={(checked) => setFormValues({...formValues, vibrate: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="crescendo" className="cursor-pointer">Crescendo mode</Label>
                <Switch
                  id="crescendo"
                  checked={formValues.crescendoMode}
                  onCheckedChange={(checked) => setFormValues({...formValues, crescendoMode: checked})}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="challenge" className="cursor-pointer">Challenge to dismiss</Label>
                <Switch
                  id="challenge"
                  checked={formValues.challengeToDismiss}
                  onCheckedChange={(checked) => setFormValues({...formValues, challengeToDismiss: checked})}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => {
                setShowAddAlarm(false);
                setEditingAlarmId(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={editingAlarmId ? handleEditAlarm : handleAddAlarm}
            >
              {editingAlarmId ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}