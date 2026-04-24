import { NavLink } from 'react-router-dom';

export default function SideNavBar() {
  const navItems = [
    { id: 'workspace', path: '/', icon: 'grid_view', label: 'Workspace' },
    { id: 'history', path: '/history', icon: 'history', label: 'History' },
    { id: 'library', path: '/library', icon: 'inventory_2', label: 'Library' },
    { id: 'settings', path: '/settings', icon: 'settings', label: 'Settings' },
  ];

  return (
    <aside
      className="fixed left-0 top-14 bottom-0 w-64 flex flex-col py-4 gap-2 overflow-y-auto hidden md:flex theme-transition"
      style={{ backgroundColor: 'var(--s1)', borderRight: '1px solid var(--b1)' }}
    >
      <div className="px-4 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: 'var(--s4)', border: '1px solid var(--b5)' }}
          >
            <span className="material-symbols-outlined text-sm" style={{ color: 'var(--t2)' }}>terminal</span>
          </div>
          <div>
            <div className="font-semibold" style={{ color: 'var(--t0)' }}>Technical Core</div>
            <div className="text-[10px] uppercase tracking-wider" style={{ color: 'var(--t3)' }}>v4.2.1-stable</div>
          </div>
        </div>
      </div>
      <nav className="flex flex-col gap-1 px-2">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 transition-all rounded-l-md border-l-2 ${
                isActive ? 'border-l-2' : 'border-transparent'
              }`
            }
            style={({ isActive }) => ({
              backgroundColor: isActive ? 'var(--s2)' : 'transparent',
              color: isActive ? 'var(--t0)' : 'var(--t3)',
              borderLeftColor: isActive ? 'var(--t0)' : 'transparent',
            })}
          >
            <span className="material-symbols-outlined text-sm">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}