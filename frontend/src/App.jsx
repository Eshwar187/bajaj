import { useState } from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout';
import WorkspaceScreen from './components/WorkspaceScreen';
import HistoryScreen from './components/HistoryScreen';
import LibraryScreen from './components/LibraryScreen';
import SettingsScreen from './components/SettingsScreen';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: '/', element: <WorkspaceScreen /> },
      { path: '/history', element: <HistoryScreen /> },
      { path: '/library', element: <LibraryScreen /> },
      { path: '/settings', element: <SettingsScreen /> },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;