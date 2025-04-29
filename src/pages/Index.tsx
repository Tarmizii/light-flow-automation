
import React, { useState } from "react";
import { DeviceProvider } from "@/contexts/DeviceContext";
import Header from "@/components/Header";
import DevicesGrid from "@/components/DevicesGrid";
import { Button } from "@/components/ui/button";
import { WifiIcon, WifiOff } from "lucide-react";

const Index = () => {
  const [isConnected, setIsConnected] = useState(true);
  const nodeMcuIp = "192.168.1.7";

  // Function to check NodeMCU connection
  const checkConnection = async () => {
    try {
      await fetch(`http://${nodeMcuIp}/status`, { signal: AbortSignal.timeout(3000) });
      setIsConnected(true);
    } catch (error) {
      setIsConnected(false);
      console.error("Failed to connect to NodeMCU:", error);
    }
  };

  return (
    <DeviceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Smart Home IoT</h1>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <span className="inline-flex items-center text-sm text-green-600">
                  <WifiIcon size={18} className="mr-1" /> Terhubung ke NodeMCU ({nodeMcuIp})
                </span>
              ) : (
                <span className="inline-flex items-center text-sm text-red-600">
                  <WifiOff size={18} className="mr-1" /> Tidak terhubung ke NodeMCU
                </span>
              )}
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkConnection}
              >
                Periksa Koneksi
              </Button>
            </div>
          </div>
          <DevicesGrid />
        </main>
        <footer className="py-4 text-center text-sm text-gray-500 border-t border-gray-200">
          <p>© 2025 Smart Home IoT</p>
        </footer>
      </div>
    </DeviceProvider>
  );
};

export default Index;
