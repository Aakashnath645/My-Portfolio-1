import React, { useEffect, useState } from 'react';

interface BootSequenceProps {
  onComplete: () => void;
}

const BootSequence: React.FC<BootSequenceProps> = ({ onComplete }) => {
  const [lines, setLines] = useState<string[]>([]);
  
  const bootText = [
    "NATH-OS BIOS v1.0.4",
    "Copyright (C) 2025, Aakash Industries",
    "CPU: Neural-Net Processor @ 4.20GHz",
    "RAM: 64TB Quantum Memory",
    "Checking peripherals...",
    "  > Keyboard... DETECTED",
    "  > Mouse... DETECTED",
    "  > Neural Uplink... ONLINE",
    "Initializing GeminAI Core...",
    "Loading Kernel modules...",
    "Mounting file system...",
    "ACCESS GRANTED",
    "Welcome, Guest."
  ];

  useEffect(() => {
    let delay = 0;
    bootText.forEach((text, index) => {
      delay += Math.random() * 300 + 100;
      setTimeout(() => {
        setLines(prev => [...prev, text]);
        if (index === bootText.length - 1) {
          setTimeout(onComplete, 800);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="h-full w-full bg-black text-green-500 p-8 font-mono flex flex-col justify-start items-start text-lg md:text-xl overflow-hidden">
      {lines.map((line, i) => (
        <div key={i} className="whitespace-pre-wrap">{line}</div>
      ))}
      <div className="animate-pulse">_</div>
    </div>
  );
};

export default BootSequence;