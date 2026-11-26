/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { Header } from './components/Header';
import { IntroArchitecture } from './components/IntroArchitecture';
import { InputConfig } from './components/InputConfig';
import { DivisionVisualizer } from './components/DivisionVisualizer';
import { TransmissionChannel } from './components/TransmissionChannel';
import { ErrorInjector } from './components/ErrorInjector';
import { ReceiverVerification } from './components/ReceiverVerification';
import { AlgorithmFlowchart } from './components/AlgorithmFlowchart';
import { MathExplanation } from './components/MathExplanation';
import { ResultsSummary } from './components/ResultsSummary';
import { GlossaryModal } from './components/GlossaryModal';
import { 
  calculateCRC, 
  verifyReceivedCodeword, 
  validateBinaryString, 
  validateGenerator 
} from './utils/crcEngine';
import { AppMode } from './types';
import { Cpu, ShieldCheck, Binary, Info } from 'lucide-react';

export default function App() {
  // Primary simulation inputs (Default: Benchmark Test 1)
  const [dataBits, setDataBits] = useState<string>('1101011011');
  const [generator, setGenerator] = useState<string>('10011');
  const [mode, setMode] = useState<AppMode>('guided');
  const [isGlossaryOpen, setIsGlossaryOpen] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('overview');

  // Validate inputs
  const isInputValid = useMemo(() => {
    return validateBinaryString(dataBits).isValid && validateGenerator(generator).isValid;
  }, [dataBits, generator]);

  // Sender Calculation Engine
  const calcResult = useMemo(() => {
    if (!isInputValid) {
      // Fallback safe calculation if currently typing invalid input
      return calculateCRC('1101011011', '10011');
    }
    return calculateCRC(dataBits, generator);
  }, [dataBits, generator, isInputValid]);

  // Transmission Channel & Error Injected Codeword
  const [receivedCodeword, setReceivedCodeword] = useState<string>(calcResult.codeword);

  // Sync received codeword whenever sender calculation changes
  useEffect(() => {
    setReceivedCodeword(calcResult.codeword);
  }, [calcResult.codeword]);

  // Receiver-Side Verification
  const verification = useMemo(() => {
    return verifyReceivedCodeword(receivedCodeword, calcResult.generator);
  }, [receivedCodeword, calcResult.generator]);

  // Reset to default Test 1
  const handleReset = () => {
    setDataBits('1101011011');
    setGenerator('10011');
    setReceivedCodeword('11010110111110');
  };

  const handleGenerate = () => {
    const el = document.getElementById('division');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-[#0B1120] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20 selection:text-cyan-300 tech-grid-bg">
      {/* Top Header & Navigation */}
      <Header
        mode={mode}
        setMode={setMode}
        onReset={handleReset}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Section B: Introduction Panel & Visual Architecture */}
        <IntroArchitecture />

        {/* Section C: Input Configuration Panel */}
        <InputConfig
          dataBits={dataBits}
          setDataBits={setDataBits}
          generator={generator}
          setGenerator={setGenerator}
          onGenerate={handleGenerate}
          onReset={handleReset}
        />

        {/* Section 5: Interactive XOR Long Division Visualizer (Core Feature) */}
        <DivisionVisualizer calcResult={calcResult} />

        {/* Section 6: Codeword Assembly & Channel Transmission */}
        <TransmissionChannel
          calcResult={calcResult}
          onTransmitted={() => {
            const el = document.getElementById('error-injection');
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }}
        />

        {/* Section 7: Error Injection Simulator */}
        <ErrorInjector
          originalCodeword={calcResult.codeword}
          dataLength={calcResult.dataBits.length}
          receivedCodeword={receivedCodeword}
          setReceivedCodeword={setReceivedCodeword}
        />

        {/* Section 8: Receiver-Side CRC Verification */}
        <ReceiverVerification verification={verification} />

        {/* Section 11: Real-Time Results & Summary Panel */}
        <ResultsSummary calcResult={calcResult} verification={verification} />

        {/* Section 10: Algorithm Flowchart */}
        <AlgorithmFlowchart
          isErrorFree={verification.isErrorFree}
          onSelectStage={(stageId) => setActiveSection(stageId)}
        />

        {/* Section 9: Mathematical Explanation Panel */}
        <MathExplanation />
      </main>

      {/* Technical Footer */}
      <footer className="border-t border-slate-800/80 bg-[#0B1120] py-6 px-4 sm:px-8 mt-12 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span className="font-semibold text-slate-200">CRC LAB</span>
            <span>·</span>
            <span>Interactive Cyclic Redundancy Check Educational Platform</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={() => setIsGlossaryOpen(true)}
              className="hover:text-cyan-400 transition-colors cursor-pointer"
            >
              Glossary & Formulas
            </button>
            <span>·</span>
            <span>IEEE 802.3 / ITU-T Standards</span>
            <span>·</span>
            <span className="text-slate-400">Pure Browser Modulo-2 Math</span>
          </div>
        </div>
      </footer>

      {/* Glossary Modal */}
      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
