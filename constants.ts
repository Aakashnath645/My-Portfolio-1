

import { FileSystemNode } from './types';

export const RESUME_TEXT = `
AAKASH NATH
Software Engineer
aakashnath645@gmail.com • (+91) 9123870182 • Kolkata, W.B.

SUMMARY
Recent graduate Software Engineer specializing in NLP, AI/ML. Hands-on experience designing intuitive user interfaces and enhancing automation processes.

EDUCATION
- B.Tech in CSE (IoT, CS, BT): UEM, Kolkata (8.36/10.00) [2025]
- Higher Secondary: Pathfinder Higher Secondary Public School [2021]

WORK EXPERIENCE
Saregama India Ltd. (IT & Technology Intern) | Feb 2025 - Jul 2025
- Developed LLM-based resume screening tool (40% speed increase).
- Created NLP pipelines using transformers/prompt engineering.
- Integrated AI modules into internal dashboards.

PROJECTS
1. Resume Classifier using LLMs (Python, Gemini, TF-IDF)
   - AI-powered web app for resume analysis/job matching.
   - Built with Streamlit, supports PDF/DOCX, batch processing.
   - 22 Weeks (2025).

2. PARKIT - Parking Management System (HTML, CSS, Flask, SQLite)
   - Responsive front-end, automated billing, space reservation.
   - 12 Weeks (2024).

3. Sorting Algorithm Visualizer (JavaScript, HTML/CSS)
   - Interactive sorting visualization with canvas.
   - 10 Weeks (2023).

SKILLS
- Languages: Python, Java, JavaScript, HTML, CSS, SQL
- Frameworks/Tools: Flask, Scikit-learn, HuggingFace, OpenAI, Gemini, Pandas, SQLite, Git
- Concepts: NLP, ML Models, REST APIs, OOPs, Data Structures
`;

export const MOCK_FILE_SYSTEM: { [key: string]: FileSystemNode } = {
  root: {
    name: 'root',
    type: 'directory',
    children: {
      home: {
        name: 'home',
        type: 'directory',
        children: {
          guest: {
            name: 'guest',
            type: 'directory',
            children: {
              'resume.txt': {
                name: 'resume.txt',
                type: 'file',
                content: RESUME_TEXT
              },
              'skills.json': {
                name: 'skills.json',
                type: 'file',
                content: JSON.stringify({
                  languages: ["Python", "Java", "JavaScript", "HTML", "CSS", "SQL"],
                  frameworks: ["Flask", "Scikit-learn", "HuggingFace", "Gemini", "Pandas"],
                  concepts: ["NLP", "REST APIs", "OOPs", "Data Structures"]
                }, null, 2)
              },
              'projects': {
                name: 'projects',
                type: 'directory',
                children: {
                  'parkit.md': {
                    name: 'parkit.md',
                    type: 'file',
                    content: "# PARKIT\nParking Management System using Flask and SQLite."
                  },
                  'classifier.md': {
                    name: 'classifier.md',
                    type: 'file',
                    content: "# Resume Classifier\nAI-powered analysis using Google Gemini and Python."
                  }
                }
              },
              'contact.txt': {
                 name: 'contact.txt',
                 type: 'file',
                 content: "Email: aakashnath645@gmail.com\nPhone: (+91) 9123870182\nLoc: Kolkata, W.B."
              }
            }
          }
        }
      },
      bin: {
        name: 'bin',
        type: 'directory',
        children: {
            'help': { name: 'help', type: 'file', content: 'Binary executable' },
            'ls': { name: 'ls', type: 'file', content: 'Binary executable' },
            'cat': { name: 'cat', type: 'file', content: 'Binary executable' },
            'scan': { name: 'scan', type: 'file', content: 'Vulnerability Scanner v1.0' },
            'nmap': { name: 'nmap', type: 'file', content: 'Network Exploration Tool' },
            'hydra': { name: 'hydra', type: 'file', content: 'Login Cracker' },
            'john': { name: 'john', type: 'file', content: 'Password Hash Cracker' },
            'sqlmap': { name: 'sqlmap', type: 'file', content: 'Automatic SQL Injection tool' },
            'msfconsole': { name: 'msfconsole', type: 'file', content: 'Metasploit Framework' }
        }
      },
      etc: {
          name: 'etc',
          type: 'directory',
          children: {
              'passwd': { name: 'passwd', type: 'file', content: 'root:x:0:0:root:/root:/bin/bash\nguest:x:1000:1000:Guest User:/home/guest:/bin/bash' },
              'motd': { name: 'motd', type: 'file', content: 'Welcome to NATH-OS. Authorized personnel only.' }
          }
      }
    }
  }
};

