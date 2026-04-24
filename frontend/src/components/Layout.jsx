import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import { Outlet } from 'react-router-dom';
import { ThemeProvider } from '../ThemeContext';

export default function Layout() {
  return (
    <ThemeProvider>
      <div className="min-h-screen theme-transition" style={{ backgroundColor: 'var(--s0)' }}>
        <TopNavBar />
        <SideNavBar />
        <Outlet />
      </div>
    </ThemeProvider>
  );
}