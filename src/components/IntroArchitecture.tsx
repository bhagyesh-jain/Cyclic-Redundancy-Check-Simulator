import React from 'react';
import { ArrowRight, ShieldCheck, Binary, Activity, Radio, Cpu, Layers } from 'lucide-react';

export const IntroArchitecture: React.FC = () => {
  return (
    <section id="overview" className="space-y-6 pt-2">
      {/* Top Banner / Conceptual Title */}
      <div className="bg-[#111C32] border border-slate-800 rounded-xl p-6 lg:p-8 relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-cyan-400 uppercase mb-2">
            <span>Data Link Layer Protocol</span>
            <span aria-hidden="true">·</span>
            <span>Error Detection Code</span>
            <span aria-hidden="true">·</span>
            <span>Polynomial Arithmetic</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
            Cyclic Redundancy Check (CRC) Laboratory
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base leading-relaxed max-w-3xl">
            A high-speed mathematical verification algorithm implemented in hardware and network protocols 
            (Ethernet 802.3, Wi-Fi, SATA, USB). It treats digital data streams as polynomials over GF(2) 
            and computes a parity checksum through modulo-2 binary division without carries or borrows.
          </p>

          {/* Core 3 Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800/80">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Binary className="w-4 h-4 text-blue-400" />
                <span>What is CRC?</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                An error-detecting code based on polynomial division. The sender appends a fixed-length remainder 
                so the resulting codeword is exactly divisible by a predetermined generator polynomial.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Activity className="w-4 h-4 text-cyan-400" />
                <span>Why is it Used?</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                Unmatched efficiency in catching transmission bursts caused by signal attenuation, cosmic rays, 
                and thermal noise. It executes in silicon at line rate using simple XOR shift registers.
              </p>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>How Errors Are Caught</span>
              </div>
              <p className="text-xs text-slate-400 leading-normal">
                The receiver divides the incoming frame by the identical generator polynomial. If the remainder 
                (syndrome) is non-zero, data corruption has occurred during transit.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Pipeline: Sender -> Encoder -> Communication Channel -> Decoder -> Receiver */}
      <div className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white tracking-wide uppercase">
              End-to-End CRC Transmission Architecture
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Interactive pipeline representation
          </span>
        </div>

        {/* Pipeline Diagram */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 relative items-stretch">
          {/* Node 1: Sender */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between group hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono text-[10px] text-blue-400">STAGE 1</span>
                <span>TX Node</span>
              </div>
              <h3 className="text-sm font-bold text-white">Sender</h3>
              <p className="text-xs text-slate-400 mt-1">Generates raw binary payload <span className="font-mono text-blue-300">D</span></p>
            </div>
            <div className="mt-3 py-1.5 px-2 bg-slate-900/90 rounded border border-slate-800 font-mono text-[11px] text-blue-400 text-center">
              Message: D(x)
            </div>
          </div>

          {/* Node 2: CRC Encoder */}
          <div className="bg-[#0B1120] border border-blue-900/60 rounded-lg p-3.5 flex flex-col justify-between group hover:border-cyan-500/50 transition-colors relative">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono text-[10px] text-cyan-400">STAGE 2</span>
                <span>Modulo-2 Math</span>
              </div>
              <h3 className="text-sm font-bold text-cyan-300">CRC Encoder</h3>
              <p className="text-xs text-slate-400 mt-1">Appends zeros & computes XOR remainder <span className="font-mono text-emerald-300">R</span></p>
            </div>
            <div className="mt-3 py-1.5 px-2 bg-blue-950/40 rounded border border-blue-800/60 font-mono text-[11px] text-cyan-300 text-center">
              Codeword = D + R
            </div>
          </div>

          {/* Node 3: Communication Channel */}
          <div className="bg-[#0B1120] border border-amber-900/50 rounded-lg p-3.5 flex flex-col justify-between group hover:border-amber-500/50 transition-colors relative">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono text-[10px] text-amber-400">STAGE 3</span>
                <span>Physical Media</span>
              </div>
              <h3 className="text-sm font-bold text-amber-300">Channel / Bus</h3>
              <p className="text-xs text-slate-400 mt-1">Subject to electrical noise & bit flips <span className="font-mono text-red-400">E(x)</span></p>
            </div>
            <div className="mt-3 py-1.5 px-2 bg-amber-950/40 rounded border border-amber-800/60 font-mono text-[11px] text-amber-300 text-center">
              Received = C ⊕ E
            </div>
          </div>

          {/* Node 4: CRC Decoder */}
          <div className="bg-[#0B1120] border border-purple-900/50 rounded-lg p-3.5 flex flex-col justify-between group hover:border-purple-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono text-[10px] text-purple-400">STAGE 4</span>
                <span>Syndrome Check</span>
              </div>
              <h3 className="text-sm font-bold text-purple-300">CRC Decoder</h3>
              <p className="text-xs text-slate-400 mt-1">Divides incoming packet by <span className="font-mono text-cyan-300">G(x)</span></p>
            </div>
            <div className="mt-3 py-1.5 px-2 bg-purple-950/40 rounded border border-purple-800/60 font-mono text-[11px] text-purple-300 text-center">
              Remainder S(x)
            </div>
          </div>

          {/* Node 5: Receiver */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between group hover:border-emerald-500/50 transition-colors">
            <div>
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                <span className="font-mono text-[10px] text-emerald-400">STAGE 5</span>
                <span>RX Node</span>
              </div>
              <h3 className="text-sm font-bold text-white">Receiver</h3>
              <p className="text-xs text-slate-400 mt-1">Accepts frame if <span className="font-mono text-emerald-400">S = 0</span>, drops if <span className="font-mono text-red-400">S ≠ 0</span></p>
            </div>
            <div className="mt-3 py-1.5 px-2 bg-slate-900/90 rounded border border-slate-800 font-mono text-[11px] text-emerald-400 text-center">
              Accept / Reject
            </div>
          </div>
        </div>

        {/* Animated Flow Arrow Line */}
        <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400 overflow-x-auto">
          <div className="flex items-center gap-1.5 shrink-0 text-blue-400">
            <span>Raw Data Payload</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-cyan-400">
            <span>Appended Frame Check Sequence (FCS)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-amber-400">
            <span>Physical Transit & Noise</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
          <div className="flex items-center gap-1.5 shrink-0 text-emerald-400">
            <span>Zero Remainder = Validated</span>
          </div>
        </div>
      </div>
    </section>
  );
};
