import React from 'react';
import { 
  ArrowDown, 
  CheckCircle2, 
  XCircle, 
  GitBranch, 
  Layers, 
  Cpu, 
  Radio, 
  ShieldCheck, 
  AlertCircle 
} from 'lucide-react';

interface AlgorithmFlowchartProps {
  isErrorFree: boolean;
  onSelectStage?: (stageId: string) => void;
}

export const AlgorithmFlowchart: React.FC<AlgorithmFlowchartProps> = ({
  isErrorFree,
  onSelectStage,
}) => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (onSelectStage) onSelectStage(id);
  };

  return (
    <section id="flowchart" className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-7 space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Interactive Execution Pipeline
            </span>
            <span className="text-slate-500 font-mono text-xs">·</span>
            <span className="text-xs text-slate-400">Decision Logic & Branching</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
            CRC Algorithm State Machine & Flowchart
          </h2>
        </div>
        <span className="text-xs text-slate-400">Click any step to inspect</span>
      </div>

      {/* Visual Flowchart Nodes */}
      <div className="max-w-2xl mx-auto flex flex-col items-center space-y-3 py-2 text-xs">
        {/* START */}
        <div className="px-5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 font-mono font-bold tracking-wider text-[11px]">
          START
        </div>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 1: Input Data Bits */}
        <button
          onClick={() => scrollTo('configuration')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-slate-700/80 hover:border-blue-500 text-center transition-all cursor-pointer group shadow-sm"
        >
          <span className="text-[10px] uppercase font-mono text-blue-400 block mb-0.5">Step 1</span>
          <span className="font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
            Enter Binary Data Bits (Message D)
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 2: Generator Polynomial */}
        <button
          onClick={() => scrollTo('configuration')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-slate-700/80 hover:border-cyan-500 text-center transition-all cursor-pointer group shadow-sm"
        >
          <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-0.5">Step 2</span>
          <span className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
            Enter Generator Polynomial (G) of Degree r
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 3: Append r Zeros */}
        <button
          onClick={() => scrollTo('division')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-slate-700/80 hover:border-amber-500 text-center transition-all cursor-pointer group shadow-sm"
        >
          <span className="text-[10px] uppercase font-mono text-amber-400 block mb-0.5">Step 3</span>
          <span className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
            Append r Zeros to Message: P = D · 2ʳ
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 4: Modulo-2 Division */}
        <button
          onClick={() => scrollTo('division')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-blue-900/80 hover:border-blue-400 text-center transition-all cursor-pointer group shadow-sm bg-blue-950/20"
        >
          <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-0.5">Step 4</span>
          <span className="font-semibold text-cyan-200 group-hover:text-white transition-colors">
            Perform Modulo-2 Binary XOR Division (P ÷ G)
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 5: Extract Remainder */}
        <button
          onClick={() => scrollTo('division')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-slate-700/80 hover:border-emerald-500 text-center transition-all cursor-pointer group shadow-sm"
        >
          <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-0.5">Step 5</span>
          <span className="font-semibold text-slate-100 group-hover:text-emerald-300 transition-colors">
            Extract Remainder: CRC Checksum (R) of r bits
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 6: Append CRC to Original Data */}
        <button
          onClick={() => scrollTo('transmission')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-slate-700/80 hover:border-blue-500 text-center transition-all cursor-pointer group shadow-sm"
        >
          <span className="text-[10px] uppercase font-mono text-blue-400 block mb-0.5">Step 6</span>
          <span className="font-semibold text-slate-100 group-hover:text-blue-300 transition-colors">
            Append CRC to Data → Codeword T = D + R
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 7: Transmit Codeword */}
        <button
          onClick={() => scrollTo('transmission')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-slate-700/80 hover:border-amber-500 text-center transition-all cursor-pointer group shadow-sm"
        >
          <span className="text-[10px] uppercase font-mono text-amber-400 block mb-0.5">Step 7</span>
          <span className="font-semibold text-slate-100 group-hover:text-amber-300 transition-colors">
            Transmit Codeword over Communication Channel
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 8: Receive Data */}
        <button
          onClick={() => scrollTo('error-injection')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-slate-700/80 hover:border-purple-500 text-center transition-all cursor-pointer group shadow-sm"
        >
          <span className="text-[10px] uppercase font-mono text-purple-400 block mb-0.5">Step 8</span>
          <span className="font-semibold text-slate-100 group-hover:text-purple-300 transition-colors">
            Receive Data: T' = T ⊕ E (Possible Channel Errors)
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Step 9: Receiver Modulo-2 Division */}
        <button
          onClick={() => scrollTo('verification')}
          className="w-72 sm:w-80 p-3 rounded-lg bg-[#0B1120] border border-slate-700/80 hover:border-cyan-500 text-center transition-all cursor-pointer group shadow-sm"
        >
          <span className="text-[10px] uppercase font-mono text-cyan-400 block mb-0.5">Step 9</span>
          <span className="font-semibold text-slate-100 group-hover:text-cyan-300 transition-colors">
            Perform Receiver Modulo-2 Division (T' ÷ G)
          </span>
        </button>
        <ArrowDown className="w-4 h-4 text-slate-500" />

        {/* Decision Diamond: Is Remainder Zero? */}
        <div className="w-56 p-3.5 rounded-xl bg-purple-950/40 border-2 border-purple-500/70 text-center shadow-md shadow-purple-950/40">
          <span className="font-mono text-[10px] text-purple-300 block uppercase font-bold">
            Condition Check
          </span>
          <span className="text-sm font-extrabold text-white">
            Is Remainder = 00...0?
          </span>
        </div>

        {/* Branching Yes / No */}
        <div className="w-full max-w-lg grid grid-cols-2 gap-6 pt-2">
          {/* YES Branch */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-1 text-emerald-400 font-bold font-mono text-xs">
              <span>YES</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div
              className={`w-full p-3.5 rounded-lg border text-center transition-all ${
                isErrorFree
                  ? 'bg-emerald-950/60 border-emerald-500 text-emerald-300 shadow-md shadow-emerald-900/30 ring-2 ring-emerald-500/30'
                  : 'bg-[#0B1120] border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>No Error Detected</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Codeword accepted by receiver link layer.
              </p>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
            <div className="px-4 py-1 rounded-full bg-emerald-950 border border-emerald-700/60 text-emerald-400 font-mono text-[10px] font-bold">
              FRAME ACCEPTED
            </div>
          </div>

          {/* NO Branch */}
          <div className="flex flex-col items-center space-y-2">
            <div className="flex items-center gap-1 text-red-400 font-bold font-mono text-xs">
              <span>NO</span>
              <ArrowDown className="w-3.5 h-3.5" />
            </div>

            <div
              className={`w-full p-3.5 rounded-lg border text-center transition-all ${
                !isErrorFree
                  ? 'bg-red-950/60 border-red-500 text-red-300 shadow-md shadow-red-900/30 ring-2 ring-red-500/30'
                  : 'bg-[#0B1120] border-slate-800 text-slate-500 opacity-60'
              }`}
            >
              <div className="flex items-center justify-center gap-1.5 font-bold mb-1">
                <XCircle className="w-4 h-4 text-red-400" />
                <span>Error Detected</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                Codeword discarded. Request retransmission.
              </p>
            </div>

            <ArrowDown className="w-3.5 h-3.5 text-slate-600" />
            <div className="px-4 py-1 rounded-full bg-red-950 border border-red-700/60 text-red-400 font-mono text-[10px] font-bold">
              FRAME DROPPED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
