

import React, { useState, useEffect } from 'react';
import BootSequence from './components/BootSequence';
import LoginScreen from './components/LoginScreen';
import Terminal from './components/Terminal';
import Chatbot from './components/Chatbot';
import { IntelWorkstation } from './components/Games';
import { BootStep } from './types';
import { Terminal as TerminalIcon, Cpu, User, Folder, Radio, ShieldAlert, Activity, Github, ExternalLink } from 'lucide-react';
import { HexDump, WorldMap, GlobalTheaterModal, MilitaryIntercomm, SecureInbox, InboxModal, InboxMessage } from './components/Decorations';
import { DEFCON_INFO } from './constants';

// Tab Definitions
type Tab = 'terminal' | 'intel' | 'comms' | 'projects' | 'soc_intel';

const App: React.FC = () => {
  const [bootStep, setBootStep] = useState<BootStep>(BootStep.BIOS);
  const [activeTab, setActiveTab] = useState<Tab>('terminal');
  const [defcon, setDefcon] = useState(4); // Default to Double Take
  const [showGlobalMap, setShowGlobalMap] = useState(false);
  const [selectedInboxMsg, setSelectedInboxMsg] = useState<InboxMessage | null>(null);

  const handleBootComplete = () => setBootStep(BootStep.LOGIN);
  const handleLoginComplete = () => setBootStep(BootStep.COMPLETE);

  if (bootStep === BootStep.BIOS) return <BootSequence onComplete={handleBootComplete} />;
  if (bootStep === BootStep.LOGIN) return <LoginScreen onComplete={handleLoginComplete} />;

  // Get current DEFCON info
  const currentDefconInfo = DEFCON_INFO[defcon as keyof typeof DEFCON_INFO];

  return (
    <div className="w-full h-screen bg-black text-green-500 font-mono flex flex-col overflow-hidden relative">
      
      {/* HEADER */}
      <header className="h-14 border-b border-green-800 bg-black/95 flex items-center justify-between px-4 select-none z-10 shrink-0">
         <div className="flex items-center gap-6">
             <div className="flex flex-col">
                <div className="text-2xl font-bold tracking-widest text-green-400 tech-text leading-none">US-CYBERCOM</div>
                <div className="text-[10px] text-green-800 tracking-[0.5em] font-bold">TACTICAL OPERATIONS</div>
             </div>
             
             {/* DEFCON INDICATOR */}
             <div className="hidden md:flex items-center gap-3 border border-green-900 bg-black/50 px-4 py-1">
                 <ShieldAlert size={20} className={`${currentDefconInfo.color} ${defcon <= 2 ? 'animate-pulse' : ''}`} />
                 <div className="flex flex-col">
                     <span className={`text-xl font-bold leading-none ${currentDefconInfo.color}`}>DEFCON {defcon}</span>
                     <span className={`text-[9px] uppercase tracking-wider ${currentDefconInfo.color}`}>{currentDefconInfo.code}</span>
                 </div>
             </div>
         </div>
         <div className="flex flex-col items-end text-xs">
             <span className="hidden md:inline text-green-600 font-bold">AUTH: NATH, A. [LEVEL 5]</span>
             <span className="text-green-400">{new Date().toLocaleTimeString()}Z</span>
         </div>
      </header>

      {/* MAIN GRID */}
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
          
          {/* LEFT SIDEBAR (NAV) */}
          <nav className="w-16 md:w-48 flex flex-col gap-2 shrink-0 z-10">
              <NavButton active={activeTab === 'terminal'} onClick={() => setActiveTab('terminal')} icon={<TerminalIcon />} label="TERMINAL_OPS" />
              <NavButton active={activeTab === 'intel'} onClick={() => setActiveTab('intel')} icon={<User />} label="INTEL_DOSSIER" />
              <NavButton active={activeTab === 'comms'} onClick={() => setActiveTab('comms')} icon={<Cpu />} label="AI_UPLINK" />
              <NavButton active={activeTab === 'projects'} onClick={() => setActiveTab('projects')} icon={<Folder />} label="ARCHIVE_DATA" />
              <NavButton active={activeTab === 'soc_intel'} onClick={() => setActiveTab('soc_intel')} icon={<Radio />} label="SOC_INTEL" />
              
              <div className="mt-auto border border-green-900 bg-black/50 p-2 hidden md:block">
                  <div className="text-[10px] text-green-700 mb-1">GLOBAL_THEATER</div>
                  <WorldMap onClick={() => setShowGlobalMap(true)} />
              </div>
          </nav>

          {/* CENTER VIEWPORT */}
          <main className="flex-1 flex flex-col border border-green-600 bg-black/80 relative retro-border shadow-[0_0_20px_rgba(0,255,0,0.1)] z-20 overflow-hidden">
             {/* Viewport Header */}
             <div className="h-6 bg-green-900/20 border-b border-green-800 flex items-center px-2 text-[10px] justify-between">
                 <span>VIEWPORT :: {activeTab.toUpperCase()}</span>
                 <span className="flex items-center gap-1"><Activity size={10} className="animate-spin" /> SECURE_CONN</span>
             </div>
             
             {/* Content Area */}
             <div className="flex-1 overflow-hidden relative">
                 {activeTab === 'terminal' && <Terminal />}
                 {activeTab === 'comms' && <Chatbot />}
                 {activeTab === 'intel' && <IntelView />}
                 {activeTab === 'projects' && <ProjectsView />}
                 {activeTab === 'soc_intel' && <IntelWorkstation defcon={defcon} setDefcon={setDefcon} />}
             </div>
          </main>

          {/* RIGHT SIDEBAR (METRICS) */}
          <aside className="w-64 hidden lg:flex flex-col gap-2 shrink-0 z-10">
              <div className="h-1/3 border border-green-900 bg-black/40 p-2 flex flex-col">
                  <div className="text-xs font-bold text-green-600 mb-1 border-b border-green-900 pb-1">MILITARY_INTERCOMM</div>
                  <MilitaryIntercomm />
              </div>
              <div className="h-1/3 border border-green-900 bg-black/40 p-2 relative flex flex-col">
                  <div className="text-xs font-bold text-green-600 mb-1 border-b border-green-900 pb-1">SECURE_INBOX</div>
                  <SecureInbox onSelect={setSelectedInboxMsg} />
              </div>
              <div className="h-1/3 border border-green-900 bg-black/40 p-2 flex flex-col overflow-hidden">
                   <div className="text-xs font-bold text-green-600 mb-1 border-b border-green-900 pb-1">RAW_DATA_STREAM</div>
                   <HexDump />
              </div>
          </aside>

      </div>
      
      {/* FOOTER */}
      <footer className="h-6 bg-black border-t border-green-900 flex items-center px-4 text-[10px] text-green-800 shrink-0">
           <span className="mr-4">CONNECTION: SECURE (AES-256)</span>
           <span className="mr-4">SERVER: NATH-MAIN-01</span>
           <span className="flex-1 text-right animate-pulse">AWAITING INPUT...</span>
      </footer>

      {/* MODALS */}
      {showGlobalMap && <GlobalTheaterModal onClose={() => setShowGlobalMap(false)} />}
      {selectedInboxMsg && <InboxModal msg={selectedInboxMsg} onClose={() => setSelectedInboxMsg(null)} />}
    </div>
  );
};

