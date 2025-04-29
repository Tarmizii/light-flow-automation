import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";
import { Device, ApiResponse, DeviceType, Schedule } from "@/types";
import { toast } from "sonner";
import { 
  toggleDeviceOnNodeMCU, 
  setDeviceScheduleOnNodeMCU,
  removeDeviceScheduleOnNodeMCU
} from "@/services/nodeService";

interface DeviceContextType {
  devices: Device[];
  toggleDevice: (id: string) => Promise<void>;
  setDeviceSchedule: (id: string, schedule: Schedule) => Promise<void>;
  removeDeviceSchedule: (id: string) => Promise<void>;
  isLoading: boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

// Initial mock data for devices
const initialDevices: Device[] = [
  {
    id: "light-1",
    name: "Lampu 1",
    type: "light",
    isOn: false,
    hasSchedule: false,
  },
  {
    id: "light-2",
    name: "Lampu 2",
    type: "light",
    isOn: false,
    hasSchedule: false,
  },
  {
    id: "fan-1",
    name: "Kipas",
    type: "fan",
    isOn: false,
    hasSchedule: false,
  },
];

// Mock API function - in a real app, this would make actual API calls to your Arduino
const mockApiCall = async (
  endpoint: string,
  data: any
): Promise<ApiResponse> => {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));
  
  console.log(`API Call to ${endpoint}:`, data);
  
  // Simulate API response
  return {
    success: true,
    message: `Successfully called ${endpoint}`,
  };
};

export const DeviceProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [isLoading, setIsLoading] = useState(false);

  // Toggle device on/off
  const toggleDevice = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const deviceIndex = devices.findIndex((d) => d.id === id);
      if (deviceIndex !== -1) {
        const device = devices[deviceIndex];
        const newStatus = !device.isOn;
        
        // Call NodeMCU API to update device state
        await toggleDeviceOnNodeMCU(id, newStatus);
        
        const updatedDevices = [...devices];
        updatedDevices[deviceIndex] = {
          ...device,
          isOn: newStatus,
        };
        setDevices(updatedDevices);
        toast.success(`${device.name} telah ${newStatus ? "dinyalakan" : "dimatikan"}`);
      }
    } catch (error) {
      console.error("Error toggling device:", error);
      toast.error("Terjadi kesalahan saat mengubah status perangkat");
    } finally {
      setIsLoading(false);
    }
  }, [devices]);

  // Set device schedule
  const setDeviceSchedule = useCallback(async (id: string, schedule: Schedule) => {
    setIsLoading(true);
    try {
      const deviceIndex = devices.findIndex((d) => d.id === id);
      if (deviceIndex !== -1) {
        const device = devices[deviceIndex];
        
        // Call NodeMCU API to set device schedule
        await setDeviceScheduleOnNodeMCU(id, schedule);
        
        const updatedDevices = [...devices];
        updatedDevices[deviceIndex] = {
          ...device,
          hasSchedule: true,
          schedule,
        };
        setDevices(updatedDevices);
        toast.success(`Jadwal untuk ${device.name} telah diatur`);
      }
    } catch (error) {
      console.error("Error setting device schedule:", error);
      toast.error("Terjadi kesalahan saat mengatur jadwal perangkat");
    } finally {
      setIsLoading(false);
    }
  }, [devices]);

  // Remove device schedule
  const removeDeviceSchedule = useCallback(async (id: string) => {
    setIsLoading(true);
    try {
      const deviceIndex = devices.findIndex((d) => d.id === id);
      if (deviceIndex !== -1) {
        const device = devices[deviceIndex];
        
        // Call NodeMCU API to remove device schedule
        await removeDeviceScheduleOnNodeMCU(id);
        
        const updatedDevices = [...devices];
        updatedDevices[deviceIndex] = {
          ...device,
          hasSchedule: false,
          schedule: undefined,
        };
        setDevices(updatedDevices);
        toast.success(`Jadwal untuk ${device.name} telah dihapus`);
      }
    } catch (error) {
      console.error("Error removing device schedule:", error);
      toast.error("Terjadi kesalahan saat menghapus jadwal perangkat");
    } finally {
      setIsLoading(false);
    }
  }, [devices]);

  // Check scheduled tasks every minute
  useEffect(() => {
    const checkSchedules = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      devices.forEach(device => {
        if (device.hasSchedule && device.schedule) {
          // Check ON schedule
          if (device.schedule.on && 
              device.schedule.on.hour === currentHour && 
              device.schedule.on.minute === currentMinute && 
              !device.isOn) {
            toggleDevice(device.id);
          }
          
          // Check OFF schedule
          if (device.schedule.off && 
              device.schedule.off.hour === currentHour && 
              device.schedule.off.minute === currentMinute && 
              device.isOn) {
            toggleDevice(device.id);
          }
        }
      });
    };
    
    // Run once immediately and then every minute
    checkSchedules();
    const intervalId = setInterval(checkSchedules, 60000);
    
    return () => clearInterval(intervalId);
  }, [devices, toggleDevice]);

  const value = {
    devices,
    toggleDevice,
    setDeviceSchedule,
    removeDeviceSchedule,
    isLoading,
  };

  return <DeviceContext.Provider value={value}>{children}</DeviceContext.Provider>;
};

export const useDevices = () => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDevices must be used within a DeviceProvider");
  }
  return context;
};
