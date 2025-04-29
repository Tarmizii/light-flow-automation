
// Device types
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  isOn: boolean;
  hasSchedule: boolean;
  schedule?: Schedule;
}

export type DeviceType = "light" | "fan";

export interface Schedule {
  on?: {
    hour: number;
    minute: number;
  };
  off?: {
    hour: number;
    minute: number;
  };
}

// API response types (for mocking)
export interface ApiResponse {
  success: boolean;
  message: string;
}