const NavButton: React.FC<{ active: boolean, onClick: () => void, icon: React.ReactNode, label: string }> = ({ active, onClick, icon, label }) => (
    <button 
        onClick={onClick}
        className={`
            h-12 md:h-10 flex items-center gap-3 px-3 md:px-4 border transition-all duration-200
            ${active 
                ? 'bg-green-900/40 border-green-500 text-green-100 shadow-[inset_0_0_10px_rgba(0,255,0,0.2)]' 
                : 'bg-black/40 border-green-900 text-green-700 hover:text-green-400 hover:border-green-700'
            }
        `}
    >
        <div className={active ? "text-green-400" : ""}>{icon}</div>
        <span className="hidden md:block text-xs font-bold tracking-wider">{label}</span>
        {active && <div className="ml-auto w-1.5 h-1.5 bg-green-500 rounded-full animate-blink-fast hidden md:block"></div>}
    </button>
);

const IntelView = () => (
    <div className="p-8 text-green-400 font-mono overflow-y-auto h-full bg-[url('https://www.transparenttextures.com/patterns/diagmonds-light.png')]">
        <div className="border border-green-600 p-6 bg-black/80 max-w-3xl mx-auto shadow-lg relative">
             <div className="absolute top-0 right-0 p-2 border-l border-b border-green-800 text-xs text-green-700">CONFIDENTIAL</div>
             <h1 className="text-3xl font-bold border-b-2 border-green-600 mb-6 pb-2 text-green-100 flex items-center gap-3">
                 <User size={32} />
                 OPERATIVE: NATH, AAKASH
             </h1>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="text-sm font-bold text-green-600 mb-2 uppercase tracking-widest">:: CLASSIFICATION ::</h3>
                    <p className="mb-4">Software Engineer | AI/ML Specialist</p>
                    <div className="text-xs space-y-2 text-green-300">
                        <p>ID: 9123870182</p>
                        <p>LOC: Kolkata, West Bengal</p>
                        <p>EMAIL: aakashnath645@gmail.com</p>
                        <a href="https://github.com/aakashnath645" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:text-green-100 cursor-pointer w-fit">
                            <Github size={12} /> GITHUB: aakashnath645
                        </a>
                    </div>
                </div>
                
                <div className="border-l border-green-800 pl-4">
                     <h3 className="text-sm font-bold text-green-600 mb-2 uppercase tracking-widest">:: EDUCATION LOG ::</h3>
                     <ul className="text-sm space-y-3">
                        <li>
                            <div className="font-bold text-green-200">B.Tech (CSE)</div>
                            <div className="text-xs text-green-600">UEM, Kolkata (2025) | Score: 8.36/10</div>
                        </li>
                        <li>
                            <div className="font-bold text-green-200">Higher Secondary</div>
                            <div className="text-xs text-green-600">Pathfinder Public School (2021)</div>
                        </li>
                    </ul>
                </div>
             </div>
             
             <h3 className="text-sm font-bold text-green-600 mt-8 mb-4 uppercase tracking-widest border-b border-green-900">:: FIELD EXPERIENCE ::</h3>
             <div className="mb-4 bg-green-900/10 p-4 border border-green-800/50">
                <div className="flex justify-between mb-2">
                    <span className="font-bold text-green-200">Saregama India Ltd.</span>
                    <span className="text-xs bg-green-800 text-black px-1">FEB 25 - JUL 25</span>
                </div>
                <div className="text-xs text-green-500 mb-2">ROLE: IT & Technology Intern</div>
                <ul className="list-square pl-5 text-sm space-y-1 text-green-300">
                    <li>Deployed LLM-based resume screening tool (Efficiency +40%).</li>
                    <li>Engineered NLP pipelines using transformers.</li>
                    <li>Integrated AI modules into internal dashboards.</li>
                </ul>
             </div>
        </div>
    </div>
);

