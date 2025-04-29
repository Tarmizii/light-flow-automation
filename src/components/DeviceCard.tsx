
import React from "react";
import { Device } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, LightbulbOff, Fan, PowerOff, Power } from "lucide-react";
import { useDevices } from "@/contexts/DeviceContext";
import ScheduleDialog from "@/components/ScheduleDialog";

interface DeviceCardProps {
  device: Device;
}

const DeviceCard: React.FC<DeviceCardProps> = ({ device }) => {
  const { toggleDevice, isLoading } = useDevices();
  
  const handleToggle = () => {
    toggleDevice(device.id);
  };

  return (
    <Card className={`device-card ${device.isOn ? 'border-l-4 border-l-iot-blue' : ''}`}>
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`device-icon ${device.isOn ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
              {device.type === "light" ? (
                device.isOn ? <Lightbulb size={24} /> : <LightbulbOff size={24} />
              ) : (
                device.isOn ? <Fan size={24} /> : <Fan size={24} />
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{device.name}</CardTitle>
              <Badge variant={device.isOn ? "default" : "outline"} className="mt-1">
                {device.isOn ? "Aktif" : "Tidak Aktif"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-4">
        <div className="flex justify-between items-center">
          <Button 
            onClick={handleToggle}
            disabled={isLoading}
            variant={device.isOn ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            {device.isOn ? (
              <>
                <PowerOff size={18} /> Matikan
              </>
            ) : (
              <>
                <Power size={18} /> Hidupkan
              </>
            )}
          </Button>
          
          <ScheduleDialog device={device} />
        </div>
        
        {device.hasSchedule && device.schedule && (
          <div className="mt-3 p-3 bg-muted rounded-md text-sm">
            <p className="font-medium text-iot-blue">Jadwal Terpasang:</p>
            <div className="flex items-center justify-between mt-1 text-xs">
              {device.schedule.on && (
                <p>Nyala: {device.schedule.on.hour.toString().padStart(2, '0')}:{device.schedule.on.minute.toString().padStart(2, '0')}</p>
              )}
              {device.schedule.off && (
                <p>Mati: {device.schedule.off.hour.toString().padStart(2, '0')}:{device.schedule.off.minute.toString().padStart(2, '0')}</p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DeviceCard;
