
import React, { useState } from "react";
import { Device, Schedule } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Clock } from "lucide-react";
import { useDevices } from "@/contexts/DeviceContext";

interface ScheduleDialogProps {
  device: Device;
}

const ScheduleDialog: React.FC<ScheduleDialogProps> = ({ device }) => {
  const { setDeviceSchedule, removeDeviceSchedule, isLoading } = useDevices();
  const [open, setOpen] = useState(false);
  
  // Initialize form state
  const [schedule, setSchedule] = useState<Schedule>({
    on: device.schedule?.on || { hour: 8, minute: 0 },
    off: device.schedule?.off || { hour: 22, minute: 0 },
  });

  const handleSaveSchedule = async () => {
    await setDeviceSchedule(device.id, schedule);
    setOpen(false);
  };

  const handleRemoveSchedule = async () => {
    await removeDeviceSchedule(device.id);
    setOpen(false);
  };

  // Generate arrays of hours and minutes for dropdown
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <Clock size={18} />
          Timer
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Atur Jadwal untuk {device.name}</DialogTitle>
          <DialogDescription>
            Jadwalkan waktu untuk menyalakan dan mematikan perangkat secara otomatis.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="on-schedule">Waktu Nyala</Label>
            <div className="flex items-center space-x-2">
              <Select
                value={schedule.on?.hour.toString()}
                onValueChange={(value) => 
                  setSchedule({
                    ...schedule,
                    on: { ...schedule.on!, hour: parseInt(value) }
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Jam" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={`hour-on-${hour}`} value={hour.toString()}>
                      {hour.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span>:</span>
              
              <Select
                value={schedule.on?.minute.toString()}
                onValueChange={(value) => 
                  setSchedule({
                    ...schedule,
                    on: { ...schedule.on!, minute: parseInt(value) }
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Menit" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={`minute-on-${minute}`} value={minute.toString()}>
                      {minute.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Label htmlFor="off-schedule">Waktu Mati</Label>
            <div className="flex items-center space-x-2">
              <Select
                value={schedule.off?.hour.toString()}
                onValueChange={(value) => 
                  setSchedule({
                    ...schedule,
                    off: { ...schedule.off!, hour: parseInt(value) }
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Jam" />
                </SelectTrigger>
                <SelectContent>
                  {hours.map((hour) => (
                    <SelectItem key={`hour-off-${hour}`} value={hour.toString()}>
                      {hour.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <span>:</span>
              
              <Select
                value={schedule.off?.minute.toString()}
                onValueChange={(value) => 
                  setSchedule({
                    ...schedule,
                    off: { ...schedule.off!, minute: parseInt(value) }
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Menit" />
                </SelectTrigger>
                <SelectContent>
                  {minutes.map((minute) => (
                    <SelectItem key={`minute-off-${minute}`} value={minute.toString()}>
                      {minute.toString().padStart(2, '0')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          {device.hasSchedule && (
            <Button 
              variant="outline" 
              onClick={handleRemoveSchedule} 
              className="w-full"
              disabled={isLoading}
            >
              Hapus Jadwal
            </Button>
          )}
          <Button 
            onClick={handleSaveSchedule} 
            className="w-full"
            disabled={isLoading}
          >
            Simpan Jadwal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleDialog;
