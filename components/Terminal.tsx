import React, { useState, useEffect, useRef } from 'react';
import { MOCK_FILE_SYSTEM, VULNERABILITY_DB, EDUCATIONAL_CONTENT, MSF_BANNER } from '../constants';
import { FileSystemNode } from '../types';
import { analyzeResume, explainHackingConcept } from '../services/geminiService';

const deepClone = (obj: any) => JSON.parse(JSON.stringify(obj));

const Terminal: React.FC = () => {
  const [input, setInput] = useState('');
  const [fileSystem, setFileSystem] = useState<{ [key: string]: FileSystemNode }>(deepClone(MOCK_FILE_SYSTEM));
  const [history, setHistory] = useState<{ cmd: string; out: string | React.ReactNode }[]>([
    { cmd: '', out: 'US-CYBERCOM TERMINAL ACCESS [UNCLASSIFIED]' },
    { cmd: '', out: 'Type "help" for command list or "training" for learning modules.' }
  ]);
  const [currentPath, setCurrentPath] = useState<string[]>(['root', 'home', 'guest']);
  const [isProcessing, setIsProcessing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const getDir = (path: string[], fs = fileSystem): FileSystemNode | null => {
    let current: FileSystemNode = fs.root;
    for (let i = 1; i < path.length; i++) {
        if (current.children && current.children[path[i]]) {
            current = current.children[path[i]];
        } else {
            return null;
        }
    }
    return current;
  };

  const resolvePath = (targetPathStr: string): string[] | null => {
      let parts = targetPathStr.split('/').filter(p => p.length > 0);
      let newPath: string[] = [];
      if (targetPathStr.startsWith('/')) {
         newPath = ['root', ...parts];
      } else {
         newPath = [...currentPath];
         for (const part of parts) {
             if (part === '.') continue;
             if (part === '..') {
                 if (newPath.length > 1) newPath.pop();
             } else {
                 newPath.push(part);
             }
         }
      }
      let current = fileSystem.root;
      if (newPath[0] !== 'root') return null;
      for (let i = 1; i < newPath.length; i++) {
          if (current.children && current.children[newPath[i]]) {
              current = current.children[newPath[i]];
          } else {
              return null;
          }
      }
      return newPath;
  };

  const executeSingleCommand = async (cmdString: string): Promise<string | React.ReactNode> => {
      const args = cmdString.trim().split(/\s+/);
      const command = args[0].toLowerCase();
      const arg1 = args[1];
      const arg2 = args[2];
      
      switch (command) {
        case 'help':
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-green-300 border border-green-900 p-2 mt-2 bg-green-900/10">
              <div>
                  <div className="font-bold text-green-500 border-b border-green-800 mb-1">:: SYSTEM ::</div>
                  <div className="flex justify-between"><span>ls [-l]</span><span className="text-gray-500">List files</span></div>
                  <div className="flex justify-between"><span>cd [dir]</span><span className="text-gray-500">Change directory</span></div>
                  <div className="flex justify-between"><span>cat [file]</span><span className="text-gray-500">Read file</span></div>
                  <div className="flex justify-between"><span>analyze</span><span className="text-gray-500">AI Resume Audit</span></div>
                  <div className="flex justify-between"><span>clear</span><span className="text-gray-500">Clear Screen</span></div>
              </div>
              <div>
                  <div className="font-bold text-green-500 border-b border-green-800 mb-1">:: NETWORKING ::</div>
                  <div className="flex justify-between"><span>nmap [ip]</span><span className="text-gray-500">Port Scanner</span></div>
                  <div className="flex justify-between"><span>scan [ip]</span><span className="text-gray-500">Vuln Scanner</span></div>
                  <div className="flex justify-between"><span>whois [dom]</span><span className="text-gray-500">Domain Recon</span></div>
              </div>
              <div className="col-span-1 md:col-span-2">
                  <div className="font-bold text-yellow-500 border-b border-yellow-800 mb-1">:: PENTESTING & EDUCATION ::</div>
                  <div className="flex justify-between"><span>explain [topic]</span><span className="text-gray-500">AI Tutor (e.g. 'explain xss')</span></div>
                  <div className="flex justify-between"><span>sqlmap [url]</span><span className="text-gray-500">SQL Injection Sim</span></div>
                  <div className="flex justify-between"><span>hydra [usr] [targ]</span><span className="text-gray-500">Brute Force Sim</span></div>
                  <div className="flex justify-between"><span>msfconsole</span><span className="text-gray-500">Metasploit Sim</span></div>
                  <div className="flex justify-between"><span>setoolkit</span><span className="text-gray-500">Social Eng. Tool Sim</span></div>
              </div>
            </div>
          );

        case 'training':
             return (
                 <div className="text-green-300 mt-2">
                     <div className="text-yellow-500 font-bold mb-2">:: AVAILABLE TRAINING MODULES ::</div>
                     <ul className="list-disc pl-5 space-y-1">
                         <li><span className="text-white font-bold">Concept Learning:</span> Type <code>explain [topic]</code> (e.g., <code>explain phishing</code>, <code>explain buffer overflow</code>).</li>
                         <li><span className="text-white font-bold">Network Recon:</span> Type <code>nmap 192.168.1.1</code> to practice port scanning.</li>
                         <li><span className="text-white font-bold">Web Exploitation:</span> Type <code>sqlmap -u http://target.com/id=1</code> to simulate database injection.</li>
                         <li><span className="text-white font-bold">Frameworks:</span> Type <code>msfconsole</code> to initialize Metasploit environment.</li>
                     </ul>
                 </div>
             );

        case 'ls':
          const dirNode = getDir(currentPath);
          if (dirNode && dirNode.children) {
             return (
                 <div className="flex flex-wrap gap-4 text-sm mt-1">
                     {Object.entries(dirNode.children).map(([name, node]) => (
                         <span key={name} className={node.type === 'directory' ? 'text-blue-400 font-bold' : 'text-green-200'}>
                             {name}{node.type === 'directory' ? '/' : ''}
                         </span>
                     ))}
                 </div>
             );
          }
          return "Directory is empty.";

        case 'cd':
            if (!arg1) return "usage: cd [directory]";
            const target = resolvePath(arg1);
            if (target) {
                const node = getDir(target);
                if (node && node.type === 'directory') {
                    setCurrentPath(target);
                    return '';
                } 
                return `cd: not a directory: ${arg1}`;
            }
            return `cd: no such file or directory: ${arg1}`;

        case 'cat':
            if (!arg1) return "usage: cat [file]";
            const fileNode = getDir(currentPath);
            if (fileNode && fileNode.children && fileNode.children[arg1]) {
                const targetFile = fileNode.children[arg1];
                if (targetFile.type === 'directory') return `cat: ${arg1}: Is a directory`;
                return <pre className="whitespace-pre-wrap font-mono text-xs text-green-300 mt-1 border-l-2 border-green-700 pl-2">{targetFile.content}</pre>;
            }
            return `cat: ${arg1}: No such file or directory`;

        case 'scan':
            return await runVulnerabilityScanner(arg1 || '192.168.1.X');

        case 'explain':
            if (!arg1) return "usage: explain [concept] (e.g. 'explain sql injection')";
            const query = args.slice(1).join(' ');
            return (
                <div className="mt-2">
                     <div className="text-yellow-500 text-xs mb-1">CONNECTING TO KNOWLEDGE BASE...</div>
                     <AIExplanation topic={query} />
                </div>
            );

        case 'nmap':
        case 'hydra':
        case 'john':
            // Educational simulation
            return <ToolSimulation tool={command} target={arg1} />;

        case 'sqlmap':
            return <SqlMapSimulation url={arg1 || 'http://testphp.vulnweb.com/artists.php?artist=1'} />;

        case 'msfconsole':
            return <MsfConsoleSimulation />;

        case 'setoolkit':
            return <SetoolkitSimulation />;

        case 'analyze':
            try {
                const analysis = await analyzeResume();
                return (
                    <div className="border border-green-800 p-2 bg-green-900/20 mt-2">
                        <div className="text-yellow-400 font-bold mb-1">:: AI SYSTEM DIAGNOSTIC ::</div>
                        <pre className="whitespace-pre-wrap text-xs font-mono text-green-200">{analysis}</pre>
                    </div>
                );
            } catch (err) {
                return "Analysis Failed.";
            }

        default:
             return `ERR: Command not recognized: ${command}`;
      }
  };

  const runVulnerabilityScanner = async (target: string): Promise<React.ReactNode> => {
    return new Promise(resolve => {
        resolve(<ScannerDisplay target={target} />);
    });
  };

  const handleCommand = async (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const rawInput = input.trim();
      if (!rawInput) return;
      
      const commands = rawInput.split(/&&|;/); 
      
      setHistory(prev => [...prev, { 
          cmd: `[guest@US-CYBERCOM] ${currentPath[currentPath.length - 1]}$ ${rawInput}`, 
          out: '' 
      }]);
      setInput('');
      setIsProcessing(true);

      for (const cmd of commands) {
          if (cmd.trim() === 'clear') {
              setHistory([]);
              continue;
          }
          const output = await executeSingleCommand(cmd.trim());
          if (output) {
               setHistory(prev => {
                   const newHist = [...prev];
                   const lastEntry = newHist[newHist.length - 1];
                   lastEntry.out = output; 
                   return newHist;
               });
          }
      }
      setIsProcessing(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col font-mono text-sm bg-transparent" onClick={() => document.getElementById('term-input')?.focus()}>
      <div className="flex-1 overflow-y-auto p-4 space-y-3" ref={scrollRef}>
        {history.map((entry, i) => (
          <div key={i} className="break-words">
            {entry.cmd && <div className="text-green-600 font-bold">{entry.cmd}</div>}
            <div className="pl-0">{entry.out}</div>
          </div>
        ))}
        {isProcessing && <div className="animate-pulse pl-2 text-yellow-500">PROCESSING...</div>}
      </div>
      <div className="p-2 border-t border-green-800 flex items-center bg-black/50">
        <span className="text-green-500 font-bold mr-2 shrink-0">[guest@US-CYBERCOM] $</span>
        <input
          id="term-input"
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleCommand}
          disabled={isProcessing}
          className="flex-1 bg-transparent border-none outline-none text-green-100 font-bold caret-green-500"
          autoComplete="off"
        />
      </div>
    </div>
  );
};

