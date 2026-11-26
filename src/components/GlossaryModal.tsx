import React from 'react';
import { X, BookOpen, ExternalLink, HelpCircle } from 'lucide-react';
import { GlossaryTerm } from '../types';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    term: 'Cyclic Redundancy Check (CRC)',
    shortDesc: 'A non-secure, high-speed hash function designed specifically to detect accidental changes to digital data.',
    detailedDesc: 'Treats binary messages as coefficients of a polynomial over Galois Field GF(2). By dividing the message by an irreducible or generator polynomial and transmitting the remainder, receivers can detect single-bit, double-bit, and burst transmission errors.',
    networkRelevance: 'Ubiquitous in Ethernet (IEEE 802.3), Wi-Fi (802.11), Bluetooth, USB, SATA hard drive controllers, and PNG image checksums.'
  },
  {
    term: 'Modulo-2 Arithmetic',
    shortDesc: 'Binary arithmetic where addition and subtraction are identical and equivalent to bitwise XOR.',
    detailedDesc: 'Operates in the field GF(2). Because 1 + 1 = 0 (no carry) and 0 - 1 = 1 (no borrow), arithmetic is vastly simplified. It avoids carry-lookahead delays, allowing silicon to calculate remainders at multi-gigabit speeds.',
    formula: 'a ⊕ b = (a + b) mod 2',
    networkRelevance: 'Eliminates propagation delays in network switch ASICs and physical layer physical transceivers (PHY).'
  },
  {
    term: 'Generator Polynomial G(x)',
    shortDesc: 'A predetermined binary divisor shared by both sender and receiver.',
    detailedDesc: 'Must start and end with a 1 (high-order and x⁰ term). The selection of G(x) determines the error-detecting properties of the code, including maximum detectable burst error length and double-bit error detection distance.',
    formula: 'Degree r = length(G) - 1',
    networkRelevance: 'Standardized by ITU, IEEE, and ANSI (e.g. CRC-32 used in Ethernet: x³² + x²⁶ + x²³ + ... + 1).'
  },
  {
    term: 'Frame Check Sequence (FCS) / Remainder',
    shortDesc: 'The r-bit remainder resulting from modulo-2 division of the padded data by G(x).',
    detailedDesc: 'Appended directly to the payload before transmission. Because T(x) = D(x)·xʳ ⊕ R(x), T(x) is guaranteed to be divisible by G(x) with remainder 0.',
    formula: 'R(x) = [D(x) · xʳ] mod G(x)',
    networkRelevance: 'Appended at the tail of every Layer 2 data link frame (e.g. Ethernet 4-byte FCS).'
  },
  {
    term: 'Syndrome',
    shortDesc: 'The remainder produced when the receiver divides the incoming frame by G(x).',
    detailedDesc: 'If the incoming frame equals the transmitted frame, the syndrome S(x) is strictly 00...0. If channel noise corrupted the frame with error vector E(x), then S(x) = E(x) mod G(x).',
    formula: 'S(x) = T\'(x) mod G(x) = E(x) mod G(x)',
    networkRelevance: 'Receiver checks if S = 0. If S ≠ 0, the NIC drops the corrupted frame and signals an error counter.'
  },
  {
    term: 'Burst Error',
    shortDesc: 'A sequence of two or more contiguous bits where the first and last bits are corrupted.',
    detailedDesc: 'Caused in real physical media by electromagnetic interference, lightning strikes, motor arcing, or voltage drops. A CRC of degree r detects 100% of all burst errors of length ≤ r.',
    formula: 'Burst length L ≤ r guarantees detection',
    networkRelevance: 'Primary reason why CRC is preferred over simple one-dimensional checksums (such as IP checksum).'
  },
  {
    term: 'Linear Feedback Shift Register (LFSR)',
    shortDesc: 'A shift register whose input bit is a linear function (XOR) of its previous state.',
    detailedDesc: 'The hardware implementation of modulo-2 polynomial division. As message bits are clocked in serially, XOR taps corresponding to the polynomial coefficients compute the remainder in real time without software overhead.',
    networkRelevance: 'Enables line-rate 10Gbps/100Gbps checksum verification in network hardware.'
  }
];

export const GlossaryModal: React.FC<GlossaryModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#111C32] border border-slate-700/80 rounded-2xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#0B1120]/80">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">CRC Technical Glossary & Formulations</h3>
              <p className="text-xs text-slate-400">Networking and coding theory fundamentals</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            title="Close glossary"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 divide-y divide-slate-800/80 text-xs">
          {GLOSSARY_TERMS.map((item, idx) => (
            <div key={idx} className={idx > 0 ? 'pt-4 space-y-1.5' : 'space-y-1.5'}>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-cyan-300 font-sans tracking-tight">
                  {item.term}
                </h4>
                {item.formula && (
                  <span className="font-mono text-[11px] text-amber-300 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800/60">
                    {item.formula}
                  </span>
                )}
              </div>
              <p className="text-slate-300 font-medium leading-relaxed">
                {item.shortDesc}
              </p>
              <p className="text-slate-400 leading-relaxed">
                {item.detailedDesc}
              </p>
              <div className="pt-1 flex items-start gap-1.5 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-400 shrink-0">Real-World Standard:</span>
                <span className="text-blue-300/90">{item.networkRelevance}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#0B1120] flex items-center justify-between text-xs text-slate-400">
          <span>Galois Field GF(2) Polynomial Arithmetic</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs transition-colors cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
