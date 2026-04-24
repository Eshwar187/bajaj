export default function InputPanel({ inputData, setInputData, onRun, loading, error }) {
  return (
    <div
      className="rounded flex flex-col h-full animate-slide-up theme-transition"
      style={{ backgroundColor: 'var(--s1)', border: '1px solid var(--b1)', animationDelay: '0.05s' }}
    >
      <div className="p-4" style={{ borderBottom: '1px solid var(--b1)' }}>
        <h2 className="text-[18px] font-semibold" style={{ color: 'var(--t0)' }}>Input Data</h2>
      </div>
      <div className="p-4 flex-1 flex flex-col gap-4">
        <label className="text-[12px] font-medium uppercase tracking-wide" style={{ color: 'var(--t2)' }}>NODE RELATIONSHIPS</label>
        <textarea
          className="w-full flex-1 rounded p-3 font-mono text-[13px] resize-none min-h-[200px] transition-all duration-300 focus:ring-0 focus:outline-none"
          style={{
            backgroundColor: 'var(--s0)',
            border: '1px solid var(--b1)',
            color: 'var(--t0)',
          }}
          placeholder={"A->B\nA->C\nB->D"}
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          onFocus={(e) => e.target.style.borderColor = 'var(--t0)'}
          onBlur={(e) => e.target.style.borderColor = 'var(--b1)'}
        />
        {error && (
          <div
            className="flex items-center gap-2 text-[13px] p-2.5 rounded animate-shake"
            style={{ color: 'var(--err-text)', backgroundColor: 'var(--err-surface)', border: '1px solid var(--err-border)' }}
          >
            <span className="material-symbols-outlined text-[16px]">error</span>
            {error}
          </div>
        )}
        <button
          className="w-full font-semibold py-2.5 px-4 rounded transition-all duration-300 relative overflow-hidden group active:scale-[0.98]"
          style={{
            backgroundColor: loading ? 'var(--s4)' : 'var(--accent)',
            color: loading ? 'var(--t3)' : 'var(--accent-text)',
            cursor: loading ? 'wait' : 'pointer',
          }}
          onClick={onRun}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: 'var(--t3)', borderTopColor: 'transparent' }}></span>
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