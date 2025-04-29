
// Service to handle API calls to the NodeMCU device
import { Schedule } from "@/types";

// NodeMCU IP address - this should be configurable in a real app
const NODE_MCU_IP = "192.168.1.100";

// Map device IDs to NodeMCU endpoint names
const deviceEndpointMap = {
  "light-1": "lamp1",
  "light-2": "lamp2",
  "fan-1": "fan"
};

/**
 * Toggle a device on or off
 * @param deviceId The ID of the device to toggle
 * @param turnOn Whether to turn the device on (true) or off (false)
 * @returns A promise that resolves with the response text
 */
export const toggleDeviceOnNodeMCU = async (
  deviceId: string,
  turnOn: boolean
): Promise<string> => {
  let endpoint = "";
  
  // Determine the correct endpoint based on device ID and desired state
  if (deviceId === "light-1") {
    endpoint = turnOn ? "/ON1" : "/OFF1";
  } else if (deviceId === "light-2") {
    endpoint = turnOn ? "/ON2" : "/OFF2";
  } else if (deviceId === "fan-1") {
    endpoint = turnOn ? "/FANON" : "/FANOFF";
  } else {
    throw new Error(`Unknown device ID: ${deviceId}`);
  }
  
  try {
    const response = await fetch(`http://${NODE_MCU_IP}${endpoint}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Error toggling device on NodeMCU:", error);
    throw error;
  }
};

/**
 * Set a schedule for a device on the NodeMCU
 * @param deviceId The ID of the device
 * @param schedule The schedule to set
 * @returns A promise that resolves with the response text
 */
export const setDeviceScheduleOnNodeMCU = async (
  deviceId: string,
  schedule: Schedule
): Promise<string> => {
  // Map device ID to NodeMCU endpoint name
  const deviceName = deviceEndpointMap[deviceId as keyof typeof deviceEndpointMap];
  
  if (!deviceName) {
    throw new Error(`Unknown device ID: ${deviceId}`);
  }
  
  // Format on/off times for the NodeMCU endpoint
  const onTime = schedule.on 
    ? `${schedule.on.hour.toString().padStart(2, '0')}:${schedule.on.minute.toString().padStart(2, '0')}`
    : "00:00";
  
  const offTime = schedule.off 
    ? `${schedule.off.hour.toString().padStart(2, '0')}:${schedule.off.minute.toString().padStart(2, '0')}`
    : "00:00";
  
  const url = `http://${NODE_MCU_IP}/setTimer?device=${deviceName}&on=${onTime}&off=${offTime}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Error setting schedule on NodeMCU:", error);
    throw error;
  }
};

/**
 * Remove a schedule for a device on the NodeMCU
 * @param deviceId The ID of the device
 * @returns A promise that resolves with the response text
 */
export const removeDeviceScheduleOnNodeMCU = async (
  deviceId: string
): Promise<string> => {
  // Map device ID to NodeMCU endpoint name
  const deviceName = deviceEndpointMap[deviceId as keyof typeof deviceEndpointMap];
  
  if (!deviceName) {
    throw new Error(`Unknown device ID: ${deviceId}`);
  }
  
  // Send a request to remove the schedule (set on and off times to empty)
  const url = `http://${NODE_MCU_IP}/setTimer?device=${deviceName}&on=&off=`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    return await response.text();
  } catch (error) {
    console.error("Error removing schedule on NodeMCU:", error);
    throw error;
  }
};