// --- Sub-Components for Simulations ---

const AIExplanation: React.FC<{ topic: string }> = ({ topic }) => {
    const [text, setText] = useState('Querying AI Mentor...');
    
    useEffect(() => {
        explainHackingConcept(topic).then(setText);
    }, [topic]);

    return (
        <div className="border border-yellow-700 bg-yellow-900/10 p-2 text-green-300 whitespace-pre-wrap">
            {text}
        </div>
    );
};

const ToolSimulation: React.FC<{ tool: string, target?: string }> = ({ tool, target }) => {
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
        let l: string[] = [`Starting ${tool} at ${new Date().toLocaleTimeString()}...`];
        setLines(l);
        
        // Simulating some output
        const output = [
            `Initiating parallel threads...`,
            `Target ${target || 'localhost'} resolved to 127.0.0.1`,
            `Sending SYN packets...`,
            `Port 22 (SSH) open`,
            `Port 80 (HTTP) open`,
            `Service scan complete.`
        ];
        
        output.forEach((line, i) => {
            setTimeout(() => setLines(prev => [...prev, line]), (i + 1) * 500);
        });

    }, []);

    return (
        <div className="mt-2 text-xs text-gray-400 border border-gray-700 p-2">
            {lines.map((l, i) => <div key={i}>{l}</div>)}
            <div className="mt-2 text-green-500 border-t border-gray-700 pt-1">
                INFO: {EDUCATIONAL_CONTENT[tool as keyof typeof EDUCATIONAL_CONTENT]?.split('\n')[0]}
            </div>
        </div>
    );
};

