import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  AlertOctagon, 
  ChevronDown, 
  ChevronUp, 
  Cpu, 
  HelpCircle,
  Binary
} from 'lucide-react';
import { ReceiverVerificationResult } from '../utils/crcEngine';

interface ReceiverVerificationProps {
  verification: ReceiverVerificationResult;
}

export const ReceiverVerification: React.FC<ReceiverVerificationProps> = ({ verification }) => {
  const { receivedCodeword, generator, degree, remainder, isErrorFree, steps } = verification;
  const [showReceiverTrace, setShowReceiverTrace] = useState<boolean>(false);

  return (
    <section id="verification" className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-7 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">
              Receiver Verification & Syndrome Analysis
            </span>
            <span className="text-slate-500 font-mono text-xs">·</span>
            <span className="text-xs text-slate-400">RX Modulo-2 Check</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Receiver-Side CRC Error Detection
          </h2>
        </div>

        <button
          onClick={() => setShowReceiverTrace(!showReceiverTrace)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0B1120] hover:bg-slate-800 border border-slate-700 transition-colors"
        >
          <Binary className="w-3.5 h-3.5 text-cyan-400" />
          <span>{showReceiverTrace ? 'Hide Receiver Division' : 'View Receiver Division Steps'}</span>
          {showReceiverTrace ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Main Verification Verdict Banner */}
      <div
        className={`rounded-xl p-5 border transition-all ${
          isErrorFree
            ? 'bg-emerald-950/30 border-emerald-500/50 shadow-lg shadow-emerald-950/20'
            : 'bg-red-950/30 border-red-500/60 shadow-lg shadow-red-950/20'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                isErrorFree
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-red-500/20 text-red-400 border border-red-500/40'
              }`}
            >
              {isErrorFree ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              ) : (
                <XCircle className="w-6 h-6 text-red-400" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h3
                  className={`text-base sm:text-lg font-bold tracking-tight ${
                    isErrorFree ? 'text-emerald-300' : 'text-red-300'
                  }`}
                >
                  {isErrorFree ? 'NO ERROR DETECTED (VERIFICATION PASSED)' : 'TRANSMISSION ERROR DETECTED (FRAME REJECTED)'}
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                {isErrorFree ? (
                  <>
                    The received codeword divides evenly by the generator polynomial{' '}
                    <strong className="font-mono text-cyan-300">{generator}</strong> with an exact remainder of zero.
                    The data payload passes the link-layer parity check.
                  </>
                ) : (
                  <>
                    Receiver modulo-2 division produced a non-zero remainder (syndrome). The received frame has been corrupted
                    by channel noise and would be discarded by the network interface (NIC), triggering an ARQ retransmission request.
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Syndrome / Remainder Box */}
          <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3 text-right shrink-0">
            <span className="text-[10px] text-slate-400 uppercase font-mono block">
              Receiver Remainder (Syndrome S)
            </span>
            <div className="flex items-center justify-end gap-2 mt-0.5">
              <span
                className={`font-mono text-lg font-extrabold tracking-widest ${
                  isErrorFree ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {remainder}
              </span>
              <span className="text-[11px] text-slate-500">({degree} bits)</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              {isErrorFree ? 'Syndrome = 0' : 'Syndrome ≠ 0'}
            </span>
          </div>
        </div>
      </div>

      {/* Critical Educational Note about CRC Properties */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-4 text-xs space-y-2">
        <div className="flex items-center gap-1.5 text-amber-300 font-semibold">
          <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Critical Theoretical Principle: Why Zero Remainder Doesn't Guarantee 100% Error-Free Transmission</span>
        </div>
        <p className="text-slate-300 leading-relaxed">
          In digital communications, a zero remainder means <em>no error was detected</em> by this specific generator polynomial.
          If an error pattern E(x) happens to be an exact multiple of the generator G(x), then (T(x) ⊕ E(x)) mod G(x) = 0,
          causing the error to slip through undetected. However, well-chosen generator polynomials (such as CRC-16 or CRC-32) guarantee:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-400 pt-1">
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>100% detection of all single-bit errors</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>100% detection of all double-bit errors (well-designed G(x))</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>100% detection of all odd-numbered bit errors (if G has (x+1) as factor)</span>
          </li>
          <li className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>100% detection of all burst errors of length ≤ r bits</span>
          </li>
        </ul>
      </div>

      {/* Collapsible Receiver Division Trace */}
      {showReceiverTrace && (
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-xs">
            <span className="font-semibold text-white">Receiver Modulo-2 Division Steps</span>
            <span className="font-mono text-slate-400">
              Dividend = {receivedCodeword} ({receivedCodeword.length} bits)
            </span>
          </div>

          <div className="overflow-x-auto font-mono text-xs">
            <div className="min-w-[600px] space-y-1.5">
              <div className="text-slate-400 flex items-center gap-2 mb-2">
                <span>Divisor:</span>
                <span className="text-cyan-400 font-bold">{generator}</span>
                <span className="text-slate-600">|</span>
                <span>Incoming Codeword:</span>
                <span className="text-white font-bold">{receivedCodeword}</span>
              </div>

              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-3 py-1 border-b border-slate-800/40 text-[11px]">
                  <span className="w-14 text-slate-500 shrink-0">Step {idx + 1}:</span>
                  <span className="w-20 text-blue-300 font-bold shrink-0">{step.dividendWindow}</span>
                  <span className="text-slate-500">⊕</span>
                  <span className="w-20 text-cyan-400 shrink-0">{step.divisor}</span>
                  <span className="text-slate-500">=</span>
                  <span className="w-20 text-emerald-300 font-semibold shrink-0">{step.remainderBeforeNext}</span>
                  <span className="text-slate-400 text-[10px] truncate">
                    {step.nextBit !== null ? `(bring down '${step.nextBit}')` : '(final step)'}
                  </span>
                </div>
              ))}

              <div className="pt-2 flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Final Calculated Remainder:</span>
                <span
                  className={`font-mono font-bold text-sm px-2 py-0.5 rounded ${
                    isErrorFree ? 'text-emerald-400 bg-emerald-950' : 'text-red-400 bg-red-950'
                  }`}
                >
                  {remainder}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
