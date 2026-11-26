import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  Layers, 
  Sparkles, 
  Zap,
  CheckCircle2,
  ArrowDown
} from 'lucide-react';
import { CrcCalculationResult, DivisionStep } from '../utils/crcEngine';

interface DivisionVisualizerProps {
  calcResult: CrcCalculationResult;
}

export const DivisionVisualizer: React.FC<DivisionVisualizerProps> = ({ calcResult }) => {
  const { dataBits, generator, degree, paddedData, quotient, remainder, steps } = calcResult;

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1000); // ms per step
  const [showAllSteps, setShowAllSteps] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'traditional' | 'inspector'>('traditional');

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const totalSteps = steps.length;

  // Auto-play timer
  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= totalSteps - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, playbackSpeed, totalSteps]);

  // Reset step when data changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [calcResult]);

  const handleNext = () => {
    setIsPlaying(false);
    if (currentStepIndex < totalSteps - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setIsPlaying(false);
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleTogglePlay = () => {
    if (currentStepIndex >= totalSteps - 1) {
      setCurrentStepIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const activeStep: DivisionStep | undefined = steps[currentStepIndex];
  const progressPercent = totalSteps > 0 ? ((currentStepIndex + 1) / totalSteps) * 100 : 0;
  const isComplete = currentStepIndex === totalSteps - 1;

  // Helper to format character cells for modulo-2 alignment
  const dataLen = dataBits.length;
  const paddedLen = paddedData.length;

  return (
    <section id="division" className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-7 space-y-6">
      {/* Header & Mode Switcher */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Sender Side Calculation
            </span>
            <span className="text-slate-500 font-mono text-xs">·</span>
            <span className="text-xs text-slate-400">Modulo-2 Long Division Engine</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Interactive XOR Modulo-2 Binary Division
          </h2>
        </div>

        {/* Top Controls: View Selector & Show All Steps */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-[#0B1120] border border-slate-700/80 rounded-lg p-0.5 text-xs">
            <button
              onClick={() => setActiveTab('traditional')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'traditional'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Handwritten Layout
            </button>
            <button
              onClick={() => setActiveTab('inspector')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors whitespace-nowrap ${
                activeTab === 'inspector'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Bit-by-Bit Inspector
            </button>
          </div>

          <button
            onClick={() => setShowAllSteps(!showAllSteps)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors whitespace-nowrap ${
              showAllSteps
                ? 'bg-cyan-500/20 border-cyan-500/60 text-cyan-300'
                : 'bg-[#0B1120] border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>{showAllSteps ? 'Stepped View' : 'Show All Steps'}</span>
          </button>
        </div>
      </div>

      {/* Playback Control Deck & Progress Bar */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Step Counter & Status */}
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-white">
              Step {currentStepIndex + 1} <span className="text-slate-500">/ {totalSteps}</span>
            </span>
            <span className="text-slate-600">|</span>
            <div className="text-xs text-slate-300">
              {activeStep?.quotientBit === '1' ? (
                <span className="text-cyan-400 font-medium">
                  Leading bit is <span className="font-mono font-bold">1</span> → XOR with G
                </span>
              ) : (
                <span className="text-slate-400 font-medium">
                  Leading bit is <span className="font-mono font-bold">0</span> → Shift (XOR 00..0)
                </span>
              )}
            </div>
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors border border-slate-700"
              title="Restart from step 1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={handlePrev}
              disabled={currentStepIndex === 0}
              className={`p-2 rounded-lg transition-colors border ${
                currentStepIndex === 0
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Previous step"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <button
              onClick={handleTogglePlay}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              title={isPlaying ? 'Pause animation' : 'Play animation'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isComplete ? 'Replay' : 'Play'}</span>
                </>
              )}
            </button>

            <button
              onClick={handleNext}
              disabled={currentStepIndex >= totalSteps - 1}
              className={`p-2 rounded-lg transition-colors border ${
                currentStepIndex >= totalSteps - 1
                  ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed'
                  : 'bg-slate-800/80 hover:bg-slate-700 border-slate-700 text-slate-300 hover:text-white'
              }`}
              title="Next step"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 ml-2 pl-2 border-l border-slate-800 text-xs text-slate-400">
              <span className="hidden sm:inline">Speed:</span>
              <select
                value={playbackSpeed}
                onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none"
              >
                <option value={1800}>0.5x</option>
                <option value={1000}>1.0x</option>
                <option value={500}>2.0x</option>
                <option value={250}>4.0x</option>
              </select>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1">
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Active Step Narrative */}
        {activeStep && (
          <div className="bg-[#111C32] border border-blue-900/50 rounded-lg p-3 text-xs flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div className="space-y-1 text-slate-300">
              <p className="font-mono text-cyan-300">{activeStep.explanation}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-400">
                <span>
                  Quotient Bit: <strong className="font-mono text-white">{activeStep.quotientBit}</strong>
                </span>
                <span>
                  Operand: <strong className="font-mono text-blue-300">{activeStep.dividendWindow}</strong>
                </span>
                <span>
                  Divisor: <strong className="font-mono text-cyan-300">{activeStep.divisor}</strong>
                </span>
                <span>
                  Remainder before drop: <strong className="font-mono text-emerald-300">{activeStep.remainderBeforeNext}</strong>
                </span>
                {activeStep.nextBit !== null && (
                  <span>
                    Brought down: <strong className="font-mono text-amber-300">{activeStep.nextBit}</strong>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Color Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 px-1">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-blue-500/30 border border-blue-400 inline-block" />
          <span>Active Division Window (Blue)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-400 inline-block" />
          <span>XOR Subtractor / Generator (Cyan)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-amber-500/30 border border-amber-400 inline-block" />
          <span>Appended Zeros / Brought Down (Amber)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-400 inline-block" />
          <span>Final CRC Remainder (Green)</span>
        </div>
      </div>

      {/* Main Visualizer Content: Traditional Handwritten Layout vs Inspector */}
      {activeTab === 'traditional' ? (
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 overflow-x-auto shadow-inner">
          <div className="min-w-[680px] font-mono text-xs sm:text-sm select-text">
            {/* Top Row: Quotient */}
            <div className="flex items-center mb-1">
              {/* Spacing for generator width + parenthesis */}
              <div 
                className="shrink-0 text-right pr-3 text-slate-500"
                style={{ width: `${(generator.length + 3) * 1.5}rem` }}
              >
                Quotient:
              </div>
              <div className="flex items-center tracking-widest pl-2">
                {quotient.split('').map((bit, idx) => {
                  const isPast = idx < (showAllSteps ? totalSteps : currentStepIndex + 1);
                  const isCurrent = idx === currentStepIndex && !showAllSteps;
                  return (
                    <span
                      key={idx}
                      className={`w-6 h-6 flex items-center justify-center font-bold rounded ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 shadow-sm shadow-cyan-400/30'
                          : isPast
                          ? 'text-cyan-400 font-semibold'
                          : 'text-slate-700'
                      }`}
                    >
                      {isPast ? bit : '·'}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Overline bar representing division line */}
            <div className="flex items-center">
              <div 
                className="shrink-0"
                style={{ width: `${(generator.length + 3) * 1.5}rem` }}
              />
              <div 
                className="h-[2px] bg-slate-600 transition-all pl-2"
                style={{ width: `${paddedLen * 1.5}rem` }}
              />
            </div>

            {/* Dividend Line with Generator Divisor on Left */}
            <div className="flex items-center mt-1">
              {/* Generator Divisor */}
              <div 
                className="shrink-0 text-right pr-2 text-cyan-400 font-bold"
                style={{ width: `${(generator.length + 3) * 1.5}rem` }}
              >
                <span>{generator}</span>
                <span className="text-slate-500 ml-1">)</span>
              </div>

              {/* Padded Dividend Bits */}
              <div className="flex items-center pl-2">
                {paddedData.split('').map((bit, idx) => {
                  const isOriginalData = idx < dataLen;
                  const isCurrentActive =
                    !showAllSteps &&
                    activeStep &&
                    idx >= activeStep.windowStartIndex &&
                    idx < activeStep.windowStartIndex + generator.length;
                  const isBroughtDown =
                    !showAllSteps &&
                    activeStep &&
                    activeStep.broughtDownIndex === idx;

                  return (
                    <span
                      key={idx}
                      className={`w-6 h-6 flex items-center justify-center font-bold transition-colors ${
                        isCurrentActive
                          ? 'bg-blue-600/40 text-blue-300 border-b border-blue-400'
                          : isBroughtDown
                          ? 'bg-amber-500/20 text-amber-300'
                          : isOriginalData
                          ? 'text-slate-200'
                          : 'text-amber-400/90'
                      }`}
                      title={
                        isOriginalData
                          ? `Original Data Bit [${idx}]`
                          : `Appended Zero [${idx}]`
                      }
                    >
                      {bit}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Steps Cascade (Handwritten modulo-2 division trace) */}
            <div className="mt-2 space-y-1">
              {(showAllSteps ? steps : steps.slice(0, currentStepIndex + 1)).map(
                (step, sIdx) => {
                  const isCurrent = sIdx === currentStepIndex && !showAllSteps;
                  const indentCount = step.windowStartIndex;
                  const bringsDown = step.nextBit !== null;

                  return (
                    <div
                      key={sIdx}
                      className={`py-0.5 rounded transition-colors ${
                        isCurrent ? 'bg-blue-950/40 border-l-2 border-cyan-400 pl-1' : ''
                      }`}
                    >
                      {/* Divisor row (Generator or 00..0) */}
                      <div className="flex items-center">
                        <div 
                          className="shrink-0 text-right pr-2 text-slate-600 text-[11px]"
                          style={{ width: `${(generator.length + 3) * 1.5}rem` }}
                        >
                          <span className="text-cyan-500/80 mr-1 font-bold">⊕</span>
                          <span className="text-slate-400">s{sIdx + 1}</span>
                        </div>

                        {/* Indentation for current step position */}
                        <div className="flex items-center pl-2">
                          <div style={{ width: `${indentCount * 1.5}rem` }} />
                          {step.divisor.split('').map((dBit, dIdx) => (
                            <span
                              key={dIdx}
                              className={`w-6 h-6 flex items-center justify-center font-semibold ${
                                step.quotientBit === '1'
                                  ? 'text-cyan-400'
                                  : 'text-slate-600'
                              }`}
                            >
                              {dBit}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Line separating XOR calculation */}
                      <div className="flex items-center my-0.5">
                        <div 
                          className="shrink-0"
                          style={{ width: `${(generator.length + 3) * 1.5}rem` }}
                        />
                        <div className="flex items-center pl-2">
                          <div style={{ width: `${indentCount * 1.5}rem` }} />
                          <div
                            className="h-[1px] bg-slate-700"
                            style={{
                              width: `${(generator.length + (bringsDown ? 1 : 0)) * 1.5}rem`
                            }}
                          />
                        </div>
                      </div>

                      {/* Remainder row (+ brought down bit) */}
                      <div className="flex items-center">
                        <div 
                          className="shrink-0 text-right pr-2 text-slate-500 text-[11px]"
                          style={{ width: `${(generator.length + 3) * 1.5}rem` }}
                        >
                          {sIdx === totalSteps - 1 ? (
                            <span className="text-emerald-400 font-bold">REM</span>
                          ) : (
                            <span className="text-slate-400">rem</span>
                          )}
                        </div>

                        <div className="flex items-center pl-2">
                          {/* Indent by (windowStartIndex + 1) because leading bit cancelled to 0 */}
                          <div style={{ width: `${(indentCount + 1) * 1.5}rem` }} />
                          {step.remainderBeforeNext.split('').map((rBit, rIdx) => {
                            const isFinal = sIdx === totalSteps - 1;
                            return (
                              <span
                                key={rIdx}
                                className={`w-6 h-6 flex items-center justify-center font-bold ${
                                  isFinal
                                    ? 'text-emerald-400 bg-emerald-950/60 border border-emerald-500/50 rounded'
                                    : 'text-slate-300'
                                }`}
                              >
                                {rBit}
                              </span>
                            );
                          })}

                          {/* Brought down bit */}
                          {step.nextBit !== null && (
                            <span className="w-6 h-6 flex items-center justify-center font-bold text-amber-400 bg-amber-950/40 border border-amber-600/40 rounded">
                              {step.nextBit}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            {/* Final Outcome Banner if at end or showAll */}
            {(isComplete || showAllSteps) && (
              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between bg-emerald-950/30 border border-emerald-800/40 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300 font-semibold text-xs sm:text-sm">
                    Division Complete! Final Remainder (CRC Checksum):
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm sm:text-base font-extrabold text-emerald-400 bg-emerald-950 px-3 py-1 rounded border border-emerald-500/60 tracking-widest">
                    {remainder}
                  </span>
                  <span className="text-xs text-slate-400">({degree} bits)</span>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Bit-by-Bit Inspector Tab */
        <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800">
            <span>Detailed Bit-Level XOR Truth Table for Step {currentStepIndex + 1}</span>
            <span className="font-mono text-cyan-400">
              Quotient bit = {activeStep?.quotientBit}
            </span>
          </div>

          {activeStep && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Bit-by-bit Table */}
              <div className="bg-[#111C32] border border-slate-800 rounded-lg p-3.5 overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className="text-slate-500 border-b border-slate-800 text-left">
                      <th className="pb-1">Bit Position</th>
                      <th className="pb-1 text-blue-400">Dividend (W)</th>
                      <th className="pb-1 text-cyan-400">Divisor (G)</th>
                      <th className="pb-1 text-emerald-400">W ⊕ G</th>
                      <th className="pb-1 text-slate-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {activeStep.dividendWindow.split('').map((wBit, idx) => {
                      const gBit = activeStep.divisor[idx];
                      const resBit = activeStep.xorResult[idx];
                      const isLeading = idx === 0;

                      return (
                        <tr key={idx} className="hover:bg-slate-800/30">
                          <td className="py-1.5 text-slate-400">Column {idx + 1}</td>
                          <td className="py-1.5 font-bold text-blue-300">{wBit}</td>
                          <td className="py-1.5 font-bold text-cyan-300">{gBit}</td>
                          <td className="py-1.5 font-bold text-emerald-300">{resBit}</td>
                          <td className="py-1.5 text-[11px] text-slate-400">
                            {isLeading ? 'Leading 0 dropped' : 'Preserved'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Explanatory Cards */}
              <div className="space-y-3">
                <div className="bg-[#111C32] border border-slate-800 rounded-lg p-3.5 space-y-1.5">
                  <h4 className="text-xs font-semibold text-white">Why did this happen?</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeStep.quotientBit === '1' ? (
                      <>
                        The leftmost bit of the dividend window is <strong className="text-cyan-400">1</strong>.
                        In modulo-2 arithmetic, the divisor <strong className="text-cyan-400">{generator}</strong>{' '}
                        "goes into" the window 1 time. We perform a bitwise XOR, which causes the leading bit to become{' '}
                        <strong className="text-white">0</strong>.
                      </>
                    ) : (
                      <>
                        The leftmost bit of the dividend window is <strong className="text-slate-400">0</strong>.
                        The divisor cannot divide a leading zero, so the quotient bit is{' '}
                        <strong className="text-white">0</strong>. We XOR with zeros, preserving all bits while shifting.
                      </>
                    )}
                  </p>
                </div>

                <div className="bg-[#111C32] border border-slate-800 rounded-lg p-3.5 space-y-1.5">
                  <h4 className="text-xs font-semibold text-white">Next Step Preparation</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {activeStep.nextBit !== null ? (
                      <>
                        Dropping the leftmost 0 leaves <strong className="font-mono text-emerald-300">{activeStep.remainderBeforeNext}</strong>.
                        We pull down bit <strong className="font-mono text-amber-300">'{activeStep.nextBit}'</strong> from index{' '}
                        <span className="font-mono text-slate-400">{activeStep.broughtDownIndex}</span> of the padded dividend to form the next {generator.length}-bit window:{' '}
                        <strong className="font-mono text-blue-300">{activeStep.nextWindow}</strong>.
                      </>
                    ) : (
                      <>
                        All bits of the padded dividend have been processed! The remaining{' '}
                        <strong className="font-mono text-emerald-400">{remainder}</strong> is the final CRC Checksum.
                      </>
                    )}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
