import React from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  Shuffle, 
  Zap, 
  CheckCircle, 
  Activity,
  Layers,
  ArrowRight
} from 'lucide-react';
import { binaryToPolynomial } from '../utils/crcEngine';

interface ErrorInjectorProps {
  originalCodeword: string;
  dataLength: number;
  receivedCodeword: string;
  setReceivedCodeword: (val: string) => void;
}

export const ErrorInjector: React.FC<ErrorInjectorProps> = ({
  originalCodeword,
  dataLength,
  receivedCodeword,
  setReceivedCodeword,
}) => {
  // Compute flipped indices
  const flippedIndices: number[] = [];
  for (let i = 0; i < originalCodeword.length; i++) {
    if (originalCodeword[i] !== receivedCodeword[i]) {
      flippedIndices.push(i);
    }
  }

  const hasErrors = flippedIndices.length > 0;

  // Toggle specific bit
  const handleToggleBit = (index: number) => {
    const chars = receivedCodeword.split('');
    chars[index] = chars[index] === '1' ? '0' : '1';
    setReceivedCodeword(chars.join(''));
  };

  // Inject single random error
  const handleRandomError = () => {
    const len = originalCodeword.length;
    const randomIdx = Math.floor(Math.random() * len);
    handleToggleBit(randomIdx);
  };

  // Inject 2-bit burst error
  const handleBurstError = () => {
    const len = originalCodeword.length;
    if (len < 2) return;
    const startIdx = Math.floor(Math.random() * (len - 1));
    const chars = receivedCodeword.split('');
    chars[startIdx] = chars[startIdx] === '1' ? '0' : '1';
    chars[startIdx + 1] = chars[startIdx + 1] === '1' ? '0' : '1';
    setReceivedCodeword(chars.join(''));
  };

  // Reset errors back to original codeword
  const handleResetErrors = () => {
    setReceivedCodeword(originalCodeword);
  };

  // Calculate error polynomial E(x)
  let errorBitPattern = '';
  for (let i = 0; i < originalCodeword.length; i++) {
    errorBitPattern += originalCodeword[i] !== receivedCodeword[i] ? '1' : '0';
  }
  const errorPoly = binaryToPolynomial(errorBitPattern);

  return (
    <section id="error-injection" className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-7 space-y-6">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Noise Simulation Lab
            </span>
            <span className="text-slate-500 font-mono text-xs">·</span>
            <span className="text-xs text-slate-400">Channel Interference & Inversion</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Transmission Error Injection Simulator
          </h2>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRandomError}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 border border-amber-700/60 transition-colors"
            title="Flip one random bit"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Random Error</span>
          </button>

          <button
            onClick={handleBurstError}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-700/60 transition-colors"
            title="Flip two adjacent bits to simulate burst noise"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>2-Bit Burst Error</span>
          </button>

          <button
            onClick={handleResetErrors}
            disabled={!hasErrors}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              hasErrors
                ? 'text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-600'
                : 'text-slate-600 bg-slate-900 border border-slate-800 cursor-not-allowed'
            }`}
            title="Restore original codeword without bit errors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Errors</span>
          </button>
        </div>
      </div>

      {/* Instructions & Interactive Bit Selector Grid */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
          <span className="text-slate-300">
            Click any bit block below to simulate channel noise by flipping <strong className="font-mono text-cyan-400">0 ↔ 1</strong>:
          </span>
          <span className="font-mono text-slate-400">
            {flippedIndices.length === 0 ? (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5" /> Clean Channel (0 bit flips)
              </span>
            ) : (
              <span className="text-red-400 flex items-center gap-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                {flippedIndices.length} {flippedIndices.length === 1 ? 'bit error' : 'bit errors'} injected
              </span>
            )}
          </span>
        </div>

        {/* Interactive Bit Buttons */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max pb-1">
            {receivedCodeword.split('').map((bit, idx) => {
              const isFlipped = flippedIndices.includes(idx);
              const isDataBit = idx < dataLength;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleToggleBit(idx)}
                  className={`flex flex-col items-center gap-1 p-1 rounded-xl transition-all cursor-pointer group focus:outline-none ${
                    isFlipped
                      ? 'bg-red-950/60 border border-red-500 scale-105 shadow-md shadow-red-500/20'
                      : 'hover:bg-slate-800/80 border border-transparent'
                  }`}
                  title={`Click to flip bit #${idx} (Current: ${bit}, Original: ${originalCodeword[idx]})`}
                >
                  <div
                    className={`w-9 h-11 rounded-lg flex items-center justify-center font-mono text-base font-bold transition-all ${
                      isFlipped
                        ? 'bg-red-600 text-white animate-pulse'
                        : isDataBit
                        ? 'bg-blue-950/70 text-blue-300 border border-blue-800/60 group-hover:border-blue-400'
                        : 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60 group-hover:border-emerald-400'
                    }`}
                  >
                    {bit}
                  </div>
                  <span
                    className={`text-[10px] font-mono ${
                      isFlipped ? 'text-red-400 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {isFlipped ? 'FLIPPED' : `#${idx}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Side-by-Side Codeword Comparison & Error Vector */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Codeword Card */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Original Transmitted Codeword C(x)</span>
            <span className="font-mono text-blue-400 text-[11px]">{originalCodeword.length} bits</span>
          </div>
          <div className="font-mono text-sm sm:text-base tracking-widest text-slate-200 bg-slate-900/80 border border-slate-800 rounded px-3 py-2 overflow-x-auto">
            {originalCodeword}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <span>Data Payload: <span className="font-mono text-blue-300">{originalCodeword.slice(0, dataLength)}</span></span>
            <span>·</span>
            <span>FCS: <span className="font-mono text-emerald-300">{originalCodeword.slice(dataLength)}</span></span>
          </div>
        </div>

        {/* Corrupted Received Codeword Card */}
        <div className={`bg-[#0B1120] border ${hasErrors ? 'border-red-900/60 bg-red-950/10' : 'border-slate-800'} rounded-lg p-4 space-y-2 transition-colors`}>
          <div className="flex items-center justify-between text-xs">
            <span className={`${hasErrors ? 'text-red-300' : 'text-slate-400'} font-medium`}>
              Received Codeword at RX Buffer C'(x)
            </span>
            <span className={`font-mono text-[11px] ${hasErrors ? 'text-red-400' : 'text-emerald-400'}`}>
              {hasErrors ? 'CORRUPTED' : 'CLEAN'}
            </span>
          </div>
          <div className="font-mono text-sm sm:text-base tracking-widest bg-slate-900/80 border border-slate-800 rounded px-3 py-2 overflow-x-auto flex items-center gap-1">
            {receivedCodeword.split('').map((bit, idx) => {
              const isFlipped = flippedIndices.includes(idx);
              return (
                <span
                  key={idx}
                  className={`font-bold ${
                    isFlipped
                      ? 'text-red-400 bg-red-950/80 px-1 rounded underline decoration-red-500'
                      : 'text-slate-200'
                  }`}
                >
                  {bit}
                </span>
              );
            })}
          </div>
          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>
              {hasErrors
                ? `Altered at index: ${flippedIndices.map((i) => `#${i}`).join(', ')}`
                : 'Identical to transmitted codeword'}
            </span>
            {hasErrors && (
              <span className="font-mono text-red-400/90 text-[10px]">
                E(x) = {errorPoly}
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