const ProjectsView = () => (
    <div className="p-6 font-mono text-green-400 overflow-y-auto h-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <ProjectCard 
            title="Resume Classifier" 
            year="2025" 
            tech="Python, Gemini, TF-IDF" 
            desc="AI-powered web app for resume analysis and job matching. Features interactive dashboard and batch processing."
            link="https://github.com/Aakashnath645/Resume-Processing"
        />
        <ProjectCard 
            title="PARKIT System" 
            year="2024" 
            tech="HTML, CSS, Flask, SQLite" 
            desc="Parking management system with automated billing and space reservation. Real-world applicability verified."
            link="https://github.com/Aakashnath645/PARKIT--Parking-Management-System-"
        />
        <ProjectCard 
            title="Sentinel - Planetary Surveillance" 
            year="2024" 
            tech="React, Three.js, WebGL" 
            desc="High-fidelity 3D visualization platform tracking 25,000+ active satellites and orbital debris in real-time using NORAD TLE data."
            link="https://github.com/Aakashnath645/Sentinel"
        />
    </div>
);

const ProjectCard: React.FC<{title: string, year: string, tech: string, desc: string, link: string}> = ({title, year, tech, desc, link}) => (
    <div className="border border-green-800 bg-black/60 p-4 relative group hover:border-green-500 transition-colors flex flex-col">
        <div className="absolute top-0 right-0 bg-green-900 text-green-100 px-2 py-0.5 text-[10px] font-bold">{year}</div>
        <div className="absolute top-0 left-0 w-2 h-2 bg-green-600"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-600"></div>
        
        <h3 className="text-lg font-bold mb-2 text-green-200 group-hover:text-green-400">{title}</h3>
        <div className="text-[10px] uppercase text-green-600 mb-3 border-b border-green-900 pb-1">{tech}</div>
        <p className="text-xs text-green-300 leading-relaxed mb-4">{desc}</p>
        
        <a 
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-auto w-full border border-green-800 hover:bg-green-900/50 text-xs py-2 text-green-500 uppercase flex items-center justify-center gap-2 transition-all hover:text-green-400 hover:border-green-500"
        >
            <Github size={14} /> Access Codebase <ExternalLink size={10} />
        </a>
    </div>
);

export default App;