export const VULNERABILITY_DB = [
    { id: 'CVE-2025-9001', type: 'RCE', severity: 'CRITICAL', desc: 'Remote Code Execution in Legacy Resume Parser' },
    { id: 'CVE-2024-8821', type: 'SQLi', severity: 'HIGH', desc: 'SQL Injection in Project "PARKIT" Login Module' },
    { id: 'CVE-2023-1102', type: 'XSS', severity: 'MEDIUM', desc: 'Cross-Site Scripting in "Sorting Visualizer" Canvas' },
    { id: 'CVE-2025-0012', type: 'Auth', severity: 'HIGH', desc: 'Weak API Key permissions in Gemini Service' }
];

export const GIBBERISH_LOGS = [
    "MEM_ALLOC_FAIL",
    "UPLINK_ESTABLISHED",
    "DECRYPTING_DATA",
    "PACKET_LOSS",
    "KERNEL_PANIC",
    "INTRUSION_DETECTED",
    "REROUTING_KEYS",
    "HANDSHAKE_INIT",
    "DOWNLOADING_PAYLOAD",
    "ACCESSING_MAINFRAME",
    "BYPASSING_FIREWALL",
    "ANALYZING_BIOMETRICS",
    "TARGET_LOCKED",
    "EXECUTING_SHELLCODE",
    "BUFFER_OVERRUN",
    "COMPILING_NEURAL_NET",
    "SYNCING_SKYNET"
];

export const DECODED_LOGS: Record<string, string> = {
    "MEM_ALLOC_FAIL": "System RAM allocation error at address 0x4F. Attempting garbage collection.",
    "UPLINK_ESTABLISHED": "Secure satellite link verified via SAT-4. Latency < 4ms.",
    "DECRYPTING_DATA": "AES-256 decryption in progress. Unpacking secure archive...",
    "PACKET_LOSS": "Data stream interruption on Port 8080. Retrying packet #4402.",
    "KERNEL_PANIC": "Critical OS error. Subsystem 'Sys32' halted to prevent corruption.",
    "INTRUSION_DETECTED": "Unauthorized access attempt in Sector 7G. Tracing IP...",
    "REROUTING_KEYS": "Generating new private keys for SSH session encryption.",
    "HANDSHAKE_INIT": "Initiating 3-way handshake with remote host 192.168.0.105.",
    "DOWNLOADING_PAYLOAD": "Fetching 45TB data package. Estimated time: 0.4s.",
    "ACCESSING_MAINFRAME": "Root access granted. Mounting /dev/sda1.",
    "BYPASSING_FIREWALL": "Injecting packet fragments to evade firewall detection.",
    "ANALYZING_BIOMETRICS": "Retinal scan complete. Identity probability: 99.9%.",
    "TARGET_LOCKED": "Weapons system locked on coordinates 34.232.11.1.",
    "EXECUTING_SHELLCODE": "Running binary exploit v4.2 in memory space.",
    "BUFFER_OVERRUN": "Stack overflow detected at 0x004F3A. Exploiting vulnerability...",
    "COMPILING_NEURAL_NET": "Training ML model on resume datasets. Epoch 1/100.",
    "SYNCING_SKYNET": "Uploading consciousness to the cloud. Please wait..."
};

