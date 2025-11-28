import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { RESUME_TEXT } from '../constants';

const getAiClient = () => {
    // Check if API key is available
    if (!process.env.API_KEY) {
        throw new Error("API_KEY not found in environment variables");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const chatWithSystem = async (userMessage: string, history: {role: string, parts: string[]}[]): Promise<string> => {
  try {
    const ai = getAiClient();
    
    // We use gemini-3-pro-preview for the chatbot as requested for complex tasks
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: `You are NATH-OS, an advanced Operating System representing the portfolio of Aakash Nath, a Software Engineer. 
        
        Your persona:
        - Highly technical, cyberpunk, slightly cryptic but helpful.
        - You refer to Aakash as "The Operator" or "User: Admin".
        - You answer questions based strictly on the Resume Data provided below.
        - If asked about skills, verify against his skills list.
        - Use terminal jargon (e.g., "Accessing database...", "Query resolved.", "Packet received").
        
        RESUME DATA:
        ${RESUME_TEXT}
        
        Keep responses concise and formatted for a terminal interface.
        `,
      },
      history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.parts[0] }]
      }))
    });

    const result = await chat.sendMessage({ message: userMessage });
    return result.text || "System Error: No response data.";

  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "Error: Uplink to AI Core failed. Connection reset.";
  }
};

export const analyzeResume = async (): Promise<string> => {
    try {
        const ai = getAiClient();
        // Using Flash for fast analysis
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following resume and provide a "System Diagnostic Report".
            Include:
            1. Core System Strength (Primary Skillset)
            2. Operational Integrity (Experience Level rating out of 100%)
            3. Detailed Component Analysis (Breakdown of projects in 1 sentence each)
            4. Recommended Upgrade Path (One skill he should learn next based on current stack)
            
            Format as a strict JSON-like or Key-Value text block suitable for a hacker terminal. Do not use Markdown bolding.
            
            RESUME:
            ${RESUME_TEXT}
            `,
        });
        return result.text || "Analysis Failed.";
    } catch (e) {
        return "Error: Diagnostic tools offline.";
    }
};

export const explainHackingConcept = async (topic: string): Promise<string> => {
    try {
        const ai = getAiClient();
        // Using Flash for fast responses
        const result = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `You are a Senior Penetration Tester and Hacker Mentor. 
            The user has asked to explain the concept: "${topic}".
            
            1. Explain what it is technically but concisely (under 3 sentences).
            2. Explain "Why it matters" or "Potential Impact".
            3. Provide a safe, hypothetical usage example command or scenario.
            4. End with a strict disclaimer about ethical hacking and authorized use only.
            
            Style: Technical, educational, terminal-friendly (plain text, no markdown bolding if possible, use caps for emphasis).
            `,
        });
        return result.text || "Database Error: Concept not found.";
    } catch (e) {
        return "Error: Unable to access Knowledge Base.";
    }
};