import axios from 'axios';

const ESP8266_BASE_URL = 'http://192.168.1.100'; // Ganti dengan IP ESP8266 Anda

export interface Timer {
  onHour: number;
  onMinute: number;
  offHour: number;
  offMinute: number;
  active: boolean;
}

export interface DeviceState {
  lampu1: boolean;
  lampu2: boolean;
  kipas: boolean;
}

class ESP8266Service {
  private baseUrl: string;

  constructor(baseUrl: string = ESP8266_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async checkConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/check`);
      return response.data === 'ESP8266 Connected';
    } catch (error) {
      console.error('Error checking ESP8266 connection:', error);
      return false;
    }
  }

  async toggleLampu1(state: boolean): Promise<void> {
    try {
      await axios.get(`${this.baseUrl}/${state ? 'ON1' : 'OFF1'}`);
    } catch (error) {
      console.error('Error toggling Lampu 1:', error);
      throw error;
    }
  }

  async toggleLampu2(state: boolean): Promise<void> {
    try {
      await axios.get(`${this.baseUrl}/${state ? 'ON2' : 'OFF2'}`);
    } catch (error) {
      console.error('Error toggling Lampu 2:', error);
      throw error;
    }
  }

  async toggleKipas(state: boolean): Promise<void> {
    try {
      await axios.get(`${this.baseUrl}/${state ? 'FANON' : 'FANOFF'}`);
    } catch (error) {
      console.error('Error toggling Kipas:', error);
      throw error;
    }
  }

  async setTimer(device: 'lamp1' | 'lamp2' | 'fan', onTime: string, offTime: string): Promise<void> {
    try {
      await axios.get(`${this.baseUrl}/setTimer`, {
        params: {
          device,
          on: onTime,
          off: offTime
        }
      });
    } catch (error) {
      console.error('Error setting timer:', error);
      throw error;
    }
  }
}

export const esp8266Service = new ESP8266Service(); 