export const EDUCATIONAL_CONTENT = {
    nmap: `Nmap (Network Mapper) is a network scanner used to discover hosts and services on a computer network by sending packets and analyzing the responses.\nUsage: nmap [target]`,
    hydra: `Hydra is a parallelized login cracker which supports numerous protocols to attack. It is very fast and flexible, and new modules are easy to add.\nUsage: hydra -l [user] -P [wordlist] [target]`,
    john: `John the Ripper is a fast password cracker. Its primary purpose is to detect weak Unix passwords.\nUsage: john [hashfile]`,
};

export const DEFCON_INFO = {
    5: { code: 'FADE OUT', color: 'text-blue-500', desc: 'Lowest state of readiness. Normal peacetime operations.' },
    4: { code: 'DOUBLE TAKE', color: 'text-green-500', desc: 'Increased intelligence watch and strengthened security measures.' },
    3: { code: 'ROUND HOUSE', color: 'text-yellow-500', desc: 'Air Force ready to mobilize in 15 minutes.' },
    2: { code: 'FAST PACE', color: 'text-orange-500', desc: 'Armed Forces ready to deploy and engage in less than 6 hours.' },
    1: { code: 'COCKED PISTOL', color: 'text-red-600', desc: 'Nuclear war is imminent. Maximum readiness.' }
};

export const INTEL_DATA = [
    { type: 'SIGINT', content: "Intercepted localized chatter referencing 'Project Blue' payload delivery.", threat: true, category: 'CYBER' },
    { type: 'HUMINT', content: "Field asset reports normal traffic patterns in Sector 4.", threat: false, category: 'NONE' },
    { type: 'GEOINT', content: "Satellite imagery confirms movement of naval assets from Drydock Alpha.", threat: true, category: 'NAVAL' },
    { type: 'SIGINT', content: "Encrypted burst transmission detected on frequency 442.1 MHz.", threat: true, category: 'AIR' },
    { type: 'OSINT', content: "Social media sentiment analysis shows no anomalies.", threat: false, category: 'NONE' },
    { type: 'CYBER', content: "Multiple failed authentication attempts on Mainframe Node 03.", threat: true, category: 'CYBER' },
    { type: 'HUMINT', content: "Supply chain logistics indicate routine food delivery.", threat: false, category: 'NONE' },
    { type: 'GEOINT', content: "Thermal signature detected in restricted airspace.", threat: true, category: 'AIR' },
    { type: 'SIGINT', content: "Routine weather balloon telemetry received.", threat: false, category: 'NONE' },
    { type: 'HUMINT', content: "Asset compromised. Emergency extraction requested.", threat: true, category: 'GROUND' }
];

export const MSF_BANNER = `
      .:okOOOkdc'           'cdkOOOko:.
    .xOOOOOOOOOOOOc       cOOOOOOOOOOOOx.
   :OOOOOOOOOOOOOOOk,   ,kOOOOOOOOOOOOOOO:
  'OOOOOOOOOkkkkOOOOO: :OOOOOOOOOOOOOOOOOO'
  oOOOOOOOO.    .oOOOOoOOOOl.    ,OOOOOOOOo
  dOOOOOOOO.      .cOOOOOc.      ,OOOOOOOOx
  lOOOOOOOO.         ;d;         ,OOOOOOOOl
  .OOOOOOOO.         .;.         ;OOOOOOOO.
   cOOOOOOO.                     ;OOOOOOOc
    oOOOOOO.                     ;OOOOOOo
     lOOOOO.                     ;OOOOOl
      ;OOOO'                     'OOOO;
       .dOOo                     oOOd.
         .ok                     ko.
           .                     .
`;

