import React, { useState } from 'react';
import { Play, RotateCcw, HelpCircle, Check, AlertCircle, Dna, Shuffle } from 'lucide-react';
import { binaryToPolynomial, validateBinaryString, validateGenerator } from '../utils/crcEngine';
import { PresetExample } from '../types';

interface InputConfigProps {
  dataBits: string;
  setDataBits: (val: string) => void;
  generator: string;
  setGenerator: (val: string) => void;
  onGenerate: () => void;
  onReset: () => void;
}

export const PRESET_EXAMPLES: PresetExample[] = [
  {
    id: 'test-1',
    name: 'Example 1 (Primary)',
    data: '1101011011',
    generator: '10011',
    description: 'Degree 4 generator (x⁴ + x + 1), 10-bit data. Standard educational benchmark.',
    standard: 'CRC-4 (ITU-T G.704)'
  },
  {
    id: 'test-2',
    name: 'Example 2 (Degree 3)',
    data: '1011001',
    generator: '1101',
    description: 'Degree 3 generator (x³ + x² + 1), 7-bit message.',
    standard: 'CRC-3'
  },
  {
    id: 'test-3',
    name: 'Example 3 (Compact)',
    data: '100110',
    generator: '1011',
    description: 'Degree 3 generator (x³ + x + 1), 6-bit message.',
    standard: 'CRC-3 Parity'
  },
  {
    id: 'crc-8-atm',
    name: 'CRC-8 ATM',
    data: '11010010',
    generator: '100000111',
    description: 'x⁸ + x² + x + 1. Used in ATM cell header error control (HEC).',
    standard: 'ITU-T I.432.1'
  },
  {
    id: 'crc-5-usb',
    name: 'CRC-5 USB',
    data: '10101010101',
    generator: '100101',
    description: 'x⁵ + x² + 1. Used in USB token packets.',
    standard: 'USB 2.0'
  }
];

