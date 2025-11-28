

import React, { useEffect, useState } from 'react';
import { GIBBERISH_LOGS, DECODED_LOGS, GLOBAL_AGENCIES, INTEL_TOPICS, MILITARY_SECTORS, COMM_STATUS, COMM_MSGS, OPERATOR_CALLSIGNS, CLASSIFIED_SUBJECTS, CLASSIFIED_BODIES } from '../constants';
import { X, Globe, Mail, Radio, Send, Lock } from 'lucide-react';

export const HexDump: React.FC = () => {
    const [lines, setLines] = useState<{hex: string, msg: string, id: number}[]>([]);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    
    useEffect(() => {
        const interval = setInterval(() => {
            const hex = Array(4).fill(0).map(() => 
                `0x${Math.floor(Math.random() * 255).toString(16).toUpperCase().padStart(2, '0')}`
            ).join(' ');
            
            const msgKey = GIBBERISH_LOGS[Math.floor(Math.random() * GIBBERISH_LOGS.length)];
            const newItem = {
                hex,
                msg: msgKey,
                id: Date.now()
            };
            
            setLines(prev => [newItem, ...prev].slice(0, 20));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    const handleClick = (id: number) => {
        setSelectedId(id);
        setTimeout(() => setSelectedId(null), 3000);
    };

    return (
        <div className="font-mono text-[10px] text-green-700/80 leading-3 h-full overflow-hidden select-none cursor-pointer">
            {lines.map((l) => (
                <div 
                    key={l.id} 
                    onClick={() => handleClick(l.id)}
                    className={`hover:text-green-400 hover:bg-green-900/30 px-1 transition-colors ${selectedId === l.id ? 'bg-green-500 text-black font-bold' : ''}`}
                >
                    {selectedId === l.id ? (
                        <span className="animate-pulse">>> {DECODED_LOGS[l.msg] || "UNKNOWN_DATA_STRUCT"}</span>
                    ) : (
                        <span>{l.hex} :: {l.msg}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export const WorldMap: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
    return (
        <div 
            onClick={onClick}
            className="w-full h-32 border border-green-900 bg-black/40 relative overflow-hidden flex items-center justify-center text-green-900 font-bold select-none hover:border-green-500 transition-colors group cursor-pointer"
        >
             <span className="group-hover:text-green-500 transition-colors">[ GLOBAL THREAT MAP ]</span>
             <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-cover opacity-20 invert"></div>
             
             {/* Random Dots */}
             <div className="absolute top-10 left-10 w-1 h-1 bg-red-500 animate-ping"></div>
             <div className="absolute top-20 right-20 w-1 h-1 bg-red-500 animate-ping delay-700"></div>
             <div className="absolute bottom-10 left-1/2 w-1 h-1 bg-yellow-500 animate-pulse"></div>
        </div>
    );
};

export const MilitaryIntercomm: React.FC = () => {
    const [lines, setLines] = useState<string[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            const sector = MILITARY_SECTORS[Math.floor(Math.random() * MILITARY_SECTORS.length)];
            const status = COMM_STATUS[Math.floor(Math.random() * COMM_STATUS.length)];
            const msg = COMM_MSGS[Math.floor(Math.random() * COMM_MSGS.length)];
            const line = `[${sector}] ${status} :: ${msg}`;
            
            setLines(prev => [line, ...prev].slice(0, 10));
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="p-2 h-full overflow-hidden">
            <div className="flex flex-col gap-1">
                {lines.map((l, i) => (
                    <div key={i} className="text-[10px] font-mono border-b border-green-900/30 pb-1 text-green-600 truncate">
                        {l}
                    </div>
                ))}
            </div>
            <div className="text-[9px] text-green-800 animate-pulse mt-2">ENCRYPTED CHANNEL :: TACTICAL MESH</div>
        </div>
    );
};

export interface InboxMessage {
    id: string;
    sender: string;
    subject: string;
    body: string;
    timestamp: string;
    read: boolean;
}

export const SecureInbox: React.FC<{ onSelect: (msg: InboxMessage) => void }> = ({ onSelect }) => {
    const [messages, setMessages] = useState<InboxMessage[]>([]);

    useEffect(() => {
        // Init fake messages
        const msgs: InboxMessage[] = [];
        for (let i = 0; i < 5; i++) {
            msgs.push({
                id: Math.random().toString(36).substr(2, 9),
                sender: OPERATOR_CALLSIGNS[Math.floor(Math.random() * OPERATOR_CALLSIGNS.length)],
                subject: CLASSIFIED_SUBJECTS[Math.floor(Math.random() * CLASSIFIED_SUBJECTS.length)],
                body: CLASSIFIED_BODIES[Math.floor(Math.random() * CLASSIFIED_BODIES.length)],
                timestamp: new Date(Date.now() - Math.random() * 86400000).toLocaleTimeString(),
                read: false
            });
        }
        setMessages(msgs);
    }, []);

    return (
        <div className="p-2 h-full overflow-y-auto scrollbar-thin">
            {messages.map((m) => (
                <div 
                    key={m.id}
                    onClick={() => onSelect(m)}
                    className="mb-2 p-2 border border-green-900 bg-black/50 hover:bg-green-900/30 hover:border-green-500 cursor-pointer group transition-all"
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-bold text-green-400 group-hover:text-green-200">{m.sender}</span>
                        <span className="text-[9px] text-green-700">{m.timestamp}</span>
                    </div>
                    <div className="text-[10px] text-green-600 truncate group-hover:text-green-300">{m.subject}</div>
                    <div className="flex justify-end mt-1">
                        <Lock size={10} className="text-red-500 opacity-50" />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const InboxModal: React.FC<{ msg: InboxMessage, onClose: () => void }> = ({ msg, onClose }) => {
    const [reply, setReply] = useState("");
    const [sending, setSending] = useState(false);

    const handleSend = () => {
        if(!reply) return;
        setSending(true);
        setTimeout(() => {
            onClose();
        }, 1500);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="w-full max-w-lg border border-green-500 bg-black relative shadow-[0_0_50px_rgba(0,255,0,0.1)] flex flex-col">
                 <div className="bg-green-900/30 p-3 border-b border-green-600 flex justify-between items-center">
                     <span className="font-bold text-green-400 flex items-center gap-2">
                         <Mail size={16} /> CLASSIFIED MESSAGE // READ ONLY
                     </span>
                     <button onClick={onClose} className="text-green-500 hover:text-white"><X size={18} /></button>
                 </div>
                 
                 <div className="p-6 font-mono text-sm space-y-4">
                     <div className="grid grid-cols-[80px_1fr] gap-2 text-green-300">
                         <span className="text-green-600">FROM:</span>
                         <span className="font-bold">{msg.sender} [SECURE_ID]</span>
                         
                         <span className="text-green-600">SUBJ:</span>
                         <span className="font-bold uppercase text-red-400">{msg.subject}</span>
                         
                         <span className="text-green-600">DATE:</span>
                         <span>{msg.timestamp}</span>
                     </div>
                     
                     <div className="border-t border-b border-green-800 py-4 my-2 text-green-200 leading-relaxed min-h-[100px]">
                         {msg.body}
                     </div>
                     
                     <div className="mt-4">
                         <div className="text-xs text-green-600 mb-1">REPLY ENCRYPTED (AES-256):</div>
                         {sending ? (
                             <div className="h-24 border border-green-900 bg-green-900/10 flex items-center justify-center text-green-400 animate-pulse">
                                 ENCRYPTING & TRANSMITTING...
                             </div>
                         ) : (
                             <div className="flex flex-col gap-2">
                                <textarea 
                                    value={reply}
                                    onChange={(e) => setReply(e.target.value)}
                                    className="w-full h-24 bg-black border border-green-700 p-2 text-green-400 focus:outline-none focus:border-green-400"
                                    placeholder="Type response..."
                                />
                                <button 
                                    onClick={handleSend}
                                    className="self-end px-4 py-2 bg-green-900/30 border border-green-600 text-green-400 hover:bg-green-500 hover:text-black transition-colors flex items-center gap-2 text-xs font-bold"
                                >
                                    <Send size={14} /> SEND SECURE REPLY
                                </button>
                             </div>
                         )}
                     </div>
                 </div>
            </div>
        </div>
    );
};

interface Report {
    id: string;
    agency: string;
    country: string;
    msg: string;
    x: number; // For map placement
    y: number;
}

export const GlobalTheaterModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const [reports, setReports] = useState<Report[]>([]);

    useEffect(() => {
        // Generate random reports
        const newReports: Report[] = [];
        const count = 8;
        
        for (let i = 0; i < count; i++) {
            const agencyInfo = GLOBAL_AGENCIES[Math.floor(Math.random() * GLOBAL_AGENCIES.length)];
            const topic = INTEL_TOPICS[Math.floor(Math.random() * INTEL_TOPICS.length)];
            
            // Add slight jitter so multiple reports from same agency don't overlap perfectly
            const jitterX = (Math.random() - 0.5) * 2; 
            const jitterY = (Math.random() - 0.5) * 2;
            
            const x = agencyInfo.coords.x + jitterX;
            const y = agencyInfo.coords.y + jitterY;

            newReports.push({
                id: `RPT-${Math.floor(Math.random() * 99999)}`,
                agency: agencyInfo.agency,
                country: agencyInfo.country,
                msg: `${agencyInfo.agency} ${topic}`,
                x,
                y
            });
        }
        setReports(newReports);
    }, []);

    return (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm">
            <div className="w-full h-full max-w-6xl border-2 border-green-600 bg-black relative flex flex-col md:flex-row overflow-hidden shadow-[0_0_50px_rgba(0,255,0,0.2)]">
                
                {/* Close Button */}
                <button onClick={onClose} className="absolute top-2 right-2 text-green-500 hover:text-white z-50 p-2 border border-green-800 hover:bg-green-900">
                    <X size={24} />
                </button>

                {/* Main Map Area */}
                <div className="flex-1 relative bg-[#051105] overflow-hidden border-b md:border-b-0 md:border-r border-green-800">
                     {/* Map Background */}
                     <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/e/ec/World_map_blank_without_borders.svg')] bg-contain bg-center bg-no-repeat opacity-30 invert"></div>
                     
                     {/* Scanning Grid Effect */}
                     <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,255,0,0.1)_50%)] bg-[length:100%_4px] pointer-events-none"></div>
                     <div className="absolute inset-0 w-full h-2 bg-green-500/20 shadow-[0_0_20px_rgba(0,255,0,0.5)] animate-[scan_4s_linear_infinite]"></div>

                     {/* Report Markers */}
                     {reports.map((rpt, i) => (
                         <div 
                            key={rpt.id}
                            className="absolute flex flex-col items-center group cursor-crosshair"
                            style={{ top: `${rpt.y}%`, left: `${rpt.x}%` }}
                         >
                             <div className="w-3 h-3 bg-red-500 rounded-full animate-ping absolute"></div>
                             <div className="w-3 h-3 bg-red-600 rounded-full relative border border-black z-10"></div>
                             <div className="hidden group-hover:block absolute top-4 left-4 bg-black/90 border border-green-500 p-2 w-48 text-[10px] text-green-400 z-20 shadow-lg">
                                 <div className="font-bold text-white border-b border-green-800 mb-1">{rpt.agency} // {rpt.country}</div>
                                 {rpt.msg}
                             </div>
                         </div>
                     ))}
                     
                     <div className="absolute bottom-4 left-4">
                         <h1 className="text-2xl md:text-4xl font-bold text-green-500/50 tracking-widest tech-text">GLOBAL INTELLIGENCE THEATER</h1>
                         <div className="text-xs text-green-700">LIVE FEED // DECLASSIFIED SOURCES ONLY</div>
                     </div>
                </div>

                {/* Side Panel: Report List */}
                <div className="w-full md:w-80 bg-black/90 flex flex-col shrink-0">
                    <div className="p-4 border-b border-green-800 flex items-center gap-2 text-green-400 font-bold bg-green-900/10">
                        <Globe size={18} />
                        <span>INTERCEPTED CABLES</span>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
                        {reports.map((rpt) => (
                            <div key={rpt.id} className="border-l-2 border-green-600 pl-3 py-1 hover:bg-green-900/20 transition-colors">
                                <div className="flex justify-between text-[10px] text-green-600 mb-1">
                                    <span>{rpt.id}</span>
                                    <span>{rpt.country}</span>
                                </div>
                                <div className="text-green-300 font-bold mb-0.5">AGENCY: {rpt.agency}</div>
                                <div className="text-gray-400 leading-tight">{rpt.msg}</div>
                            </div>
                        ))}
                        <div className="text-center text-green-800 animate-pulse mt-4">-- END OF STREAM --</div>
                    </div>
                </div>

            </div>
        </div>
    );
};
