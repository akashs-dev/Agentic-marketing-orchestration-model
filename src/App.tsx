import React, { useState, useRef, useEffect, useMemo } from 'react';
import { FileText, Users, Palette, Zap, Target, BarChart3, Bot, Mail, FileSpreadsheet, Calendar, RefreshCw, Lightbulb, Filter, Share2, Sparkles, LineChart, X, Database, LayoutTemplate, MessageSquare, Play, AlertCircle, BookOpen, Layers, ArrowRight, ZoomIn, ZoomOut } from 'lucide-react';
import { gsap } from 'gsap';
import { NODES, CONNECTIONS, AGENTS } from './data';

function getPath(startX: number, startY: number, endX: number, endY: number) {
  const dx = endX - startX;
  const controlPointX = startX + Math.max(dx / 2, 100);
  return `M ${startX} ${startY} C ${controlPointX} ${startY}, ${controlPointX} ${endY}, ${endX} ${endY}`;
}

// FloatingAgents removed

const Connection = ({ sourceNode, targetNode, isLegacy, isRecentlyApproved }: any) => {
  const startX = sourceNode.x + 380;
  const startY = sourceNode.y + 140;
  const endX = targetNode.x;
  const endY = targetNode.y + 140;
  const pathData = getPath(startX, startY, endX, endY);
  
  const pathRef = useRef<SVGPathElement>(null);
  const pulseRef = useRef<SVGPathElement>(null);
  const [pathLength, setPathLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength());
    }
  }, [pathData]);

  useEffect(() => {
    if (!isLegacy && isRecentlyApproved && pathLength > 0 && pulseRef.current) {
      gsap.fromTo(pulseRef.current,
        { strokeDashoffset: pathLength, opacity: 1 },
        { strokeDashoffset: 0, duration: 1.5, ease: "power1.inOut", opacity: 0 }
      );
    }
  }, [isLegacy, isRecentlyApproved, pathLength]);

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  const icons = [<Mail size={16} />, <FileSpreadsheet size={16} />, <Calendar size={16} />];
  const icon = icons[Math.floor((startX + endY) % 3)];

  return (
    <g>
      <path 
        ref={pathRef}
        d={pathData} 
        fill="none" 
        stroke={isLegacy ? "#fca5a5" : "#cbd5e1"} 
        strokeWidth={isLegacy ? 2 : 3} 
        strokeDasharray={isLegacy ? "8,8" : "none"}
        className="transition-all duration-500"
      />
      {!isLegacy && (
        <path 
          ref={pulseRef} 
          d={pathData} 
          fill="none"
          stroke="#6366f1" 
          strokeWidth="6" 
          strokeDasharray={`40 ${pathLength || 10000}`} 
          strokeLinecap="round" 
          style={{ filter: 'drop-shadow(0 0 8px #818cf8)', opacity: 0 }} 
        />
      )}
      {isLegacy && (
        <foreignObject x={midX - 16} y={midY - 16} width="32" height="32">
          <div className="w-8 h-8 bg-red-50 border border-red-200 rounded-full flex items-center justify-center text-red-400 shadow-sm">
            {icon}
          </div>
        </foreignObject>
      )}
    </g>
  );
};

