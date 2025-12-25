import { DeviceInfo, ConnectionStatus } from '../types';

const MOCK_DEVICE: DeviceInfo = {
  modelName: "iPhone XS Max",
  modelIdentifier: "iPhone11,6",
  serialNumber: "F2LXV19JKPHL",
  imei: "358492091203941",
  udid: "00008020-001E598C0282002E",
  batteryLevel: 84,
  capacity: "256 GB",
  iosVersion: "15.4.1",
  activationState: "FactoryActivationRequired",
  cpuArchitecture: "arm64e (A12)"
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const simulateConnection = async (): Promise<DeviceInfo> => {
  await sleep(1500); // Simulate USB handshake
  if (Math.random() > 0.9) {
    throw new Error("No device found. Please ensure USB connection.");
  }
  return MOCK_DEVICE;
};

export const generateBypassLogs = async (
  addLog: (msg: string, type?: 'info' | 'success' | 'warning' | 'error') => void
) => {
  addLog("Initializing Activator module...", "info");
  await sleep(800);
  addLog("Loaded module: Xtr1a_Utils/Core", "info");
  await sleep(600);
  addLog("Connecting to device via USB mux...", "info");
  await sleep(1000);
  addLog("Device detected: iPhone11,6 (iPhone XS Max)", "success");
  addLog("Checking Activation Lock status...", "info");
  await sleep(1200);
  addLog("Status: LOCKED. Attempting exploit chain...", "warning");
  await sleep(1500);
  addLog("[Exploit] Sending malformed packet to mobileactivationd...", "info");
  await sleep(2000);
  addLog("[Exploit] SQLite3 injection successful at 0x41414141", "info");
  await sleep(1000);
  addLog("Bypassing AL...", "info");
  await sleep(2000);
  addLog("Respringing device...", "warning");
  await sleep(3000);
  addLog("Bypass Complete! Device should now be usable.", "success");
};