export const InputConfig: React.FC<InputConfigProps> = ({
  dataBits,
  setDataBits,
  generator,
  setGenerator,
  onGenerate,
  onReset,
}) => {
  const [selectedPreset, setSelectedPreset] = useState<string>('test-1');

  // Validations
  const dataValidation = validateBinaryString(dataBits);
  const genValidation = validateGenerator(generator);
  const isValid = dataValidation.isValid && genValidation.isValid;

  const degree = generator.length > 1 ? generator.length - 1 : 0;
  const polyForm = genValidation.isValid ? binaryToPolynomial(generator) : 'Invalid';

  const handleSelectPreset = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    setSelectedPreset(pId);
    const found = PRESET_EXAMPLES.find((p) => p.id === pId);
    if (found) {
      setDataBits(found.data);
      setGenerator(found.generator);
    }
  };

  const handleApplyPresetButton = (p: PresetExample) => {
    setSelectedPreset(p.id);
    setDataBits(p.data);
    setGenerator(p.generator);
  };

  const handleRandomData = () => {
    const len = Math.floor(Math.random() * 6) + 6; // 6 to 11 bits
    let str = '1'; // start with 1
    for (let i = 1; i < len; i++) {
      str += Math.random() > 0.5 ? '1' : '0';
    }
    setDataBits(str);
  };

  return (
    <section id="configuration" className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-7 space-y-6">
      {/* Header & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <span>Input Configuration & Polynomial Setup</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Define binary message data and generator divisor polynomial.
          </p>
        </div>

        {/* Quick Preset Selector */}
        <div className="flex items-center gap-2">
          <label htmlFor="preset-select" className="text-xs text-slate-400 shrink-0">
            Presets:
          </label>
          <select
            id="preset-select"
            value={selectedPreset}
            onChange={handleSelectPreset}
            className="bg-[#0B1120] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-sans cursor-pointer"
          >
            {PRESET_EXAMPLES.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.standard || p.generator})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Preset Fast Click Pills */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 mr-1">Quick Load:</span>
        {PRESET_EXAMPLES.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => handleApplyPresetButton(p)}
            className={`text-xs px-2.5 py-1 rounded border transition-colors whitespace-nowrap ${
              dataBits === p.data && generator === p.generator
                ? 'bg-blue-600/20 border-blue-500 text-cyan-300'
                : 'bg-[#0B1120] border-slate-700/80 text-slate-400 hover:text-slate-200 hover:border-slate-600'
            }`}
          >
            {p.name.replace(' (Primary)', '')}
          </button>
        ))}
      </div>

      {/* Two Main Inputs: Data Bits and Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Data Bits Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 tracking-wide flex items-center gap-1.5">
              <span>1. Binary Data Bits (Message Payload D)</span>
              <span className="text-[11px] text-slate-400 font-normal">
                ({dataBits.length} bits)
              </span>
            </label>
            <button
              onClick={handleRandomData}
              type="button"
              className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
              title="Generate random binary payload"
            >
              <Shuffle className="w-3 h-3" />
              <span>Random</span>
            </button>
          </div>

          <div className="relative">
            <input
              type="text"
              value={dataBits}
              onChange={(e) => setDataBits(e.target.value.replace(/[^01]/g, ''))}
              placeholder="e.g. 1101011011"
              className={`w-full bg-[#0B1120] border ${
                dataValidation.isValid ? 'border-slate-700 focus:border-blue-500' : 'border-red-500/80'
              } text-white font-mono text-sm sm:text-base tracking-widest px-3.5 py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-slate-600`}
              maxLength={32}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Accepts only binary <code className="text-blue-400 font-mono">0</code> and <code className="text-blue-400 font-mono">1</code></span>
            {!dataValidation.isValid && (
              <span className="text-red-400 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {dataValidation.error}
              </span>
            )}
          </div>
        </div>

        {/* Generator Polynomial Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-200 tracking-wide flex items-center gap-1.5">
              <span>2. Generator Polynomial (Divisor G)</span>
              <span className="text-[11px] text-cyan-400 font-normal">
                (Degree r = {degree})
              </span>
            </label>
            <span className="text-[11px] text-slate-400">
              Must begin with '1'
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={generator}
              onChange={(e) => setGenerator(e.target.value.replace(/[^01]/g, ''))}
              placeholder="e.g. 10011"
              className={`w-full bg-[#0B1120] border ${
                genValidation.isValid ? 'border-slate-700 focus:border-cyan-500' : 'border-red-500/80'
              } text-cyan-300 font-mono text-sm sm:text-base tracking-widest px-3.5 py-2.5 rounded-lg focus:outline-none transition-all placeholder:text-slate-600`}
              maxLength={17}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="font-mono text-[11px] text-cyan-400/90 truncate max-w-[280px]">
              G(x) = {polyForm}
            </div>
            {!genValidation.isValid && (
              <span className="text-red-400 text-[11px] flex items-center gap-1">
                <AlertCircle className="w-3 h-3" />
                {genValidation.error}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Real-Time Mathematical Parameter Breakdown */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-mono">Message Bits (k)</span>
          <span className="text-slate-200 font-mono font-semibold text-sm">{dataBits.length} bits</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-mono">Generator Degree (r)</span>
          <span className="text-cyan-400 font-mono font-semibold text-sm">{degree} (r = m - 1)</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-mono">Padded Zeros</span>
          <span className="text-amber-400 font-mono font-semibold text-sm">{degree} zeros</span>
        </div>
        <div>
          <span className="text-slate-500 block text-[10px] uppercase font-mono">Padded Dividend Length</span>
          <span className="text-blue-400 font-mono font-semibold text-sm">{dataBits.length + degree} bits</span>
        </div>
      </div>

      {/* Action Buttons: Generate CRC, Load Preset, Reset */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onGenerate}
            disabled={!isValid}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all shadow-sm ${
              isValid
                ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20 cursor-pointer active:scale-[0.98]'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Generate CRC & Run Simulation</span>
          </button>

          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-[#0B1120] hover:bg-slate-800 border border-slate-700/80 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span>Reset Inputs</span>
          </button>
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>Real-time local calculation (zero network delay)</span>
        </div>
      </div>
    </section>
  );
};
