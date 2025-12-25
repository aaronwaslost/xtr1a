export interface DeviceInfo {
  modelName: string;
  modelIdentifier: string;
  serialNumber: string;
  imei: string;
  udid: string;
  batteryLevel: number;
  capacity: string;
  iosVersion: string;
  activationState: 'Activated' | 'FactoryActivationRequired' | 'Unactivated';
  cpuArchitecture: string;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export enum ConnectionStatus {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  ERROR = 'ERROR'
}