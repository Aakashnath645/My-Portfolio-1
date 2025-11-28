
import React, { useState, useEffect, useRef } from 'react';
import { ShieldAlert, Radio, FileText, Send, AlertTriangle, CheckCircle, Crosshair, Server } from 'lucide-react';
import { INTEL_DATA } from '../constants';

interface IntelWorkstationProps {
    defcon: number;
    setDefcon: (level: number) => void;
}

interface IntelItem {
    id: string;
    type: string;
    content: string;
    threat: boolean;
    category: string;
}

export const IntelWorkstation: React.FC<IntelWorkstationProps> = ({ defcon, setDefcon }) => {
    const [incomingFeed, setIncomingFeed] = useState<IntelItem[]>([]);
    const [selectedIntel, setSelectedIntel] = useState<IntelItem | null>(null);
    const [reports, setReports] = useState<string[]>([]);
    const [analyzedCount, setAnalyzedCount] = useState(0);
    const [accuracy, setAccuracy] = useState(100);
    const [batchScore, setBatchScore] = useState(0);

    // Feed Generator
    useEffect(() => {
        const interval = setInterval(() => {
            const template = INTEL_DATA[Math.floor(Math.random() * INTEL_DATA.length)];
            const newItem: IntelItem = {
                ...template,
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                content: `[${new Date().toLocaleTimeString()}] ${template.content}`
            };
            setIncomingFeed(prev => {
                // Keep max 15 items to prevent overflow if user is slow
                const newFeed = [newItem, ...prev].slice(0, 15);
                return newFeed;
            });
        }, 4000); // Slightly slower generation to give user time
        return () => clearInterval(interval);
    }, []);

    // Auto-select if nothing is selected and feed has items
    useEffect(() => {
        if (!selectedIntel && incomingFeed.length > 0) {
            // Optional: Auto-select latest? Or let user choose.
            // Let's not force auto-select on *initial* load, but helpful after action.
        }
    }, [incomingFeed, selectedIntel]);

    const handleAnalyze = (intel: IntelItem, action: 'FLAG' | 'DISCARD') => {
        let isCorrect = false;
        
        if (action === 'FLAG' && intel.threat) isCorrect = true;
        if (action === 'DISCARD' && !intel.threat) isCorrect = true;

        if (isCorrect) {
            setReports(prev => [`[SUCCESS] ID:${intel.id.slice(-4)} // Status: VERIFIED`, ...prev]);
            setAnalyzedCount(c => c + 1);
            setBatchScore(s => s + 1);
            // Small accuracy boost
            setAccuracy(prev => Math.min(100, prev + 2));
        } else {
            setReports(prev => [`[FAILURE] ID:${intel.id.slice(-4)} // ERR: MISCLASSIFIED`, ...prev]);
            setAccuracy(prev => Math.max(0, prev - 15)); // Penalize harder for mistakes
            setBatchScore(s => s - 2);
            // Immediate penalty for individual failure
            if (defcon > 1) setDefcon(defcon - 1);
        }

        // Remove the processed item
        const newFeed = incomingFeed.filter(i => i.id !== intel.id);
        setIncomingFeed(newFeed);

        // Auto-select the next available item to keep flow smooth
        if (newFeed.length > 0) {
            setSelectedIntel(newFeed[0]);
        } else {
            setSelectedIntel(null);
        }
    };

    const handleTransmit = () => {
        if (reports.length === 0) return;

        // Logic: If batch score is positive, we improve DEFCON (towards 5/Peace)
        // If batch score is negative, we might degrade DEFCON (towards 1/War)
        
        let statusMsg = "";
        
        if (batchScore > 3) {
            statusMsg = "BATCH ACCEPTED. INTEL VALUABLE. DEFCON STATUS IMPROVED.";
            if (defcon < 5) setDefcon(defcon + 1);
        } else if (batchScore < -2) {
            statusMsg = "BATCH REJECTED. POOR INTELLIGENCE QUALITY. ALERT LEVEL RAISED.";
            if (defcon > 1) setDefcon(defcon - 1);
        } else {
            statusMsg = "BATCH LOGGED. AWAITING FURTHER DATA.";
        }

        // Reset local batch tracking
        setReports([`>> TRANSMISSION COMPLETE: ${new Date().toLocaleTimeString()}`, `>> STATUS: ${statusMsg}`]);
        setBatchScore(0);
    };

    return (
        <div className="h-full flex flex-col p-2 bg-black/80 font-mono text-xs overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-green-800 pb-2 mb-2 shrink-0">
                <div className="flex items-center gap-2 text-green-500 font-bold">
                    <Radio className="animate-pulse" size={16} />
                    <span>INTELLIGENCE GATHERING STATION // SIGINT_NODE_01</span>
                </div>
                <div className="flex gap-4">
                    <span className={`${accuracy < 50 ? 'text-red-500 animate-pulse' : 'text-green-600'}`}>ANALYST_ACCURACY: {accuracy}%</span>
                    <span className="text-green-600">REPORTS_PENDING: {reports.length}</span>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-2 min-h-0">
                
                {/* COLUMN 1: INCOMING FEED */}
                <div className="border border-green-900 bg-black/40 flex flex-col min-h-0">
                    <div className="bg-green-900/20 p-1 font-bold text-green-400 border-b border-green-900 flex justify-between shrink-0">
                        <span>RAW_CABLE_FEED</span>
                        <div className="flex items-center gap-2">
                             <span className="text-[10px] text-green-700">BUFFER: {incomingFeed.length}/15</span>
                             <span className="animate-blink-slow text-green-500">LIVE</span>
                        </div>
                    </div>
                    <div className="overflow-y-auto p-2 space-y-2 flex-1 scrollbar-thin">
                        {incomingFeed.length === 0 && (
                            <div className="text-center text-green-800 mt-10 animate-pulse">AWAITING SATELLITE UPLINK...</div>
                        )}
                        {incomingFeed.map((item) => (
                            <div 
                                key={item.id} 
                                onClick={() => setSelectedIntel(item)}
                                className={`p-2 border border-dashed border-green-900/50 cursor-pointer hover:bg-green-900/30 transition-colors ${selectedIntel?.id === item.id ? 'bg-green-900/40 border-green-500' : ''}`}
                            >
                                <div className="flex justify-between text-[10px] text-green-700 mb-1">
                                    <span>SOURCE: {item.type}</span>
                                    <span>ID: {item.id.slice(-6)}</span>
                                </div>
                                <div className="text-green-300 leading-tight">{item.content}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* COLUMN 2: ANALYST DESK */}
                <div className="border border-green-900 bg-black/40 flex flex-col relative min-h-0">
                    <div className="bg-green-900/20 p-1 font-bold text-green-400 border-b border-green-900 shrink-0">
                        ANALYSIS_WORKBENCH
                    </div>
                    
                    <div className="flex-1 p-4 flex flex-col items-center justify-center min-h-0 overflow-y-auto">
                        {selectedIntel ? (
                            <div className="w-full h-full flex flex-col">
                                <div className="flex-1 border border-green-800 p-4 mb-4 bg-black overflow-y-auto">
                                    <h3 className="text-sm font-bold text-green-500 border-b border-green-800 mb-2 pb-1">SUBJECT: {selectedIntel.type} INTERCEPT</h3>
                                    <p className="text-lg text-green-100 mb-4 font-bold">{selectedIntel.content}</p>
                                    
                                    <div className="text-green-600 text-xs mt-auto">
                                        <p>ORIGIN: [REDACTED]</p>
                                        <p>SIGNAL_STRENGTH: 98%</p>
                                        <p>ENCRYPTION: NONE</p>
                                        <p>ID_TAG: {selectedIntel.id}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 h-16 shrink-0">
                                    <button 
                                        onClick={() => handleAnalyze(selectedIntel, 'DISCARD')}
                                        className="border border-green-700 hover:bg-green-900/50 flex items-center justify-center gap-2 text-green-500 transition-all hover:text-green-300 hover:border-green-400"
                                    >
                                        <CheckCircle size={16} />
                                        <span>MARK AS NOISE</span>
                                    </button>
                                    <button 
                                        onClick={() => handleAnalyze(selectedIntel, 'FLAG')}
                                        className="border border-red-700 hover:bg-red-900/50 flex items-center justify-center gap-2 text-red-500 transition-all hover:text-red-300 hover:border-red-400 animate-pulse"
                                    >
                                        <Crosshair size={16} />
                                        <span>FLAG AS THREAT</span>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-green-800">
                                <FileText size={48} className="mx-auto mb-2 opacity-20" />
                                <p>SELECT DATA FROM FEED FOR ANALYSIS</p>
                                {incomingFeed.length === 0 && <p className="text-[10px] mt-2">WAITING FOR DATA...</p>}
                            </div>
                        )}
                    </div>
                </div>

                {/* COLUMN 3: OUTGOING REPORTS & STATUS */}
                <div className="border border-green-900 bg-black/40 flex flex-col min-h-0">
                    <div className="bg-green-900/20 p-1 font-bold text-green-400 border-b border-green-900 shrink-0">
                        COMMAND_UPLINK
                    </div>
                    
                    {/* DEFCON STATUS */}
                    <div className="p-4 border-b border-green-900 bg-black/60 text-center shrink-0">
                        <div className="text-[10px] text-green-600 mb-1">CURRENT READINESS CONDITION</div>
                        <div className={`text-4xl font-bold mb-1 transition-colors duration-500
                             ${defcon === 1 ? 'text-red-600 animate-pulse' : 
                               defcon === 2 ? 'text-orange-500' : 
                               defcon === 3 ? 'text-yellow-500' : 
                               defcon === 4 ? 'text-green-500' : 'text-blue-500'}`}>
                            DEFCON {defcon}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-2 font-mono text-[10px] space-y-1 bg-black/20">
                        {reports.length === 0 && <div className="text-green-900 italic">LOG EMPTY. READY FOR INPUT.</div>}
                        {reports.map((rpt, i) => (
                            <div key={i} className={`border-l-2 pl-2 py-1 ${rpt.includes('FAILURE') ? 'border-red-500 text-red-400' : 'border-green-500 text-green-400'}`}>
                                {rpt}
                            </div>
                        ))}
                    </div>

                    <div className="p-2 border-t border-green-900 text-center shrink-0">
                        <button 
                            onClick={handleTransmit}
                            disabled={reports.length === 0}
                            className={`w-full py-2 text-xs flex items-center justify-center gap-2 border transition-all font-bold
                                ${reports.length > 0 
                                    ? 'border-green-500 text-black bg-green-600 hover:bg-green-500 cursor-pointer shadow-[0_0_10px_rgba(0,255,0,0.3)]' 
                                    : 'border-green-900 text-green-900 bg-transparent cursor-not-allowed opacity-50'
                                }
                            `}
                        >
                            <Server size={14} /> 
                            {reports.length > 0 ? "TRANSMIT BATCH TO HQ" : "AWAITING REPORTS..."}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};
