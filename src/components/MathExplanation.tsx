import React, { useState } from 'react';
import { BookOpen, HelpCircle, Code, Cpu, Calculator, Check, ArrowRight } from 'lucide-react';

export const MathExplanation: React.FC = () => {
  const [xorA, setXorA] = useState<'0' | '1'>('1');
  const [xorB, setXorB] = useState<'0' | '1'>('1');

  const xorResult = xorA === xorB ? '0' : '1';

  return (
    <section id="theory" className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-7 space-y-6">
      {/* Title */}
      <div className="pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
            Theoretical Foundations
          </span>
          <span className="text-slate-500 font-mono text-xs">·</span>
          <span className="text-xs text-slate-400">Galois Field GF(2) Mathematics</span>
        </div>
        <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
          Mathematical Explanation & Modulo-2 Arithmetic
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* XOR Truth Table & Interactive Sandbox */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span>1. Exclusive OR (XOR) Truth Table</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Symbol: ⊕</span>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            In modulo-2 arithmetic, addition and subtraction are identical and equivalent to the bitwise <strong>XOR</strong> operation. 
            There are <em>no carries</em> in addition and <em>no borrows</em> in subtraction.
          </p>

          {/* Truth Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono text-center border-collapse">
              <thead>
                <tr className="bg-slate-900 text-slate-400 border-b border-slate-800">
                  <th className="py-2 px-3">Input A</th>
                  <th className="py-2 px-3">Input B</th>
                  <th className="py-2 px-3 text-cyan-300 font-bold">A ⊕ B (Output)</th>
                  <th className="py-2 px-3 text-slate-500 font-sans font-normal text-left">Logical Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                <tr className={xorA === '0' && xorB === '0' ? 'bg-blue-950/40 text-cyan-300' : 'text-slate-300'}>
                  <td className="py-2 font-bold">0</td>
                  <td className="py-2 font-bold">0</td>
                  <td className="py-2 font-bold text-cyan-400">0</td>
                  <td className="py-2 text-slate-400 font-sans text-left text-[11px]">Same bits → 0</td>
                </tr>
                <tr className={xorA === '0' && xorB === '1' ? 'bg-blue-950/40 text-cyan-300' : 'text-slate-300'}>
                  <td className="py-2 font-bold">0</td>
                  <td className="py-2 font-bold">1</td>
                  <td className="py-2 font-bold text-cyan-400">1</td>
                  <td className="py-2 text-slate-400 font-sans text-left text-[11px]">Different bits → 1</td>
                </tr>
                <tr className={xorA === '1' && xorB === '0' ? 'bg-blue-950/40 text-cyan-300' : 'text-slate-300'}>
                  <td className="py-2 font-bold">1</td>
                  <td className="py-2 font-bold">0</td>
                  <td className="py-2 font-bold text-cyan-400">1</td>
                  <td className="py-2 text-slate-400 font-sans text-left text-[11px]">Different bits → 1</td>
                </tr>
                <tr className={xorA === '1' && xorB === '1' ? 'bg-blue-950/40 text-cyan-300' : 'text-slate-300'}>
                  <td className="py-2 font-bold">1</td>
                  <td className="py-2 font-bold">1</td>
                  <td className="py-2 font-bold text-cyan-400">0</td>
                  <td className="py-2 text-slate-400 font-sans text-left text-[11px]">Same bits (1+1=0 mod 2)</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Interactive XOR Tester */}
          <div className="bg-[#111C32] border border-slate-800 rounded-lg p-3 space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 block">
              Interactive XOR Gate Sandbox:
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setXorA(xorA === '1' ? '0' : '1')}
                className="px-3 py-1.5 rounded bg-blue-950 border border-blue-500 font-mono text-sm font-bold text-blue-300 hover:bg-blue-900 transition-colors cursor-pointer"
                title="Click to toggle Input A"
              >
                A = {xorA}
              </button>
              <span className="text-cyan-400 font-mono font-bold">⊕</span>
              <button
                onClick={() => setXorB(xorB === '1' ? '0' : '1')}
                className="px-3 py-1.5 rounded bg-blue-950 border border-blue-500 font-mono text-sm font-bold text-blue-300 hover:bg-blue-900 transition-colors cursor-pointer"
                title="Click to toggle Input B"
              >
                B = {xorB}
              </button>
              <span className="text-slate-500 font-mono font-bold">=</span>
              <div className="px-4 py-1.5 rounded bg-cyan-950 border border-cyan-400 font-mono text-sm font-extrabold text-cyan-300">
                Output = {xorResult}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 block">
              Click the boxes above to test truth table outputs dynamically.
            </span>
          </div>
        </div>

        {/* Why XOR instead of subtraction? */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>2. Why XOR Instead of Decimal Subtraction?</span>
            </h3>
            <span className="text-[11px] font-mono text-emerald-400">Hardware Efficiency</span>
          </div>

          <div className="space-y-2.5 text-xs text-slate-300 leading-relaxed">
            <p>
              In traditional integer division, subtraction requires <strong>borrow propagation</strong> across multiple 
              columns (e.g. subtracting 1 from 0 requires borrowing from higher-order bits), which creates substantial circuit delay.
            </p>

            <div className="bg-[#111C32] border border-slate-800 rounded-lg p-3 space-y-1.5 font-mono text-[11px]">
              <div className="text-emerald-400 font-semibold">Modulo-2 Properties in GF(2):</div>
              <div className="text-slate-300">1 + 1 = 0 (No carry)</div>
              <div className="text-slate-300">0 - 1 = 1 (No borrow, because -1 ≡ 1 mod 2)</div>
              <div className="text-slate-300">Therefore: Addition ≡ Subtraction ≡ XOR</div>
            </div>

            <p>
              Because each bit operation is completely independent of neighboring bits, modulo-2 division can be 
              computed in digital hardware (FPGAs, ASICs, network controllers) at line rate (10 Gbps+) using simple 
              <strong>Linear Feedback Shift Registers (LFSR)</strong> with zero propagation delays.
            </p>
          </div>
        </div>
      </div>

      {/* Deep Dive Cards: Polynomials & LFSR */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-4 space-y-2">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="text-blue-400">P(x)</span>
            <span>Polynomial Representation</span>
          </h4>
          <p className="text-xs text-slate-400 leading-normal">
            Any binary string b[k]b[k-1]...b[0] maps to a polynomial b_k x^k + b_(k-1) x^(k-1) + ... + b_0. 
            For example, <code className="text-cyan-300 font-mono">10011</code> represents x⁴ + x + 1.
          </p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-4 space-y-2">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="text-cyan-400">r = m - 1</span>
            <span>Degree & Appended Zeros</span>
          </h4>
          <p className="text-xs text-slate-400 leading-normal">
            If generator $G(x)$ has length $m$, its degree is $r = m - 1$. Multiplying the data by $x^r$ (appending $r$ zeros) 
            shifts the message bits to reserve the lower $r$ slots for the remainder checksum.
          </p>
        </div>

        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-4 space-y-2">
          <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
            <span className="text-emerald-400">T(x) ≡ 0</span>
            <span>Error Detection Principle</span>
          </h4>
          <p className="text-xs text-slate-400 leading-normal">
            By definition, $T(x) = D(x)\cdot x^r + R(x)$. When divided by $G(x)$, the remainder of $T(x)$ is mathematically 
            guaranteed to equal $0$. Any non-zero remainder proves that error polynomial $E(x) \neq 0$.
          </p>
        </div>
      </div>
    </section>
  );
};
