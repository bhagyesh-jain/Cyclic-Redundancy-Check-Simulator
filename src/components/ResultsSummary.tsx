import React, { useState } from 'react';
import { Copy, Check, Download, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { CrcCalculationResult, ReceiverVerificationResult, binaryToPolynomial } from '../utils/crcEngine';

interface ResultsSummaryProps {
  calcResult: CrcCalculationResult;
  verification: ReceiverVerificationResult;
}

export const ResultsSummary: React.FC<ResultsSummaryProps> = ({ calcResult, verification }) => {
  const [copied, setCopied] = useState<boolean>(false);

  const { dataBits, generator, degree, paddedData, remainder, codeword, steps } = calcResult;
  const { receivedCodeword, remainder: rxRemainder, isErrorFree } = verification;

  // Format comprehensive text report
  const generateReportText = (): string => {
    return [
      '============================================================',
      '      CRC LAB – CYCLIC REDUNDANCY CHECK SIMULATION REPORT   ',
      '============================================================',
      `Timestamp: ${new Date().toISOString()}`,
      '',
      '--- SENDER PARAMETERS ---',
      `Original Data Bits (D):          ${dataBits} (${dataBits.length} bits)`,
      `Generator Polynomial (G):        ${generator} (Degree r = ${degree})`,
      `Generator Polynomial Form:       ${binaryToPolynomial(generator)}`,
      `Padded Message (D + zeros):      ${paddedData} (${paddedData.length} bits)`,
      `Division Steps Computed:         ${steps.length}`,
      `Quotient:                        ${calcResult.quotient}`,
      `CRC Remainder / Checksum (R):    ${remainder} (${degree} bits)`,
      `Transmitted Codeword (T = D+R):  ${codeword} (${codeword.length} bits)`,
      '',
      '--- TRANSMISSION & RECEIVER VERIFICATION ---',
      `Received Codeword (T'):          ${receivedCodeword}`,
      `Channel Error Injected:          ${codeword === receivedCodeword ? 'NO (Clean Channel)' : 'YES (Bit Inversions Detected)'}`,
      `Receiver Remainder / Syndrome:   ${rxRemainder}`,
      `Verification Verdict:            ${isErrorFree ? 'PASSED (Zero Remainder - No Error Detected)' : 'FAILED (Non-zero Remainder - Transmission Error Detected)'}`,
      '============================================================',
    ].join('\n');
  };

  const handleCopyResults = () => {
    const text = generateReportText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadReport = () => {
    const text = generateReportText();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `crc-simulation-report-${Date.now()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section id="results" className="bg-[#111C32] border border-slate-800 rounded-xl p-5 lg:p-7 space-y-6">
      {/* Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
              Simulation Results & Metrics
            </span>
            <span className="text-slate-500 font-mono text-xs">·</span>
            <span className="text-xs text-slate-400">Comprehensive Telemetry</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
            Results & Mathematical Summary
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleCopyResults}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-[#0B1120] hover:bg-slate-800 border border-slate-700 transition-colors shadow-sm"
            title="Copy formatted simulation summary to clipboard"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" />
                <span>Copy Results</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownloadReport}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-[#0B1120] hover:bg-slate-800 border border-slate-700 transition-colors shadow-sm"
            title="Download full laboratory report as text file"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download Report (.txt)</span>
          </button>
        </div>
      </div>

      {/* Summary Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
        {/* Metric 1 */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-slate-500 font-sans uppercase">Original Data (D)</span>
          <div className="font-bold text-white text-sm truncate">{dataBits}</div>
          <div className="text-[11px] text-slate-400 font-sans">Length: {dataBits.length} bits</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-slate-500 font-sans uppercase">Generator Divisor (G)</span>
          <div className="font-bold text-cyan-400 text-sm truncate">{generator}</div>
          <div className="text-[11px] text-slate-400 font-sans">Degree: r = {degree}</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-slate-500 font-sans uppercase">Padded Dividend (P)</span>
          <div className="font-bold text-blue-300 text-sm truncate">{paddedData}</div>
          <div className="text-[11px] text-slate-400 font-sans">Appended {degree} zeros</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-slate-500 font-sans uppercase">CRC Remainder / Checksum (R)</span>
          <div className="font-bold text-emerald-400 text-sm tracking-wider">{remainder}</div>
          <div className="text-[11px] text-slate-400 font-sans">Checksum width: {degree} bits</div>
        </div>

        {/* Metric 5 */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-slate-500 font-sans uppercase">Transmitted Codeword (T = D+R)</span>
          <div className="font-bold text-cyan-300 text-sm truncate">{codeword}</div>
          <div className="text-[11px] text-slate-400 font-sans">Total frame: {codeword.length} bits</div>
        </div>

        {/* Metric 6 */}
        <div className="bg-[#0B1120] border border-slate-800 rounded-lg p-3.5 space-y-1">
          <span className="text-[11px] text-slate-500 font-sans uppercase">Received Codeword (T')</span>
          <div
            className={`font-bold text-sm truncate ${
              codeword === receivedCodeword ? 'text-slate-200' : 'text-red-400'
            }`}
          >
            {receivedCodeword}
          </div>
          <div className="text-[11px] text-slate-400 font-sans">
            {codeword === receivedCodeword ? 'Zero bit errors' : 'Channel bit flips present'}
          </div>
        </div>
      </div>

      {/* Receiver Remainder & Verification Verdict Strip */}
      <div className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
              isErrorFree
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-red-500/20 text-red-400 border border-red-500/40'
            }`}
          >
            {isErrorFree ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : (
              <XCircle className="w-5 h-5 text-red-400" />
            )}
          </div>
          <div>
            <div className="text-xs text-slate-400">Final Verification Status</div>
            <div
              className={`text-sm font-bold ${
                isErrorFree ? 'text-emerald-400' : 'text-red-400'
              }`}
            >
              {isErrorFree
                ? 'PASSED: Zero Remainder (No transmission errors detected)'
                : 'FAILED: Non-zero Remainder (Corruption detected by receiver)'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono self-end sm:self-center">
          <span className="text-slate-500">Receiver Remainder:</span>
          <span
            className={`px-3 py-1 rounded font-bold text-sm tracking-widest ${
              isErrorFree
                ? 'bg-emerald-950 text-emerald-300 border border-emerald-700/60'
                : 'bg-red-950 text-red-300 border border-red-700/60'
            }`}
          >
            {rxRemainder}
          </span>
        </div>
      </div>
    </section>
  );
};
