import React from 'react';
// Note: This component is largely deprecated in the new Grid Layout (App.tsx) 
// but kept for compatibility if we revert to floating windows.

interface WindowProps {
  children: React.ReactNode;
  title: string;
}

const Window: React.FC<WindowProps> = ({ children, title }) => {
  return (
    <div className="h-full w-full flex flex-col border border-green-700 bg-black/90 overflow-hidden">
      <div className="bg-green-900/30 border-b border-green-700 p-1 px-2 text-xs font-bold text-green-100 uppercase tracking-wider flex justify-between items-center">
        <span>[{title}]</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
        </div>
      </div>
      <div className="flex-1 overflow-hidden relative">
        {children}
      </div>
    </div>
  );
};

export default Window;