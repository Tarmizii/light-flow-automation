
import React from "react";
import { useDevices } from "@/contexts/DeviceContext";
import DeviceCard from "@/components/DeviceCard";

const DevicesGrid: React.FC = () => {
  const { devices } = useDevices();

  const lightDevices = devices.filter(device => device.type === 'light');
  const fanDevices = devices.filter(device => device.type === 'fan');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-medium mb-3">Lampu</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {lightDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-xl font-medium mb-3">Kipas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fanDevices.map((device) => (
            <DeviceCard key={device.id} device={device} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevicesGrid;
