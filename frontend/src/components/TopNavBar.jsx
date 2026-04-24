import { useTheme } from '../ThemeContext';

export default function TopNavBar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <nav
      className="flex justify-between items-center w-full px-6 h-14 font-inter text-sm antialiased tracking-tight fixed top-0 left-0 right-0 z-50 theme-transition"
      style={{ backgroundColor: 'var(--s0)', borderBottom: '1px solid var(--b1)' }}
    >
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold tracking-tighter uppercase" style={{ color: 'var(--t0)' }}>Hierarchy Analyzer</span>
        <span className="text-[13px]" style={{ color: 'var(--t3)' }}>Analyze node relationships and detect structures</span>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-[13px]" style={{ color: 'var(--t2)' }}>API status: Online</span>
        </div>
        <div className="flex items-center gap-2" style={{ color: 'var(--t3)' }}>
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110"
            style={{
              backgroundColor: 'var(--s2)',
              border: '1px solid var(--b1)',
            }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            <span
              className="material-symbols-outlined text-lg transition-all duration-500"
              style={{
                color: 'var(--t0)',
                transform: theme === 'dark' ? 'rotate(0deg)' : 'rotate(360deg)',
              }}
            >
              {theme === 'dark' ? 'dark_mode' : 'light_mode'}
            </span>
          </button>
          <button className="hover:opacity-100 transition-opacity duration-200 opacity-60 hover:scale-105" style={{ color: 'var(--t3)' }}>
            <span className="material-symbols-outlined text-lg">sensors</span>
          </button>
          <button className="hover:opacity-100 transition-opacity duration-200 opacity-60 hover:scale-105" style={{ color: 'var(--t3)' }}>
            <span className="material-symbols-outlined text-lg">notifications</span>
          </button>
          <button className="hover:opacity-100 transition-opacity duration-200 opacity-60 hover:scale-105" style={{ color: 'var(--t3)' }}>
            <span className="material-symbols-outlined text-lg">account_circle</span>
          </button>
        </div>
      </div>
    </nav>
  );
}