const SqlMapSimulation: React.FC<{ url: string }> = ({ url }) => {
    const [lines, setLines] = useState<string[]>([]);
    
    useEffect(() => {
        const steps = [
            `[*] starting @ ${new Date().toLocaleTimeString()}`,
            `[*] checking connection to the target URL`,
            `[*] testing if the target URL content is stable`,
            `[*] testing for SQL injection on GET parameter 'id'`,
            `[+] GET parameter 'id' is 'MySQL > 5.0.12' time-based blind injectable`,
            `[*] fetching current database`,
            `[*] retrieved: 'legacy_users'`,
            `[*] fetching tables for database: 'legacy_users'`,
            `[+] found 2 tables: 'admin', 'customers'`,
            `[*] dumping table 'admin'...`,
            `[+] admin | $2a$10$Xj... | superuser`,
            `[*] fetched 1 entry`
        ];
        
        setLines([]);
        steps.forEach((line, i) => {
            setTimeout(() => setLines(prev => [...prev, line]), i * 800);
        });
    }, []);

    return (
        <div className="font-mono text-xs mt-2 text-gray-300">
             <div className="text-yellow-500 mb-1">___ sqlmap/1.5.8 ___</div>
             {lines.map((l, i) => (
                 <div key={i} className={l.includes('[+]') ? 'text-green-400 font-bold' : ''}>{l}</div>
             ))}
             {lines.length === 12 && <div className="text-red-500 mt-2">VULNERABILITY CONFIRMED: SQL Injection</div>}
        </div>
    );
};

