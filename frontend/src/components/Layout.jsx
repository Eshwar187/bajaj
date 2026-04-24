import TopNavBar from './TopNavBar';
import SideNavBar from './SideNavBar';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen bg-surface-container-lowest">
      <TopNavBar />
      <SideNavBar />
      <Outlet />
    </div>
  );
}