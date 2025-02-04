import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { TestDashboard } from './components/TestDashboard/TestDashboard';
import { TestDashboardGrid } from './components/TestDashboard/TestDashboardGrid';
import { TestVideoDetail } from './components/TestDashboard/TestVideoDetail';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Dashboard />
  },
  {
    path: '/test-dashboard',
    element: <TestDashboard />,
    children: [
      {
        index: true,
        element: <TestDashboardGrid />
      },
      {
        path: ':videoId',
        element: <TestVideoDetail />
      }
    ]
  }
]);

export function App() {
  return <RouterProvider router={router} />;
} 