import React from 'react';
import { DeviceInfo, ConnectionStatus } from '../types';
import { Smartphone, Battery, Disc, Cpu, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';

interface DeviceStatusProps {
  device: DeviceInfo | null;
  status: ConnectionStatus;
  onRefresh: () => void;
}

export const DeviceStatus: React.FC<DeviceStatusProps> = ({ device, status, onRefresh }) => {
  if (status === ConnectionStatus.DISCONNECTED || status === ConnectionStatus.CONNECTING || status === ConnectionStatus.ERROR) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 border border-gray-800 rounded-xl bg-gray-900/50">
        <div className={`relative mb-6 ${status === ConnectionStatus.CONNECTING ? 'animate-pulse' : ''}`}>
            <Smartphone size={64} className="text-gray-600" />
            {status === ConnectionStatus.ERROR && (
                <div className="absolute -top-1 -right-1 text-red-500 bg-gray-900 rounded-full">
                    <AlertCircle size={24} />
                </div>
            )}
        </div>
        
        <h3 className="text-xl font-bold text-gray-300 mb-2">
            {status === ConnectionStatus.CONNECTING ? 'Searching for Device...' : 'No Device Connected'}
        </h3>
        
        <p className="text-gray-500 text-center text-sm mb-6 max-w-xs">
            {status === ConnectionStatus.ERROR 
                ? 'Failed to connect. Please check your USB cable and try again.' 
                : 'Connect your iOS device via USB and click the Check button.'}
        </p>

        <button
          onClick={onRefresh}
          disabled={status === ConnectionStatus.CONNECTING}
          className={`px-6 py-2 rounded-lg font-medium transition-all ${
            status === ConnectionStatus.CONNECTING
              ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
              : 'bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-500/20'
          }`}
        >
          {status === ConnectionStatus.CONNECTING ? 'Connecting...' : 'Check Device'}
        </button>
      </div>
    );
  }

  // Connected State
  return (
    <div className="h-full flex flex-col border border-gray-800 rounded-xl bg-gray-900/50 overflow-hidden">
      <div className="p-6 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-800 flex items-center gap-4">
        <div className="p-3 bg-gray-800 rounded-lg">
            <Smartphone size={32} className="text-cyan-400" />
        </div>
        <div>
            <h2 className="text-xl font-bold text-white">{device?.modelName}</h2>
            <p className="text-xs font-mono text-cyan-400">{device?.udid}</p>
        </div>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto">
        
        <div className="p-4 bg-black/40 rounded-lg border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <Cpu size={14} /> Hardware
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Model ID</span>
                    <span className="font-mono text-gray-200">{device?.modelIdentifier}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Arch</span>
                    <span className="font-mono text-gray-200">{device?.cpuArchitecture}</span>
                </div>
                 <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Serial</span>
                    <span className="font-mono text-gray-200">{device?.serialNumber}</span>
                </div>
            </div>
        </div>

        <div className="p-4 bg-black/40 rounded-lg border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <Battery size={14} /> Power
            </div>
             <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Level</span>
                    <span className={`font-mono font-bold ${
                        (device?.batteryLevel || 0) > 20 ? 'text-green-400' : 'text-red-400'
                    }`}>{device?.batteryLevel}%</span>
                </div>
            </div>
        </div>

        <div className="p-4 bg-black/40 rounded-lg border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <Disc size={14} /> Storage
            </div>
            <div className="space-y-1">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Capacity</span>
                    <span className="font-mono text-gray-200">{device?.capacity}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500">iOS</span>
                    <span className="font-mono text-cyan-200">{device?.iosVersion}</span>
                </div>
            </div>
        </div>

        <div className="p-4 bg-black/40 rounded-lg border border-gray-800/50">
            <div className="flex items-center gap-2 mb-2 text-gray-400 text-xs uppercase tracking-wider font-bold">
                <Lock size={14} /> Activation
            </div>
            <div className="flex items-center gap-2 mt-2">
                {device?.activationState === 'Activated' ? (
                    <CheckCircle2 className="text-green-500" size={18} />
                ) : (
                    <AlertCircle className="text-red-500" size={18} />
                )}
                <span className={`text-sm font-bold ${
                    device?.activationState === 'Activated' ? 'text-green-400' : 'text-red-400'
                }`}>
                    {device?.activationState}
                </span>
            </div>
        </div>
      
        <div className="md:col-span-2 mt-2">
            <button
                onClick={onRefresh}
                className="w-full py-2 text-xs font-mono text-gray-500 hover:text-gray-300 hover:bg-gray-800 rounded border border-transparent hover:border-gray-700 transition-all"
            >
                REFRESH DEVICE INFO
            </button>
        </div>
      </div>
    </div>
  );
};