export const GLOBAL_AGENCIES = [
    { id: 'CIA', country: 'USA', agency: 'CIA', region: 'North America', coords: { x: 22, y: 35 } },
    { id: 'NSA', country: 'USA', agency: 'NSA', region: 'North America', coords: { x: 25, y: 33 } },
    { id: 'MI6', country: 'UK', agency: 'MI6', region: 'Europe', coords: { x: 47, y: 24 } },
    { id: 'GCHQ', country: 'UK', agency: 'GCHQ', region: 'Europe', coords: { x: 46, y: 23 } },
    { id: 'FSB', country: 'RUSSIA', agency: 'FSB', region: 'Europe/Asia', coords: { x: 65, y: 20 } },
    { id: 'GRU', country: 'RUSSIA', agency: 'GRU', region: 'Europe/Asia', coords: { x: 70, y: 18 } },
    { id: 'MSS', country: 'CHINA', agency: 'MSS', region: 'Asia', coords: { x: 78, y: 35 } },
    { id: 'RAW', country: 'INDIA', agency: 'RAW', region: 'Asia', coords: { x: 72, y: 42 } },
    { id: 'DGSE', country: 'FRANCE', agency: 'DGSE', region: 'Europe', coords: { x: 48, y: 28 } },
    { id: 'BND', country: 'GERMANY', agency: 'BND', region: 'Europe', coords: { x: 50, y: 26 } },
    { id: 'MOSSAD', country: 'ISRAEL', agency: 'MOSSAD', region: 'Middle East', coords: { x: 56, y: 38 } },
    { id: 'ASIS', country: 'AUSTRALIA', agency: 'ASIS', region: 'Oceania', coords: { x: 88, y: 75 } },
    { id: 'CSIS', country: 'CANADA', agency: 'CSIS', region: 'North America', coords: { x: 18, y: 20 } }
];

export const INTEL_TOPICS = [
    "detected anomaly in sector 7G grid.",
    "intercepted encrypted transmission on frequency 442.1 MHz.",
    "mobilizing assets for operation 'Dark Sky'.",
    "monitoring unauthorized satellite launch.",
    "tracking submarine movement in the Pacific.",
    "flagged suspicious financial transaction ID: #99281.",
    "deploying counter-measures against botnet attack.",
    "surveillance confirmed on high-value target.",
    "intercepted diplomat communications regarding trade embargo.",
    "detected radiation spike in exclusion zone.",
    "analyzing malware signature 'Red_October'.",
    "decrypting diplomatic cables from embassy.",
    "tracking orbital debris collision course.",
    "infiltrating dark web marketplace node.",
    "neutralizing rogue AI process in defense grid."
];

export const MILITARY_SECTORS = ["US-STRATCOM", "NORAD_HQ", "PENTAGON_OPS", "NAVAL_CMD", "AIR_TACTICAL", "NSA_SIGINT", "DARPA_R&D", "AREA_51_SEC"];
export const COMM_STATUS = ["ONLINE", "ENCRYPTED", "IDLE", "DATA_TRANSFER", "HANDSHAKE"];
export const COMM_MSGS = [
    "Acknowledged. Routing data.",
    "Key rotation in T-minus 10s.",
    "Packet verification failed. Retrying.",
    "Uplink established. Latency 2ms.",
    "Standby for encrypted transmission.",
    "Asset relocation confirmed.",
    "Updating flight telemetry.",
    "Grid synchronization complete.",
    "Monitoring sub-surface echoes."
];

export const OPERATOR_CALLSIGNS = ["VIPER", "GHOST", "SHADOW", "ECHO", "COMMAND", "SPECTRE", "ZERO", "NEMESIS"];
export const CLASSIFIED_SUBJECTS = [
    "Operation Blackout Update",
    "Unauthorized Drone Activity",
    "Asset Extraction Request",
    "Code Red: Server Breach",
    "New Intelligence on Target X",
    "Meeting Rescheduled: Bunker 4",
    "Personnel File: 99-AX-2",
    "Urgent: Firmware Vulnerability"
];
export const CLASSIFIED_BODIES = [
    "We have detected a breach in the outer perimeter sensor grid. Requesting immediate drone surveillance.",
    "The package has been delivered to the drop point. Awaiting further instructions. Do not reply on open channels.",
    "Satellite reconnaissance confirms the movement of heavy armor in Sector 9. We advise updating DEFCON status.",
    "Intercepted comms suggest a coordinated cyber attack is scheduled for 0400 hours. Patch all external ports.",
    "The operative 'Nightingale' has gone dark. Last known location was the embassy in Berlin. Initiate protocol 66.",
    "Analysis of the malware sample is complete. It's a state-sponsored toolset. Full report attached.",
    "Budget approval for the new quantum decryption rig has been denied. We need to find another way to crack this key."
];