const MsfConsoleSimulation: React.FC = () => {
    const [ready, setReady] = useState(false);
    
    useEffect(() => {
        setTimeout(() => setReady(true), 2000);
    }, []);

    if (!ready) return <div className="text-blue-400 animate-pulse">Starting the Metasploit Framework console...</div>;

    return (
        <div className="font-mono text-xs mt-2">
            <pre className="text-blue-500 leading-none mb-4 font-bold">{MSF_BANNER}</pre>
            <div className="text-gray-400">
                =[ metasploit v6.1.0-dev                          ]<br/>
                + -- --=[ 2163 exploits - 1147 auxiliary - 367 post       ]<br/>
                + -- --=[ 592 payloads - 45 encoders - 10 nops            ]<br/>
                + -- --=[ 8 evasion                                       ]<br/>
            </div>
            <div className="mt-2 text-white"><span className="text-blue-500 underline">msf6</span> &gt; use exploit/multi/handler</div>
            <div className="text-white"><span className="text-blue-500 underline">msf6</span> exploit(multi/handler) &gt; set PAYLOAD windows/meterpreter/reverse_tcp</div>
            <div className="text-white"><span className="text-blue-500 underline">msf6</span> exploit(multi/handler) &gt; set LHOST 10.0.0.5</div>
            <div className="text-white"><span className="text-blue-500 underline">msf6</span> exploit(multi/handler) &gt; exploit</div>
            <div className="text-blue-300 mt-2">[*] Started reverse TCP handler on 10.0.0.5:4444</div>
            <div className="text-blue-300">[*] Sending stage (175174 bytes) to 192.168.1.104</div>
            <div className="text-green-500 font-bold">[*] Meterpreter session 1 opened (10.0.0.5:4444 -&gt; 192.168.1.104:49211)</div>
        </div>
    );
};

const SetoolkitSimulation: React.FC = () => {
    return (
        <div className="font-mono text-xs mt-2 text-gray-300">
            <div className="text-center border-b border-gray-700 mb-2 pb-2">
                Social-Engineer Toolkit (SET)<br/>
                Created by: David Kennedy (ReL1K)
            </div>
            <div>Select from the menu:</div>
            <div className="pl-4">
                1) Social-Engineering Attacks<br/>
                2) Penetration Testing (Fast-Track)<br/>
                3) Third Party Modules<br/>
                4) Update the Social-Engineer Toolkit<br/>
                5) Update SET configuration<br/>
                99) Exit the Social-Engineer Toolkit
            </div>
            <div className="mt-2">set&gt; <span className="animate-pulse">_</span></div>
        </div>
    );
};

const ScannerDisplay: React.FC<{ target: string }> = ({ target }) => {
    const [progress, setProgress] = useState(0);
    const [stage, setStage] = useState('PORT_SCAN');
    const [done, setDone] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setDone(true);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (progress > 30) setStage('SERVICE_DISCOVERY');
        if (progress > 70) setStage('VULN_MATCHING');
        if (progress === 100) setStage('REPORT_GEN');
    }, [progress]);

    if (!done) {
        return (
            <div className="my-2 border border-green-700 bg-green-900/10 p-2 max-w-md">
                <div className="text-green-500 font-bold mb-1 text-xs">TARGET: {target}</div>
                <div className="flex justify-between text-[10px] mb-1">
                    <span>STATUS: {stage}...</span>
                    <span>{progress}%</span>
                </div>
                <div className="w-full bg-green-900 h-1">
                    <div className="bg-green-500 h-full transition-all" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        );
    }

    return (
        <div className="my-4 border border-red-800 bg-red-900/10 p-4">
             <div className="text-red-500 font-bold text-sm mb-2 border-b border-red-800 pb-1 flex justify-between">
                 <span>VULNERABILITY REPORT</span>
                 <span className="animate-pulse">CRITICAL</span>
             </div>
             
             <table className="w-full text-[10px] text-left">
                 <thead>
                     <tr className="text-red-400 border-b border-red-900/50">
                         <th className="py-1">CVE</th>
                         <th className="py-1">SEVERITY</th>
                         <th className="py-1">DESC</th>
                     </tr>
                 </thead>
                 <tbody>
                     {VULNERABILITY_DB.map((vuln) => (
                         <tr key={vuln.id} className="border-b border-red-900/20 text-gray-400">
                             <td className="py-1 text-red-300">{vuln.id}</td>
                             <td className="py-1 text-red-500 font-bold">{vuln.severity}</td>
                             <td className="py-1">{vuln.desc}</td>
                         </tr>
                     ))}
                 </tbody>
             </table>
        </div>
    );
}

export default Terminal;