
import React from "react";
import { DeviceProvider } from "@/contexts/DeviceContext";
import Header from "@/components/Header";
import DevicesGrid from "@/components/DevicesGrid";

const Index = () => {
  return (
    <DeviceProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
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
