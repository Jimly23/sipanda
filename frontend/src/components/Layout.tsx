import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { PageLoadingSkeleton } from './Skeleton';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
        <aside className="w-64 h-screen border-r border-gray-200 bg-white p-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded bg-slate-200 animate-pulse" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 bg-slate-200 rounded animate-pulse w-24" />
              <div className="h-2.5 bg-slate-200 rounded animate-pulse w-16" />
            </div>
          </div>
        </aside>
        <main className="flex-1 p-8 overflow-y-auto">
          <PageLoadingSkeleton />
        </main>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <TopNavbar />
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
    </div>
  );
}
