import React, { useState } from 'react';
import { Shield, Download, FileCode, Terminal, Github, Cpu, Zap, Lock, AlertTriangle, Smartphone, CheckCircle, Server, Copy, XCircle } from 'lucide-react';
import { pythonSourceCode } from './utils/pythonCode';
import { flaskServerCode } from './utils/serverCode';

export default function App() {
  const [activeTab, setActiveTab] = useState<'download' | 'register' | 'server'>('download');
  const [copied, setCopied] = useState(false);
  const [serverCodeCopied, setServerCodeCopied] = useState(false);
  const [ecidInput, setEcidInput] = useState('');
  const [serverUrl, setServerUrl] = useState('');
  const [regStatus, setRegStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [regMsg, setRegMsg] = useState('');

  const handleDownload = () => {
    const blob = new Blob([pythonSourceCode], { type: 'text/x-python' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Xtr1a_Activator.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(pythonSourceCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyServer = () => {
    navigator.clipboard.writeText(flaskServerCode);
    setServerCodeCopied(true);
    setTimeout(() => setServerCodeCopied(false), 2000);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (ecidInput.length < 5) {
      setRegStatus('error');
      setRegMsg('Invalid ECID length');
      return;
    }
    
    let targetUrl = serverUrl.trim();
    if (!targetUrl) {
        setRegStatus('error');
        setRegMsg('Please enter your PythonAnywhere Server URL');
        return;
    }
    // Remove trailing slash
    targetUrl = targetUrl.replace(/\/$/, "");
    if (!targetUrl.startsWith('http')) {
        targetUrl = 'https://' + targetUrl;
    }

    setRegStatus('loading');
    setRegMsg('');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      // Call the Flask endpoint
      const response = await fetch(`${targetUrl}/register_ecid?ecid=${ecidInput}`, {
        method: 'GET',
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);

      if (response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            const data = await response.json();
            if (data.success) {
                setRegStatus('success');
                setRegMsg(data.message || `ECID ${ecidInput} successfully registered.`);
            } else {
                setRegStatus('error');
                setRegMsg(data.message || 'Server rejected registration.');
            }
        } else {
            // Fallback for plain text responses
            const text = await response.text();
            setRegStatus('error');
            setRegMsg(`Invalid server response format: ${text.substring(0, 50)}...`);
        }
      } else {
        setRegStatus('error');
        setRegMsg(`Server Error (${response.status}): ${response.statusText}`);
      }
    } catch (err: any) {
      setRegStatus('error');
      setRegMsg(err.name === 'AbortError' ? 'Connection timed out.' : 'Failed to connect. Verify URL.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-cyan-500/30 overflow-x-hidden">
      
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-900/20">
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Xtr1a<span className="text-cyan-500">_Activator</span>
            </span>
          </div>
          
          <div className="flex gap-6">
             <button 
                onClick={() => setActiveTab('download')}
                className={`text-sm font-medium transition-colors ${activeTab === 'download' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
             >
                Download Tool
             </button>
             <button 
                onClick={() => setActiveTab('server')}
                className={`text-sm font-medium transition-colors ${activeTab === 'server' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
             >
                Server Setup
             </button>
             <button 
                onClick={() => setActiveTab('register')}
                className={`text-sm font-medium transition-colors ${activeTab === 'register' ? 'text-cyan-400' : 'text-gray-400 hover:text-white'}`}
             >
                Register Device
             </button>
             <a 
                href="https://github.com/rhcp011235/A12_Bypass_OSS" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                <Github size={16} />
              </a>
          </div>
        </div>
      </nav>

      <main className="relative">
        
        {activeTab === 'download' && (
          <>
            <section className="pt-24 pb-12 px-6 text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/20 border border-cyan-800 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-6">
                <Zap size={12} />
                <span>v1.0.3 Release</span>
              </div>
              
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
                The Ultimate <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">iOS Utility</span>
              </h1>
              
              <p className="text-lg text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                A powerful Python-based GUI tool for iCloud Lock Removal. 
                Designed for PythonAnywhere backend integration.
                <br />
                <span className="text-sm text-gray-500 mt-2 block">Compatible with Windows, macOS, and Linux.</span>
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={handleDownload}
                  className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-bold transition-all shadow-[0_0_40px_-10px_rgba(6,182,212,0.5)] hover:shadow-[0_0_60px_-10px_rgba(6,182,212,0.6)] flex items-center gap-3"
                >
                  <Download size={20} />
                  <span>Download .py Source</span>
                  <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
                </button>
                
                <button 
                  onClick={handleCopy}
                  className="px-8 py-4 bg-gray-900 hover:bg-gray-800 text-gray-300 border border-gray-700 hover:border-gray-600 rounded-xl font-bold transition-all flex items-center gap-3"
                >
                  {copied ? <Terminal size={20} className="text-green-500" /> : <FileCode size={20} />}
                  <span>{copied ? "Copied" : "Copy Source"}</span>
                </button>
              </div>
            </section>

            <section className="py-20 px-6 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Cpu className="text-blue-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Smart Detection</h3>
                  <p className="text-gray-400 text-sm">
                     Automatically locates required USB communication binaries in system PATH.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Lock className="text-cyan-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Cloud Auth</h3>
                  <p className="text-gray-400 text-sm">
                    Secure ECID validation using your own private PythonAnywhere server instance.
                  </p>
                </div>
                <div className="p-6 rounded-2xl bg-gray-900/50 border border-gray-800 backdrop-blur-sm">
                  <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                    <Terminal className="text-purple-400" size={24} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Auto-Reboot</h3>
                  <p className="text-gray-400 text-sm">
                    Intelligent loop retries device connection up to 6 times to capture activation logs.
                  </p>
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'server' && (
           <section className="pt-24 pb-12 px-6 max-w-4xl mx-auto">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-xl">
                 <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-1">PythonAnywhere Backend</h2>
                        <p className="text-gray-400 text-sm">Deploy this Flask code to your server to handle activations.</p>
                    </div>
                    <button 
                        onClick={handleCopyServer}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-900/30 text-cyan-400 rounded-lg hover:bg-cyan-900/50 transition-colors"
                    >
                        {serverCodeCopied ? <CheckCircle size={16}/> : <Copy size={16} />}
                        <span>{serverCodeCopied ? "Copied" : "Copy Code"}</span>
                    </button>
                 </div>
                 
                 <div className="bg-black/80 rounded-lg p-4 overflow-x-auto border border-gray-800">
                    <pre className="text-sm font-mono text-gray-300">
                        {flaskServerCode}
                    </pre>
                 </div>
              </div>
           </section>
        )}

        {activeTab === 'register' && (
          <section className="pt-24 pb-12 px-6 text-center max-w-2xl mx-auto min-h-[60vh]">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-8 backdrop-blur-xl">
               <div className="w-16 h-16 bg-cyan-900/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                 <Smartphone size={32} className="text-cyan-400" />
               </div>
               
               <h2 className="text-3xl font-bold text-white mb-2">Register Device</h2>
               <p className="text-gray-400 mb-8">
                 Whitelist your ECID on your activation server.
               </p>

               <form onSubmit={handleRegister} className="space-y-4">
                 <div className="flex gap-2">
                    <div className="bg-black/50 border border-gray-700 rounded-lg px-4 py-4 flex items-center justify-center text-gray-500">
                        <Server size={20} />
                    </div>
                    <input 
                        type="text" 
                        placeholder="Server URL (e.g. myapp.pythonanywhere.com)"
                        value={serverUrl}
                        onChange={(e) => setServerUrl(e.target.value)}
                        className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-4 text-white font-mono focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                 </div>

                 <input 
                    type="text" 
                    placeholder="Enter ECID (Hex)"
                    value={ecidInput}
                    onChange={(e) => setEcidInput(e.target.value)}
                    className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-4 text-white font-mono text-center focus:outline-none focus:border-cyan-500 transition-colors"
                 />
                 
                 <button 
                    type="submit"
                    disabled={regStatus === 'loading'}
                    className={`w-full font-bold py-4 rounded-lg transition-all shadow-lg shadow-cyan-900/20 ${
                        regStatus === 'loading' 
                        ? 'bg-gray-700 text-gray-400 cursor-wait'
                        : 'bg-cyan-600 hover:bg-cyan-500 text-white'
                    }`}
                 >
                   {regStatus === 'loading' ? 'Connecting to Server...' : 'Register ECID'}
                 </button>
               </form>

               {regStatus === 'success' && (
                 <div className="mt-8 p-6 bg-green-900/20 border border-green-500/30 rounded-xl flex flex-col items-center justify-center gap-3 text-green-400 animate-in fade-in zoom-in-95 duration-300 shadow-lg shadow-green-900/10">
                   <div className="p-3 bg-green-500/20 rounded-full">
                      <CheckCircle size={32} />
                   </div>
                   <h3 className="text-xl font-bold">Registration Successful</h3>
                   <p className="text-center font-mono text-sm opacity-90">{regMsg}</p>
                 </div>
               )}
               
               {regStatus === 'error' && (
                 <div className="mt-8 p-6 bg-red-900/20 border border-red-500/30 rounded-xl flex flex-col items-center justify-center gap-3 text-red-400 animate-in fade-in zoom-in-95 duration-300 shadow-lg shadow-red-900/10">
                   <div className="p-3 bg-red-500/20 rounded-full">
                      <XCircle size={32} />
                   </div>
                   <h3 className="text-xl font-bold">Registration Failed</h3>
                   <p className="text-center font-mono text-sm opacity-90">{regMsg}</p>
                 </div>
               )}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="py-8 text-center text-gray-600 text-sm border-t border-gray-900/50 mt-12">
            <div className="flex items-center justify-center gap-2 mb-2">
                <AlertTriangle size={14} />
                <span>Only Use on Devices you "OWN"</span>
            </div>
            <p>&copy; 2025 Xtr1a Tools. Not affiliated with Apple Inc.</p>
        </footer>

      </main>
    </div>
  );
}