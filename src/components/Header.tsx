import React from 'react';
import { Cpu, RotateCcw, BookOpen, Sparkles } from 'lucide-react';
import { AppMode } from '../types';

interface HeaderProps {
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  onReset: () => void;
  onOpenGlossary: () => void;
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  onReset,
  onOpenGlossary,
  activeSection,
}) => {
  const navItems = [
    { id: 'overview', label: 'Overview' },
    { id: 'configuration', label: 'Inputs' },
    { id: 'division', label: 'XOR Division' },
    { id: 'transmission', label: 'Transmission' },
    { id: 'verification', label: 'Verification' },
    { id: 'flowchart', label: 'Flowchart' },
    { id: 'theory', label: 'Theory & Math' },
  ];

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0B1120]/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-cyan-400 shadow-sm shadow-blue-500/10">
            <Cpu className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-white font-sans">
                CRC LAB
              </span>
              <span className="hidden sm:inline-block text-[11px] font-medium tracking-wide text-cyan-400 bg-cyan-950/60 border border-cyan-800/60 rounded px-1.5 py-0.2">
                SIMULATOR
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden md:block">
              Cyclic Redundancy Check & Modulo-2 Laboratory
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollToSection(item.id)}
              className={`hover:text-cyan-400 transition-colors whitespace-nowrap shrink-0 text-xs tracking-wide py-1 ${
                activeSection === item.id
                  ? 'text-cyan-400 font-semibold border-b border-cyan-400'
                  : 'text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Primary Actions & Mode Selector */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mode Switcher */}
          <div className="flex items-center bg-[#111C32] border border-slate-700/80 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setMode('guided')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all whitespace-nowrap ${
                mode === 'guided'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Step-by-step interactive learning mode with animated playback"
            >
              Guided Mode
            </button>
            <button
              onClick={() => setMode('instant')}
              className={`px-2.5 py-1 rounded-md font-medium transition-all whitespace-nowrap ${
                mode === 'instant'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Instant calculation and live telemetry"
            >
              Instant Mode
            </button>
          </div>

          {/* Glossary Button */}
          <button
            onClick={onOpenGlossary}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#111C32] hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            title="Open technical glossary & formulas"
          >
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Glossary</span>
          </button>

          {/* Reset Button */}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-[#111C32] hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors whitespace-nowrap"
            title="Reset to default preset"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
