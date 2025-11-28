export interface FileSystemNode {
  name: string;
  type: 'file' | 'directory';
  content?: string;
  children?: { [key: string]: FileSystemNode };
}

export interface WindowState {
  id: string;
  title: string;
  isOpen: boolean;
  isMinimized: boolean;
  content: React.ReactNode;
  zIndex: number;
  type: 'terminal' | 'browser' | 'editor' | 'system';
}

export interface CommandHistory {
  command: string;
  output: React.ReactNode;
}

export enum BootStep {
  BIOS = 0,
  KERNEL = 1,
  SYSTEM_CHECK = 2,
  LOGIN = 3,
  COMPLETE = 4
}

export type LoginStatus = 'idle' | 'processing' | 'success' | 'failed' | 'locked';