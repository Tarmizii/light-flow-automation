import React, { useState, useEffect } from 'react';
import { esp8266Service } from '../services/esp8266Service';

interface DeviceControlProps {
  deviceName: string;
  deviceType: 'lamp1' | 'lamp2' | 'fan';
}

export const DeviceControl: React.FC<DeviceControlProps> = ({ deviceName, deviceType }) => {
  const [isOn, setIsOn] = useState(false);
  const [onTime, setOnTime] = useState('00:00');
  const [offTime, setOffTime] = useState('00:00');
  const [timerActive, setTimerActive] = useState(false);

  const handleToggle = async () => {
    try {
      switch (deviceType) {
        case 'lamp1':
          await esp8266Service.toggleLampu1(!isOn);
          break;
        case 'lamp2':
          await esp8266Service.toggleLampu2(!isOn);
          break;
        case 'fan':
          await esp8266Service.toggleKipas(!isOn);
          break;
      }
      setIsOn(!isOn);
    } catch (error) {
      console.error('Error toggling device:', error);
    }
  };

  const handleTimerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await esp8266Service.setTimer(deviceType, onTime, offTime);
      setTimerActive(true);
    } catch (error) {
      console.error('Error setting timer:', error);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm">
      <h3 className="text-lg font-semibold mb-4">{deviceName}</h3>
      
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleToggle}
          className={`px-4 py-2 rounded ${
            isOn ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isOn ? 'ON' : 'OFF'}
        </button>
      </div>

      <form onSubmit={handleTimerSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Waktu ON</label>
          <input
            type="time"
            value={onTime}
            onChange={(e) => setOnTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Waktu OFF</label>
          <input
            type="time"
            value={offTime}
            onChange={(e) => setOffTime(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Set Timer
        </button>
      </form>

      {timerActive && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded">
          Timer aktif: {onTime} - {offTime}
        </div>
      )}
    </div>
  );
}; 