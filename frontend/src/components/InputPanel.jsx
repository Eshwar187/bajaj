import { useState } from 'react';

export default function InputPanel({ inputData, setInputData, onRun, loading, error }) {
  return (
    <div className="bg-[#0A0A0A] border border-[#1F1F1F] rounded flex flex-col h-full animate-slide-up" style={{ animationDelay: '0.05s' }}>
      <div className="p-4 border-b border-[#1F1F1F]">
        <h2 className="text-[18px] font-semibold text-white">Input Data</h2>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <label className="text-[12px] font-medium text-zinc-400 uppercase tracking-wide">NODE RELATIONSHIPS</label>
        <textarea
          className="w-full flex-1 bg-black border border-[#1F1F1F] rounded p-3 font-mono text-[13px] text-white focus:border-white focus:ring-0 resize-none min-h-[200px] transition-all duration-300 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]"
          placeholder={"A->B\nA->C\nB->D"}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        {error && (
          <div className="flex items-center gap-2 text-error text-[13px] bg-[#120000] p-2.5 rounded border border-[#400000] animate-shake">
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </div>
        )}
        <button
          className={`w-full font-semibold py-2.5 px-4 rounded transition-all duration-300 relative overflow-hidden group ${
            loading
              ? 'bg-zinc-700 text-zinc-400 cursor-wait'
              : 'bg-white text-black hover:bg-zinc-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] active:scale-[0.98]'
          }`}
          onClick={onRun}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></span>
              Processing…
            </span>
          ) : (
            <>
              <span className="relative z-10">Run Analysis</span>
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}