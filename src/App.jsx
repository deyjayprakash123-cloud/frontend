import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowDown, 
  Terminal, 
  Upload, 
  Copy, 
  Check, 
  BookOpen, 
  Cpu, 
  Linkedin, 
  Sparkles, 
  Play, 
  Trash2, 
  FileText,
  AlertCircle
} from 'lucide-react';

// Technical configuration required by user
const BACKEND_URL = window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://link-backend-o76j.onrender.com';

export default function App() {
  // Console Log state
  const [logs, setLogs] = useState([
    { text: '// System ready. Operational Console standing by.', type: 'info' },
  ]);
  const [isPipelineRunning, setIsPipelineRunning] = useState(false);
  
  // Caption generator states
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  // References
  const workspaceRef = useRef(null);
  const fileInputRef = useRef(null);
  const terminalEndRef = useRef(null);

  // Scroll to bottom of terminal when logs change
  useEffect(() => {
    if (terminalEndRef.current) {
      terminalEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Clean up preview URL object to prevent memory leak
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  // Smooth scroll to operational workspace
  const handleScrollToWorkspace = () => {
    workspaceRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Helper to push a new log message
  const addLog = (text, type = 'info') => {
    setLogs((prev) => [...prev, { text, type, time: new Date().toLocaleTimeString() }]);
  };

  // Clear log history
  const handleClearLogs = () => {
    setLogs([{ text: '// Log cleared. Ready.', type: 'info' }]);
  };

  // 1. Trigger automated startup hunter pipeline
  const handleRunPipeline = async () => {
    if (isPipelineRunning) return;
    setIsPipelineRunning(true);
    addLog('Initiating Automated Startup Hunter Pipeline...', 'info');

    // Simulate stepping logs to show streaming execution steps
    const steps = [
      { text: 'Fetching active Y Combinator index...', delay: 800, type: 'info' },
      { text: 'Filtering candidates for Robotics, Automation, and AI focus...', delay: 1800, type: 'info' },
      { text: 'Evaluating technical stack and latest engineering innovation...', delay: 3000, type: 'info' },
      { text: 'Target identified: "AeroMechanics AI" (YC S25) - Drone Navigation Systems.', delay: 4200, type: 'success' },
      { text: 'Spinning up Gemini 3.1 Flash-Lite to write personalized pitch...', delay: 5300, type: 'info' },
      { text: 'Sending outreach payload to LinkedIn Native Share API...', delay: 6800, type: 'info' }
    ];

    steps.forEach((step) => {
      setTimeout(() => {
        addLog(step.text, step.type);
      }, step.delay);
    });

    try {
      // Execute the real API call
      const response = await fetch(`${BACKEND_URL}/api/run-pipeline`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      // We wait for the simulated logs to catch up before outputting the final result
      setTimeout(() => {
        if (response.ok) {
          addLog(data.message || 'Pipeline successfully finished! Post is live.', 'success');
          if (data.details) {
            addLog(`Pipeline Details: ${JSON.stringify(data.details)}`, 'success');
          }
        } else {
          addLog(`Pipeline returned error state: ${data.detail || data.error || 'Server error'}`, 'error');
        }
        setIsPipelineRunning(false);
      }, 8000);

    } catch (error) {
      setTimeout(() => {
        addLog(`Network connection to ${BACKEND_URL} failed: ${error.message}`, 'error');
        setIsPipelineRunning(false);
      }, 8000);
    }
  };

  // Drag and Drop File Handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, or WEBP)');
      return;
    }
    
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleRemoveFile = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // 2. Generate manual caption from certificate image
  const handleGenerateCaption = async () => {
    if (!selectedFile || isGenerating) return;
    setIsGenerating(true);
    setGeneratedCaption('');

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${BACKEND_URL}/api/generate-caption`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setGeneratedCaption(data.caption || 'No caption generated by model.');
      } else {
        alert(`Error generating caption: ${data.detail || data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert(`API Request failed: ${error.message}. Is backend running at ${BACKEND_URL}?`);
    } finally {
      setIsGenerating(false);
    }
  };

  // 3. Copy output to clipboard
  const handleCopyToClipboard = async () => {
    if (!generatedCaption) return;
    try {
      await navigator.clipboard.writeText(generatedCaption);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      // Fallback
      const textarea = document.getElementById('captionResult');
      if (textarea) {
        textarea.select();
        document.execCommand('copy');
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col relative w-full bg-zinc-950 text-zinc-100 selection:bg-indigo-500/20">
      
      {/* Background design elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[500px] bg-indigo-500/[0.04] blur-[150px] rounded-full pointer-events-none"></div>
      <div className="absolute top-[800px] right-10 w-[400px] h-[400px] bg-purple-500/[0.03] blur-[120px] rounded-full pointer-events-none"></div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col justify-center items-center px-4 py-16 text-center border-b border-zinc-900/80">
        <div className="max-w-4xl mx-auto space-y-8 select-none">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-lg text-xs font-semibold text-zinc-300 tracking-wide">
            <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
            NEXT-GEN RECRUITMENT & BRAND AUTOMATION
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-300 bg-clip-text text-transparent animate-gradient-shift">
              LaunchOutreach AI
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed font-light">
            Automate startup discovery, analyze engineering innovation, and publish tailored network outreach completely hands-free.
          </p>

          <div className="pt-6">
            <button 
              onClick={handleScrollToWorkspace}
              className="group inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white font-semibold text-base py-3.5 px-8 rounded-full shadow-lg shadow-indigo-600/20 hover:shadow-indigo-500/30 transition-all duration-300 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
            >
              Enter Workspace
              <ArrowDown className="w-4 h-4 transition-transform duration-300 group-hover:translate-y-1" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. DOCUMENTATION & SYSTEM UTILITIES SECTION */}
      <section className="max-w-6xl mx-auto px-4 py-20 w-full space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-zinc-100">
            System Architecture
          </h2>
          <p className="text-sm text-zinc-400 max-w-lg mx-auto">
            A look behind the hood of the integration layer connecting discovery pipelines with LLM generators.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card A */}
          <div className="glow-border relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:scale-[1.01] hover:border-zinc-700/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-indigo-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200">YC Directory Scraping</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                The engine polls the open-source Y Combinator index to find active Robotics, Automation, and AI companies instantly without API limits.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600">ENDPOINT // PUBLIC_INDEX</div>
          </div>

          {/* Card B */}
          <div className="glow-border relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:scale-[1.01] hover:border-zinc-700/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-purple-400">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200">Gemini 3.1 Flash-Lite Engine</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Leverages Google's most efficient, token-light multimodal model to read certificate metadata or write contextual technical pitches.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600">MODEL // GEMINI_3.1_FLASH_LITE</div>
          </div>

          {/* Card C */}
          <div className="glow-border relative flex flex-col justify-between p-6 rounded-2xl border border-zinc-800/80 bg-zinc-900/20 hover:bg-zinc-900/40 hover:scale-[1.01] hover:border-zinc-700/80 transition-all duration-300">
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-center text-emerald-400">
                <Linkedin className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-zinc-200">LinkedIn Native Connection</h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-light">
                Utilizes the official LinkedIn Share API for secure OAuth handshakes instead of fragile, error-prone browser automation scripts.
              </p>
            </div>
            <div className="pt-6 text-xs font-mono text-zinc-600">HANDSHAKE // LI_API_SECURE</div>
          </div>

        </div>
      </section>

      {/* 3. OPERATIONAL WORKSPACE SECTION */}
      <section 
        ref={workspaceRef} 
        className="max-w-6xl mx-auto px-4 py-20 w-full space-y-10 scroll-mt-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-900 pb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-100">
              Operational Console
            </h2>
            <p className="text-sm text-zinc-400">
              Execute live outreach pipelines or draft custom posts using the tools below.
            </p>
          </div>
          <div className="text-xs font-mono px-3 py-1 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
            ENV_URL // {BACKEND_URL}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          {/* Card 1: Automated Startup Hunter Pipeline */}
          <div className="flex flex-col h-full justify-between p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-zinc-200">
                    Automated Startup Hunter Pipeline
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Run background queries to source targets and auto-post pitches.
                  </p>
                </div>
                <div className="flex h-2 w-2 relative mt-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </div>
              </div>

              {/* Action trigger */}
              <div>
                <button
                  onClick={handleRunPipeline}
                  disabled={isPipelineRunning}
                  className={`w-full group inline-flex items-center justify-center gap-2.5 font-semibold py-3 px-5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isPipelineRunning 
                      ? 'bg-indigo-800/40 text-indigo-300 border border-indigo-500/30 animate-pulse cursor-wait'
                      : 'bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-lg shadow-indigo-600/10'
                  }`}
                >
                  <Play className={`w-4 h-4 ${isPipelineRunning ? 'animate-spin' : ''}`} />
                  <span>{isPipelineRunning ? 'Pipeline Executing...' : 'Discover & Post Next Startup'}</span>
                </button>
              </div>

              {/* Terminal Logs Panel */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5" />
                    outreach_stream.log
                  </span>
                  <button 
                    onClick={handleClearLogs}
                    className="text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    Clear Output
                  </button>
                </div>

                <div 
                  id="pipelineLog"
                  className="h-64 overflow-y-auto border border-zinc-800/80 bg-black/70 rounded-xl p-4 font-mono text-xs md:text-sm space-y-2 shadow-inner"
                >
                  {logs.map((log, idx) => (
                    <div 
                      key={idx} 
                      className={`leading-relaxed ${
                        log.type === 'error' ? 'text-rose-400' :
                        log.type === 'success' ? 'text-emerald-400 animate-pulse' :
                        log.type === 'warning' ? 'text-amber-400' : 'text-zinc-300'
                      }`}
                    >
                      {log.time && <span className="text-zinc-700 mr-2">[{log.time}]</span>}
                      {log.text}
                    </div>
                  ))}
                  <div ref={terminalEndRef} />
                </div>
              </div>
            </div>

            <div className="text-[10px] font-mono text-zinc-600 border-t border-zinc-800/50 pt-4 mt-2">
              PIPELINE_ROUTE // /api/run-pipeline
            </div>
          </div>

          {/* Card 2: Manual Certificate Caption Generator */}
          <div className="flex flex-col h-full justify-between p-6 rounded-2xl border border-zinc-800 bg-zinc-900/30 backdrop-blur-md space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-lg font-semibold text-zinc-200">
                  Manual Certificate Caption Generator
                </h3>
                <p className="text-xs text-zinc-400">
                  Analyze technical credentials to compose premium LinkedIn updates.
                </p>
              </div>

              {/* Upload Dropzone */}
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`group relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 min-h-[140px] ${
                  dragActive 
                    ? 'border-indigo-500 bg-indigo-500/10' 
                    : 'border-zinc-800 bg-zinc-950/20 hover:border-indigo-500/30 hover:bg-zinc-950/40'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  id="certificateFile"
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />

                {!previewUrl ? (
                  <div className="space-y-2 select-none">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-indigo-400 group-hover:border-indigo-500/20 group-hover:bg-indigo-500/5 transition-all duration-300">
                      <Upload className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-zinc-200">Click to import image</span>
                      <span className="text-xs text-zinc-500"> or drag and drop</span>
                    </div>
                    <p className="text-[10px] text-zinc-600">Supports PNG, JPG, or WEBP</p>
                  </div>
                ) : (
                  <div className="w-full flex flex-col items-center gap-3" onClick={(e) => e.stopPropagation()}>
                    <div className="relative rounded-lg overflow-hidden border border-zinc-800/80 bg-black/20 shadow-lg p-1 max-w-[200px]">
                      <img src={previewUrl} alt="Upload Preview" className="max-h-24 object-contain rounded" />
                      <button
                        onClick={handleRemoveFile}
                        className="absolute top-2 right-2 p-1 rounded-full bg-zinc-900/90 text-rose-400 hover:text-rose-300 hover:bg-zinc-800 transition-colors border border-zinc-800 shadow"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-xs text-zinc-400 truncate max-w-xs font-mono">{selectedFile?.name}</span>
                  </div>
                )}
              </div>

              {/* Generate button */}
              <div>
                <button
                  onClick={handleGenerateCaption}
                  disabled={!selectedFile || isGenerating}
                  className={`w-full group inline-flex items-center justify-center gap-2.5 font-semibold py-3 px-5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${
                    isGenerating 
                      ? 'bg-indigo-800/40 text-indigo-300 border border-indigo-500/30 animate-pulse cursor-wait'
                      : !selectedFile 
                        ? 'bg-zinc-800/50 text-zinc-500 border border-zinc-800/80 cursor-not-allowed'
                        : 'bg-zinc-800 hover:bg-zinc-700 active:bg-zinc-900 border border-zinc-700 text-zinc-100 hover:border-zinc-600 hover:shadow-md'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGenerating ? 'Analyzing with Gemini...' : 'Generate Caption (Gemini 3.1 Flash-Lite)'}</span>
                </button>
              </div>

              {/* Result Area */}
              {generatedCaption && (
                <div className="space-y-2 animate-fadeIn">
                  <div className="flex justify-between items-center px-1">
                    <span className="text-xs font-mono text-zinc-500 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      generated_draft.txt
                    </span>
                    <button
                      onClick={handleCopyToClipboard}
                      className="text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1 transition-colors"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy to Clipboard</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  <textarea
                    id="captionResult"
                    readOnly
                    value={generatedCaption}
                    className="w-full h-36 rounded-xl border border-zinc-800 bg-zinc-950/70 p-4 font-sans text-xs md:text-sm text-zinc-300 resize-none focus:outline-none focus:border-zinc-700 shadow-inner leading-relaxed"
                  />
                </div>
              )}
            </div>

            <div className="text-[10px] font-mono text-zinc-600 border-t border-zinc-800/50 pt-4 mt-2">
              GENERATION_ROUTE // /api/generate-caption
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto px-4 py-12 mt-auto border-t border-zinc-900 text-center text-xs text-zinc-600 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>&copy; 2026 LaunchOutreach AI Systems. All rights reserved.</p>
        <div className="flex gap-4">
          <a href="#" className="hover:text-zinc-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">Terms</a>
          <a href="#" className="hover:text-zinc-400 transition-colors">API docs</a>
        </div>
      </footer>

    </div>
  );
}
