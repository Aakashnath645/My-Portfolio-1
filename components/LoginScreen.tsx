import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, AlertTriangle, Fingerprint, ScanEye } from 'lucide-react';
import { LoginStatus } from '../types';

interface LoginScreenProps {
  onComplete: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onComplete }) => {
  const [password, setPassword] = useState('');
  const [totp, setTotp] = useState('');
  const [step, setStep] = useState<'password' | 'totp'>('password');
  const [status, setStatus] = useState<LoginStatus>('idle');
  const [attempts, setAttempts] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const MAX_ATTEMPTS = 3;

  const addLog = (msg: string) => setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 6));

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'locked' || attempts >= MAX_ATTEMPTS) {
        setStatus('locked');
        addLog("SYSTEM LOCKED: INCORRECT CREDENTIALS LIMIT REACHED.");
        return;
    }

    setStatus('processing');
    addLog("INITIATING HANDSHAKE PROTOCOL...");
    
    // Simulate Argon2 Hashing delay
    await new Promise(r => setTimeout(r, 800));
    addLog("HASHING INPUT (ARGON2ID, T=4, M=65536)...");
    await new Promise(r => setTimeout(r, 800));

    // Hardcoded password for demo: "admin" or "guest"
    if (password === 'admin' || password === 'guest') {
        setStatus('success');
        addLog("CREDENTIALS VERIFIED. IDENTITY CONFIRMED.");
        setTimeout(() => {
            setStep('totp');
            setStatus('idle');
            addLog("REQUESTING RSA TOKEN (TOTP)...");
        }, 500);
    } else {
        setStatus('failed');
        setAttempts(prev => prev + 1);
        addLog(`AUTH FAILED. INVALID HASH. ATTEMPTS: ${attempts + 1}/${MAX_ATTEMPTS}`);
        if (attempts + 1 >= MAX_ATTEMPTS) {
            setStatus('locked');
            addLog("SECURITY BREACH DETECTED. LOCKDOWN INITIATED.");
        }
    }
  };

  const handleTotpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('processing');
    addLog("VERIFYING BIOMETRIC SIGNATURE...");
    
    await new Promise(r => setTimeout(r, 1000));

    // Accept any 6 digit code for demo
    if (totp.length === 6) {
        setStatus('success');
        addLog("ACCESS GRANTED. WELCOME, COMMANDER.");
        setTimeout(onComplete, 800);
    } else {
        setStatus('failed');
        addLog("INVALID TOKEN. ACCESS DENIED.");
    }
  };

  return (
    <div className="h-full w-full bg-black text-green-500 font-mono flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Matrix Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://media.giphy.com/media/26tn33aiTi1jkl6H6/giphy.gif')] bg-cover opacity-5"></div>
      
      {/* Reticle Overlay */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-green-600"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-green-600"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-green-600"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-green-600"></div>

      <div className="z-10 w-full max-w-lg border border-green-800 bg-black/90 p-8 shadow-[0_0_50px_rgba(0,255,65,0.1)] relative retro-border">
         
         <div className="flex flex-col items-center mb-8 border-b border-green-900 pb-4">
            <div className="mb-4 relative">
                {status === 'locked' ? (
                    <AlertTriangle size={64} className="text-red-500 animate-pulse" />
                ) : step === 'password' ? (
                    <div className="relative">
                        <Lock size={64} className="text-green-600 opacity-50" />
                        <Fingerprint size={64} className="absolute inset-0 text-green-400 animate-pulse" />
                    </div>
                ) : (
                    <ScanEye size={64} className="text-green-400 animate-pulse" />
                )}
            </div>
            <h1 className="text-3xl font-bold tracking-[0.2em] text-green-100 tech-text">US-CYBERCOM</h1>
            <p className="text-xs text-green-700 font-bold mt-2 tracking-widest">SECURE TERMINAL // AUTHORIZED PERSONNEL ONLY</p>
         </div>

         {status === 'locked' ? (
             <div className="text-red-500 text-center font-bold border border-red-900 bg-red-900/10 p-6 animate-pulse">
                 <h2 className="text-2xl mb-2">ACCESS DENIED</h2>
                 <p className="text-sm">TERMINAL LOCKED. TRACING IP...</p>
             </div>
         ) : (
             <form onSubmit={step === 'password' ? handlePasswordSubmit : handleTotpSubmit} className="space-y-6">
                {step === 'password' ? (
                    <div>
                        <div className="flex justify-between text-xs text-green-600 mb-1">
                            <span>ENTER PASSPHRASE</span>
                            <span>ENCRYPTION: AES-256</span>
                        </div>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-black border border-green-800 text-green-400 p-3 focus:outline-none focus:border-green-400 focus:bg-green-900/10 text-center tracking-widest text-lg transition-all"
                            placeholder="••••••••"
                            autoFocus
                        />
                        <div className="text-[10px] text-gray-600 mt-2 text-center opacity-50">TRY 'admin' OR 'guest'</div>
                    </div>
                ) : (
                    <div>
                         <div className="flex justify-between text-xs text-green-600 mb-1">
                            <span>BIOMETRIC TOKEN</span>
                            <span className="animate-pulse text-red-500">AWAITING INPUT</span>
                        </div>
                         <input 
                            type="text" 
                            value={totp}
                            onChange={(e) => {
                                if (e.target.value.length <= 6 && /^\d*$/.test(e.target.value)) {
                                    setTotp(e.target.value);
                                }
                            }}
                            className="w-full bg-black border border-green-800 text-green-400 p-3 focus:outline-none focus:border-green-400 text-center tracking-[0.8em] text-2xl font-bold"
                            placeholder="000000"
                            autoFocus
                        />
                         <div className="text-[10px] text-green-700 mt-2 text-center">
                             SECURE KEY: 123456
                         </div>
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={status === 'processing'}
                    className={`w-full py-3 uppercase text-sm font-bold tracking-widest transition-all border
                        ${status === 'processing' 
                            ? 'bg-green-900/20 border-green-800 text-green-700 cursor-wait' 
                            : 'bg-green-700 hover:bg-green-600 border-green-600 text-black hover:shadow-[0_0_15px_rgba(0,255,0,0.4)]'
                        }`}
                >
                    {status === 'processing' ? 'PROCESSING...' : 'AUTHENTICATE'}
                </button>
             </form>
         )}
         
         <div className="mt-8 border-t border-dashed border-green-900 pt-2 h-24 overflow-hidden">
            <div className="text-[10px] text-green-800 font-bold mb-1 uppercase">System Log Stream:</div>
            <div className="flex flex-col-reverse">
                {logs.map((log, i) => (
                    <div key={i} className="text-[9px] text-green-700/60 font-mono truncate hover:text-green-500">
                        {log}
                    </div>
                ))}
            </div>
         </div>
      </div>
      
      <div className="absolute bottom-4 text-[10px] text-green-900">
          US GOVERNMENT PROPERTY. UNAUTHORIZED ACCESS IS A FEDERAL OFFENSE.
      </div>
    </div>
  );
};

export default LoginScreen;