const NodeCard = ({ node, isLegacy, isApproved, canApprove, onApprove, onNavigate, viewMode }: any) => {
  const Icon = node.icon;
  const isBusinessOwner = node.id.startsWith('business_owner');
  
  return (
    <div 
      className={`absolute w-[380px] rounded-2xl border backdrop-blur-xl shadow-xl overflow-hidden transition-all duration-700 no-pan ${
        isLegacy 
          ? 'bg-white/95 border-gray-200 shadow-gray-200/50' 
          : 'bg-white/80 border-indigo-200/60 shadow-indigo-500/10'
      }`} 
      style={{ left: node.x, top: node.y }}
    >
      {/* Header */}
      <div className={`p-5 border-b flex items-center justify-between transition-colors duration-700 ${
        isLegacy ? 'bg-gray-50/80' : 'bg-gradient-to-r from-indigo-500/10 to-blue-500/5'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-2.5 rounded-xl transition-colors duration-700 ${
            isLegacy ? 'bg-gray-200 text-gray-600' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
          }`}>
            <Icon size={22} />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg leading-tight">{node.title}</h3>
            <span className="text-xs font-bold tracking-wide text-indigo-600 uppercase">{node.adobeTool}</span>
          </div>
        </div>
      </div>

      {/* Agent Co-pilot */}
      <div className={`overflow-hidden transition-all duration-700 ${isLegacy ? 'max-h-0 opacity-0' : 'max-h-[200px] opacity-100'}`}>
        <div className="p-5 bg-indigo-900/5 border-b border-indigo-100/50 relative">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-500 shadow-[0_0_12px_#6366f1]"></div>
          <div className="flex gap-3">
            <Bot className="text-indigo-600 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-xs font-bold tracking-wider text-indigo-800 mb-1.5 uppercase">Agent Co-pilot</p>
              <p className="text-sm text-gray-700 leading-relaxed">{node.agentPush}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Human Action */}
      <div className="p-5 bg-gray-50/90">
        <div className="flex gap-3 mb-5">
          <Users className="text-gray-500 shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-xs font-bold tracking-wider text-gray-500 mb-1.5 uppercase">Human Action</p>
            <p className="text-sm text-gray-700 leading-relaxed">{node.humanAction}</p>
          </div>
        </div>
        
        <button 
          onClick={() => onApprove(node.id)}
          disabled={isApproved || !canApprove}
          className={`w-full py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            isApproved 
              ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
              : canApprove
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md hover:shadow-indigo-500/20 hover:-translate-y-0.5'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {isApproved ? 'Approved' : isBusinessOwner ? 'Approve Brief' : 'Approve & Push'}
        </button>

        {viewMode !== 'combined-legacy' && viewMode !== 'combined-agentic' && node.links && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex flex-col gap-2">
            {node.links.map((link: any) => (
              <button
                key={link.targetView}
                onClick={(e) => { e.stopPropagation(); onNavigate(link.targetView); }}
                className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-indigo-100 text-indigo-700 rounded-xl text-sm font-bold hover:bg-indigo-50 hover:border-indigo-200 transition-all shadow-sm"
              >
                {link.label} <ArrowRight size={16} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const AgentModal = ({ agent, onClose }: { agent: any, onClose: () => void }) => {
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);
  const [activeVariant, setActiveVariant] = useState<'A' | 'B'>('B');
  const [isPlayingJourney, setIsPlayingJourney] = useState(false);

  // Reset state when agent changes
  useEffect(() => {
    setIsSyncing(false);
    setSyncSuccess(false);
    setActiveVariant('B');
    setIsPlayingJourney(false);
  }, [agent]);

  if (!agent) return null;
  const Icon = agent.icon;

  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncSuccess(true);
    }, 1500);
  };

  const renderAgentWorkspace = () => {
    switch (agent.agentType) {
      case 'brief_generator':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <p className="text-sm text-gray-500 mb-2">Human Prompt:</p>
              <p className="text-gray-800 font-medium">"Draft a Q3 Back-to-School campaign for high-LTV college students."</p>
            </div>
            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-3 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-amber-400"></div>
              <div className="flex items-center gap-2 text-amber-700 font-bold mb-2">
                <Bot size={18} /> Agent Generated Brief
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase">Est. Audience</p>
                  <p className="text-xl font-bold text-gray-900">xxx</p>
                </div>
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-xs text-gray-500 uppercase">Proj. ROI</p>
                  <p className="text-xl font-bold text-emerald-600">xxx</p>
                </div>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs text-gray-500 uppercase mb-1">Recommended Channels</p>
                <div className="flex gap-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">Email</span>
                  <span className="px-2 py-1 bg-pink-100 text-pink-700 rounded text-xs font-semibold">TikTok</span>
                  <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs font-semibold">Display</span>
                </div>
              </div>
            </div>
          </div>
        );
      case 'segment_builder':
        return (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
              <MessageSquare className="text-gray-400" size={20} />
              <input type="text" disabled value="Find users who abandoned cart in last xxx days but have high LTV" className="bg-transparent w-full text-sm font-medium text-gray-800 outline-none" />
            </div>
            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400"></div>
              <div className="flex items-center gap-2 text-emerald-700 font-bold mb-4">
                <Database size={18} /> Generated RTCDP Segment Logic
              </div>
              <div className="space-y-2 font-mono text-sm">
                <div className="bg-white p-2 rounded border border-emerald-200 flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">INCLUDE</span> Event: Cart Abandonment
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200 flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">AND</span> Timeframe &lt;= xxx days
                </div>
                <div className="bg-white p-2 rounded border border-emerald-200 flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">AND</span> Profile.LTV_Score &gt; xxx
                </div>
              </div>
              <button 
                onClick={handleSync}
                disabled={isSyncing || syncSuccess}
                className={`mt-4 w-full py-2.5 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                  syncSuccess 
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' 
                    : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md hover:shadow-emerald-500/20'
                }`}
              >
                {isSyncing ? (
                  <><RefreshCw size={16} className="animate-spin" /> Syncing to Destinations...</>
                ) : syncSuccess ? (
                  <><Database size={16} /> Synced Successfully</>
                ) : (
                  <><Play size={16} /> Sync to RTCDP Destinations</>
                )}
              </button>
            </div>
          </div>
        );
      case 'journey_orchestrator':
        return (
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl h-72 relative overflow-hidden flex flex-col items-center justify-center">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-400"></div>
              <div className="flex items-center justify-between w-full absolute top-4 px-4">
                <div className="flex items-center gap-2 text-blue-700 font-bold">
                  <Share2 size={18} /> Generated Journey
                </div>
                <button 
                  onClick={() => setIsPlayingJourney(!isPlayingJourney)}
                  className={`p-1.5 rounded-full ${isPlayingJourney ? 'bg-blue-200 text-blue-700' : 'bg-blue-100 text-blue-600 hover:bg-blue-200'}`}
                >
                  {isPlayingJourney ? <RefreshCw size={16} className="animate-spin" /> : <Play size={16} />}
                </button>
              </div>
              
              {/* Mini Node Graph */}
              <div className="flex flex-col items-center gap-4 mt-8">
                <div className={`px-4 py-2 rounded-full border-2 text-sm font-bold shadow-sm transition-colors duration-500 ${isPlayingJourney ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-blue-300'}`}>Trigger: Cart Abandon</div>
                <div className={`w-0.5 h-4 transition-colors duration-500 ${isPlayingJourney ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
                <div className="bg-gray-100 px-3 py-1 rounded text-xs text-gray-500">Wait xxx Hours</div>
                <div className={`w-0.5 h-4 transition-colors duration-500 ${isPlayingJourney ? 'bg-blue-600' : 'bg-blue-300'}`}></div>
                <div className={`px-4 py-2 rounded-lg border-2 text-sm font-bold shadow-sm flex items-center gap-2 transition-colors duration-500 delay-300 ${isPlayingJourney ? 'bg-amber-500 text-white border-amber-500' : 'bg-white border-amber-300'}`}>
                  Condition: High LTV?
                </div>
                <div className="flex gap-16 relative">
                  <div className={`absolute -top-4 left-1/2 w-24 h-0.5 -translate-x-1/2 transition-colors duration-500 delay-500 ${isPlayingJourney ? 'bg-emerald-500' : 'bg-blue-300'}`}></div>
                  <div className={`absolute -top-4 left-[calc(50%-3rem)] w-0.5 h-4 transition-colors duration-500 delay-500 ${isPlayingJourney ? 'bg-emerald-500' : 'bg-blue-300'}`}></div>
                  <div className={`absolute -top-4 right-[calc(50%-3rem)] w-0.5 h-4 transition-colors duration-500 delay-500 ${isPlayingJourney ? 'bg-gray-400' : 'bg-blue-300'}`}></div>
                  
                  <div className={`px-3 py-2 rounded-lg border-2 text-xs font-bold shadow-sm mt-2 transition-colors duration-500 delay-700 ${isPlayingJourney ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white border-emerald-300'}`}>Send Premium Offer</div>
                  <div className={`px-3 py-2 rounded-lg border-2 text-xs font-bold shadow-sm mt-2 transition-colors duration-500 delay-700 ${isPlayingJourney ? 'bg-gray-100 text-gray-400 border-gray-200' : 'bg-white border-gray-300'}`}>Send Standard Reminder</div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'variant_generator':
        return (
          <div className="space-y-4">
            <div className="bg-purple-50 border border-purple-100 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-purple-400"></div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-purple-700 font-bold">
                  <LayoutTemplate size={18} /> Generated Variations (Adobe Target)
                </div>
                <div className="flex bg-white rounded-lg border border-purple-200 overflow-hidden text-xs font-bold">
                  <button onClick={() => setActiveVariant('A')} className={`px-3 py-1.5 ${activeVariant === 'A' ? 'bg-purple-100 text-purple-700' : 'text-gray-500 hover:bg-gray-50'}`}>Variant A</button>
                  <button onClick={() => setActiveVariant('B')} className={`px-3 py-1.5 ${activeVariant === 'B' ? 'bg-purple-600 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>Variant B</button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className={`bg-white rounded-lg border-2 overflow-hidden transition-all duration-300 ${activeVariant === 'A' ? 'border-purple-400 shadow-md scale-105' : 'border-gray-200 opacity-60'}`}>
                  <div className="h-20 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Image: Student Lifestyle</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-gray-500 mb-1">Variant A (Control)</p>
                    <p className="text-sm font-semibold">"Ready for School?"</p>
                  </div>
                </div>
                <div className={`bg-white rounded-lg border-2 overflow-hidden transition-all duration-300 relative ${activeVariant === 'B' ? 'border-purple-400 shadow-md scale-105' : 'border-gray-200 opacity-60'}`}>
                  <div className="absolute top-1 right-1 bg-purple-500 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">Predicted Winner</div>
                  <div className="h-20 bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-400 text-xs">Image: Tech Gadgets</span>
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-bold text-purple-600 mb-1">Variant B (Tech Segment)</p>
                    <p className="text-sm font-semibold">"Upgrade Your Gear for Fall"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'anomaly_detector':
        return (
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-100 p-4 rounded-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-rose-400"></div>
              <div className="flex items-center gap-2 text-rose-700 font-bold mb-4">
                <AlertCircle size={18} /> Anomaly Detected
              </div>
              
              <div className="flex gap-4">
                <div className="w-1/3 flex flex-col justify-end h-32 gap-2 border-b border-l border-rose-200 p-2">
                  <div className="flex items-end gap-1 h-full">
                    <div className="w-full bg-rose-200 h-[80%] rounded-t"></div>
                    <div className="w-full bg-rose-200 h-[85%] rounded-t"></div>
                    <div className="w-full bg-rose-200 h-[82%] rounded-t"></div>
                    <div className="w-full bg-rose-500 h-[40%] rounded-t relative">
                      <div className="absolute -top-2 -right-1 w-3 h-3 bg-rose-600 rounded-full animate-ping"></div>
                      <div className="absolute -top-2 -right-1 w-3 h-3 bg-rose-600 rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="w-2/3 space-y-3">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-rose-100">
                    <p className="text-sm text-gray-800"><span className="font-bold text-rose-600">Insight:</span> xxx% drop in checkout completion detected on Mobile Safari.</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-rose-100">
                    <p className="text-sm text-gray-800"><span className="font-bold text-rose-600">Root Cause:</span> Apple Pay integration latency spike.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"></div>
      <div 
        className="relative w-full max-w-2xl bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
        onPointerDown={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className={`p-6 border-b border-gray-100 flex items-start justify-between ${agent.bg}`}>
          <div className="flex items-center gap-4">
            <div className={`w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center ${agent.color}`}>
              <Icon size={32} />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-900 tracking-tight">{agent.name}</h2>
              <p className="text-sm font-medium text-gray-600 mt-1">{agent.description}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/50 hover:bg-white rounded-full transition-colors text-gray-500">
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Replaces Human Effort</p>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Users size={16} className="text-gray-400" /> {agent.replaces}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Adobe Integration</p>
              <p className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <Database size={16} className="text-gray-400" /> {agent.adobeTool}
              </p>
            </div>
          </div>

          <div className="mb-2">
            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Bot size={18} className={agent.color} /> Agent Workspace
            </h3>
            {renderAgentWorkspace()}
          </div>
        </div>
      </div>
    </div>
  );
};

type ViewMode = 'strategy' | 'creative' | 'ops' | 'combined-legacy' | 'agents' | 'combined-agentic' | 'documentation';

const MenuButton = ({ mode, label, current, set }: { mode: ViewMode, label: string, current: ViewMode, set: (m: ViewMode) => void }) => (
  <button
    onClick={() => set(mode)}
    className={`w-full text-left px-6 py-4 text-sm font-semibold transition-colors border-l-4 ${
      current === mode 
        ? 'bg-indigo-50 text-indigo-700 border-indigo-600' 
        : 'border-transparent text-gray-600 hover:bg-gray-50 hover:text-gray-900'
    }`}
  >
    {label}
  </button>
);

const Documentation = () => (
  <div className="p-12 max-w-4xl mx-auto h-full overflow-y-auto no-pan">
    <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-10">
      <h2 className="text-3xl font-black text-gray-900 mb-6">Architecture & Dependencies</h2>
      
      <div className="space-y-8">
        <section>
          <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2"><Layers size={24} /> Adobe Stack Integration</h3>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Adobe Workfront</h4>
              <p className="text-gray-600 text-sm">Serves as the system of record for strategy and planning. The Use Case Agent integrates here to draft briefs and project ROI.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Adobe Real-Time CDP (RTCDP)</h4>
              <p className="text-gray-600 text-sm">Central hub for audience data. The Segmentation Agent builds cohorts and suppression logic directly into RTCDP.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Adobe Journey Optimizer (AJO) & Campaign</h4>
              <p className="text-gray-600 text-sm">Execution engine for omnichannel journeys. The Campaign Agent orchestrates flows and triggers based on RTCDP segments.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Adobe Target & GenStudio</h4>
              <p className="text-gray-600 text-sm">Powers real-time personalization and content generation. The Personalization Agent creates and tests variants here.</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-2">Customer Journey Analytics (CJA)</h4>
              <p className="text-gray-600 text-sm">Provides cross-channel insights. The Insights Agent monitors CJA for anomalies and attribution data.</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xl font-bold text-indigo-900 mb-4 flex items-center gap-2"><Database size={24} /> Workflow Dependencies</h3>
          <ul className="list-disc pl-5 space-y-2 text-gray-600 text-sm">
            <li><strong>Strategy Phase:</strong> Business Owners (Pillars A, B, C) must approve briefs before Audience, Campaign, and Analytics Strategy Leads can begin their respective planning.</li>
            <li><strong>Design Phase:</strong> Creative Director relies on Business Owner briefs. Creative Designers depend on the Creative Director's approved narrative.</li>
            <li><strong>Operations Phase:</strong> CDP Ops requires Audience Strategy approval. Campaign Ops requires Campaign Strategy, CDP Ops, and Creative Designer approvals. Target Ops requires Personalization Strategy, CDP Ops, and Creative Designer approvals.</li>
          </ul>
        </section>
      </div>
    </div>
  </div>
);

const AgentsGrid = ({ onAgentClick }: { onAgentClick: (agent: any) => void }) => (
  <div className="p-12 max-w-6xl mx-auto h-full overflow-y-auto no-pan">
    <h2 className="text-3xl font-black text-gray-900 mb-8">Agents</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {AGENTS.map(agent => {
        const Icon = agent.icon;
        return (
          <div 
            key={agent.id}
            onClick={() => onAgentClick(agent)}
            className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
          >
            <div className={`w-16 h-16 rounded-2xl ${agent.bg} border ${agent.border} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <Icon className={agent.color} size={32} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{agent.name}</h3>
            <p className="text-sm text-gray-600 mb-4 h-16">{agent.description}</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <Users size={14} /> Replaces: {agent.replaces}
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
                <Database size={14} /> Tool: {agent.adobeTool}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);

export default function App() {
  const [viewMode, setViewMode] = useState<ViewMode>('combined-agentic');
  const [isLegacy, setIsLegacy] = useState(false);
  const [approvedNodes, setApprovedNodes] = useState<Set<string>>(new Set());
  const [recentApprovals, setRecentApprovals] = useState<string[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (['strategy', 'creative', 'ops', 'combined-legacy'].includes(viewMode)) {
      setIsLegacy(true);
    } else if (viewMode === 'combined-agentic') {
      setIsLegacy(false);
    }
  }, [viewMode]);

  const visibleNodes = useMemo(() => {
    let nodes = [];
    switch (viewMode) {
      case 'strategy': nodes = NODES.filter(n => n.lane === 'strategy'); break;
      case 'creative': nodes = NODES.filter(n => n.lane === 'design'); break;
      case 'ops': nodes = NODES.filter(n => n.lane === 'ops'); break;
      case 'combined-legacy': nodes = NODES; break;
      case 'combined-agentic': nodes = NODES; break;
      default: nodes = []; break;
    }

    if (nodes.length === 0) return [];

    const minX = Math.min(...nodes.map(n => n.x));
    const minY = Math.min(...nodes.map(n => n.y));

    // Shift nodes so they start at x: 50, y: 50
    const offsetX = minX - 50;
    const offsetY = minY - 50;

    return nodes.map(n => ({
      ...n,
      x: n.x - offsetX,
      y: n.y - offsetY
    }));
  }, [viewMode]);

  const visibleConnections = useMemo(() => {
    const nodeIds = new Set(visibleNodes.map(n => n.id));
    return CONNECTIONS.filter(c => nodeIds.has(c.source) && nodeIds.has(c.target));
  }, [visibleNodes]);

  const canvasWidth = visibleNodes.length > 0 ? Math.max(...visibleNodes.map(n => n.x)) + 450 : 1000;
  const canvasHeight = visibleNodes.length > 0 ? Math.max(...visibleNodes.map(n => n.y)) + 400 : 1000;

  const handleApprove = (id: string) => {
    setApprovedNodes(prev => new Set(prev).add(id));
    setRecentApprovals(prev => [...prev, id]);
    setTimeout(() => {
      setRecentApprovals(prev => prev.filter(nodeId => nodeId !== id));
    }, 2000);
  };

  const resetFlow = () => {
    setApprovedNodes(new Set());
    setRecentApprovals([]);
  };

  const getProcessTime = () => {
    if (isLegacy) {
      switch (viewMode) {
        case 'strategy': return '3 Weeks';
        case 'creative': return '4 Weeks';
        case 'ops': return '2 Weeks';
        default: return '9 Weeks';
      }
    } else {
      switch (viewMode) {
        case 'strategy': return '2 Days';
        case 'creative': return '3 Days';
        case 'ops': return '1 Day';
        default: return '1 Week';
      }
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50">
      {/* Sidebar Menu */}
      <div className="w-72 bg-white border-r border-gray-200 shadow-lg z-50 flex flex-col no-pan shrink-0">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-black text-gray-900 tracking-tight leading-tight">MarTech<br/><span className="text-indigo-600">Orchestration</span></h1>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <MenuButton mode="strategy" label="1. Strategy" current={viewMode} set={setViewMode} />
          <MenuButton mode="creative" label="2. Creative" current={viewMode} set={setViewMode} />
          <MenuButton mode="ops" label="3. Operations" current={viewMode} set={setViewMode} />
          <MenuButton mode="combined-legacy" label="4. Overall Workflow (Current)" current={viewMode} set={setViewMode} />
          <MenuButton mode="combined-agentic" label="5. Overall Workflow (Future)" current={viewMode} set={setViewMode} />
          <MenuButton mode="agents" label="6. Agents" current={viewMode} set={setViewMode} />
          <MenuButton mode="documentation" label="7. Documentation" current={viewMode} set={setViewMode} />
        </div>
      </div>

      {/* Main Content Area */}
      <div 
        className="flex-1 relative overflow-auto dot-grid"
        style={{ 
          backgroundSize: `${32 * zoom}px ${32 * zoom}px`
        }}
      >
        {viewMode === 'documentation' ? (
          <Documentation />
        ) : viewMode === 'agents' ? (
          <AgentsGrid onAgentClick={setSelectedAgent} />
        ) : (
          <>
            {/* Top Bar (Only show in workflow views) */}
            <div className="fixed top-6 right-6 z-50 flex items-center gap-6 glass-panel p-3 pr-4 rounded-2xl shadow-xl no-pan">
              <div className="flex flex-col items-end border-r border-gray-200 pr-6">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-0.5">Process Time</span>
                <span className={`text-2xl font-black tracking-tight transition-colors duration-500 ${isLegacy ? 'text-red-500' : 'text-emerald-500'}`}>
                  {getProcessTime()}
                </span>
              </div>
              
              {viewMode === 'combined-agentic' && (
                <div className="flex items-center gap-2 bg-gray-100/80 p-1.5 rounded-xl">
                  <button 
                    onClick={() => setIsLegacy(true)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${isLegacy ? 'bg-white shadow-md text-gray-900 scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Legacy Mode
                  </button>
                  <button 
                    onClick={() => setIsLegacy(false)}
                    className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${!isLegacy ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 text-white scale-105' : 'text-gray-500 hover:text-gray-700'}`}
                  >
                    Agentic Mode
                  </button>
                </div>
              )}

              <button 
                onClick={resetFlow}
                className="p-2.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors"
                title="Reset Flow"
              >
                <RefreshCw size={20} />
              </button>
            </div>

            {/* Zoom Controls */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 glass-panel p-2 rounded-xl shadow-xl no-pan">
              <button 
                onClick={() => setZoom(z => Math.min(z + 0.1, 2))} 
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition-colors"
                title="Zoom In"
              >
                <ZoomIn size={20} />
              </button>
              <div className="text-xs font-bold text-center text-gray-500 py-1">
                {Math.round(zoom * 100)}%
              </div>
              <button 
                onClick={() => setZoom(z => Math.max(z - 0.1, 0.3))} 
                className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 text-gray-700 transition-colors"
                title="Zoom Out"
              >
                <ZoomOut size={20} />
              </button>
            </div>

            {/* Canvas Wrapper for correct scrolling with scale */}
            <div style={{ width: `${canvasWidth * zoom}px`, height: `${canvasHeight * zoom}px` }}>
              {/* Canvas */}
              <div 
                className="relative origin-top-left"
                style={{ 
                  transform: `scale(${zoom})`,
                  width: `${canvasWidth}px`,
                  height: `${canvasHeight}px`
                }}
              >
                {/* Connections */}
                <svg 
                  className="absolute top-0 left-0 pointer-events-none -z-10 overflow-visible"
                  style={{ width: '100%', height: '100%' }}
                >
                {visibleConnections.map((conn, i) => {
                  const sourceNode = visibleNodes.find(n => n.id === conn.source);
                  const targetNode = visibleNodes.find(n => n.id === conn.target);
                  if (!sourceNode || !targetNode) return null;
                  
                  return (
                    <Connection 
                      key={i} 
                      sourceNode={sourceNode} 
                      targetNode={targetNode} 
                      isLegacy={isLegacy}
                      isRecentlyApproved={recentApprovals.includes(sourceNode.id)}
                    />
                  );
                })}
              </svg>

              {/* Nodes */}
              {visibleNodes.map(node => {
                const canApprove = node.dependsOn.every(dep => approvedNodes.has(dep));
                return (
                  <NodeCard 
                    key={node.id}
                    node={node}
                    isLegacy={isLegacy}
                    isApproved={approvedNodes.has(node.id)}
                    canApprove={canApprove}
                    onApprove={handleApprove}
                    onNavigate={setViewMode}
                    viewMode={viewMode}
                  />
                );
              })}
            </div>
            </div>
          </>
        )}
      </div>

      {/* Agent Modal */}
      <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
    </div>
  );
}

