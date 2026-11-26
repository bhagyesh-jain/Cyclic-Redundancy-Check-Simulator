import React, { useState } from 'react';
import { Send, ArrowRight, ShieldCheck, Radio, CheckCircle2, RefreshCw } from 'lucide-react';
import { CrcCalculationResult } from '../utils/crcEngine';

interface TransmissionChannelProps {
  calcResult: CrcCalculationResult;
  onTransmitted?: () => void;
}

export const TransmissionChannel: React.FC<TransmissionChannelProps> = ({
  calcResult,
  onTransmitted,
}) => {
  const { dataBits, remainder, codeword, degree } = calcResult;
  const [isTransmitting, setIsTransmitting] = useState<boolean>(false);
  const [transitProgress, setTransitProgress] = useState<number>(0);
  const [transitComplete, setTransitComplete] = useState<boolean>(true);

  const handleTransmit = () => {
    setIsTransmitting(true);
    setTransitProgress(0);
    setTransitComplete(false);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setTransitProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsTransmitting(false);
        setTransitComplete(true);
        if (onTransmitted) onTransmitted();
      }
    }, 50);
  };

  return (
    <section id="transmission" className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-7 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-400">
              Pipeline Stage 2 & 3
            </span>
            <span className="text-slate-500 font-mono text-xs">·</span>
            <span className="text-xs text-slate-400">Codeword Assembly & Physical Medium</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
            CRC Codeword Assembly & Channel Transmission
          </h2>
        </div>

        <button
          onClick={handleTransmit}
          disabled={isTransmitting}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
            isTransmitting
              ? 'bg-blue-600/50 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm shadow-blue-500/20 active:scale-[0.98]'
          }`}
        >
          {isTransmitting ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Transmitting Packet ({transitProgress}%)...</span>
            </>
          ) : (
            <>
              <Send className="w-3.5 h-3.5" />
              <span>Transmit Codeword Across Channel</span>
            </>
          )}
        </button>
      </div>

      {/* Assembly Formula */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
            Mathematical Codeword Construction
          </span>
          <div className="text-sm font-semibold text-white flex flex-wrap items-center gap-2 font-mono">
            <span className="text-blue-400">Data D ({dataBits.length} bits)</span>
            <span className="text-slate-500">+</span>
            <span className="text-emerald-400">Remainder R ({degree} bits)</span>
            <span className="text-slate-500">=</span>
            <span className="text-cyan-300">Codeword T(x) ({codeword.length} bits)</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-blue-500/40 border border-blue-400 inline-block" />
            <span className="text-slate-300">Data Bits</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500/40 border border-emerald-400 inline-block" />
            <span className="text-slate-300">CRC FCS Parity</span>
          </div>
        </div>
      </div>

      {/* Codeword Bit Block Representation */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Transmitted Codeword Block Structure</span>
          <span className="font-mono text-cyan-400">Total: {codeword.length} bits</span>
        </div>

        {/* Bit Cells */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 overflow-x-auto">
          <div className="flex items-center gap-1.5 min-w-max pb-1">
            {codeword.split('').map((bit, idx) => {
              const isData = idx < dataBits.length;
              return (
                <div key={idx} className="flex flex-col items-center gap-1">
                  <div
                    className={`w-9 h-11 rounded-lg flex items-center justify-center font-mono text-base font-bold shadow-sm transition-all ${
                      isData
                        ? 'bg-blue-950/80 text-blue-300 border border-blue-600/60 shadow-blue-900/20'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/70 shadow-emerald-900/20'
                    }`}
                  >
                    {bit}
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    #{idx}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Communication Channel Simulation Wire */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-white">Physical Transmission Channel</span>
          </div>
          <span className="text-slate-400">
            {isTransmitting ? 'Signal propagating...' : transitComplete ? 'Frame Delivered to RX Buffer' : 'Idle Channel'}
          </span>
        </div>

        {/* Transmission Track */}
        <div className="relative py-6">
          {/* Channel Wire Line */}
          <div className="h-1.5 w-full bg-slate-800 rounded-full relative overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-cyan-400 to-emerald-400 transition-all duration-75"
              style={{ width: `${transitProgress}%` }}
            />
          </div>

          {/* Moving Packet */}
          {isTransmitting && (
            <div
              className="absolute top-1/2 -translate-y-1/2 flex items-center gap-1 bg-cyan-950 border border-cyan-400 px-2.5 py-1 rounded-md shadow-lg shadow-cyan-500/30 transition-all duration-75"
              style={{ left: `calc(${transitProgress}% - 40px)` }}
            >
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="font-mono text-[11px] font-bold text-cyan-200 whitespace-nowrap">
                FCS Frame ({codeword.slice(0, 4)}...)
              </span>
            </div>
          )}

          {/* End Nodes */}
          <div className="flex items-center justify-between mt-3 text-xs">
            <div className="flex items-center gap-1.5 text-blue-400 font-medium">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span>TX Node (Sender Buffer)</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] hidden sm:flex">
              <span>Medium: Fiber / Copper Serial Bus (No carries, Modulo-2 XOR)</span>
            </div>

            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <div className={`w-2 h-2 rounded-full ${transitComplete ? 'bg-emerald-500' : 'bg-slate-700'}`} />
              <span>RX Node (Receiver Input)</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
