import React, { useState, useEffect } from 'react';
import { DeviceControl } from '../components/DeviceControl';
import { esp8266Service } from '../services/esp8266Service';

export const HomePage: React.FC = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = await esp8266Service.checkConnection();
      setIsConnected(connected);
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kontrol Perangkat</h1>
      
      <div className="mb-4">
        <div className={`inline-block px-4 py-2 rounded ${
          isConnected ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          Status: {isConnected ? 'Terhubung' : 'Tidak Terhubung'}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DeviceControl deviceName="Lampu 1" deviceType="lamp1" />
        <DeviceControl deviceName="Lampu 2" deviceType="lamp2" />
        <DeviceControl deviceName="Kipas" deviceType="fan" />
      </div>
    </div>
  );
}; 