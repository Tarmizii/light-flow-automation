
import React from "react";

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="bg-primary rounded-full p-2 mr-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-white"
              >
                <path d="M16.5 9.4 7.5 4.21M15 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM5 17a2 2 0 1 0 0-4 2 2 0 0 0 0 4ZM2 19v2h20v-2M2 11v2h20v-2M21.66 7.99a2 2 0 0 1 0-2.83 1.98 1.98 0 0 0-2.83 0l-2.26-2.27L16 5.17l2.28 2.28a1.96 1.96 0 0 0 0 2.83 2 2 0 0 1 3.38-2.29Z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Smart Home IoT</h1>
              <p className="text-sm text-gray-500">Kendali perangkat elektronik rumah</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
