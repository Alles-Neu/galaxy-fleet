import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppLayout } from '@/components/layout/app-layout'

// Pages
import LoginPage from '@/pages/login'
import DashboardPage from '@/pages/dashboard'
import VehicleListPage from '@/pages/vehicles/vehicle-list'
import VehicleDetailPage from '@/pages/vehicles/vehicle-detail'
import HandoverListPage from '@/pages/handovers/handover-list'
import WorkshopListPage from '@/pages/workshop/workshop-list'
import AccidentListPage from '@/pages/accidents/accident-list'
import OffenseListPage from '@/pages/offenses/offense-list'
import InventoryListPage from '@/pages/inventory/inventory-list'
import DailyPage from '@/pages/milkyway/daily'
import WowPage from '@/pages/milkyway/wow'
import AgeingPage from '@/pages/milkyway/ageing'
import MilkywaySearchPage from '@/pages/milkyway/search'
import AdminSettingsPage from '@/pages/admin/settings'
import AdminLogsPage from '@/pages/admin/logs'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30_000,
    },
  },
})

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return <AppLayout>{children}</AppLayout>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          <Route path="/" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* Vehicles */}
          <Route path="/vehicles" element={<ProtectedRoute><VehicleListPage /></ProtectedRoute>} />
          <Route path="/vehicles/new" element={<ProtectedRoute><VehicleDetailPage /></ProtectedRoute>} />
          <Route path="/vehicles/:id" element={<ProtectedRoute><VehicleDetailPage /></ProtectedRoute>} />

          {/* Fleet Management */}
          <Route path="/handovers" element={<ProtectedRoute><HandoverListPage /></ProtectedRoute>} />
          <Route path="/workshop" element={<ProtectedRoute><WorkshopListPage /></ProtectedRoute>} />
          <Route path="/accidents" element={<ProtectedRoute><AccidentListPage /></ProtectedRoute>} />
          <Route path="/offenses" element={<ProtectedRoute><OffenseListPage /></ProtectedRoute>} />
          <Route path="/inventory" element={<ProtectedRoute><InventoryListPage /></ProtectedRoute>} />

          {/* MilkyWay */}
          <Route path="/milkyway/:station/daily" element={<ProtectedRoute><DailyPage /></ProtectedRoute>} />
          <Route path="/milkyway/:station/wow" element={<ProtectedRoute><WowPage /></ProtectedRoute>} />
          <Route path="/milkyway/:station/ageing" element={<ProtectedRoute><AgeingPage /></ProtectedRoute>} />
          <Route path="/milkyway/search" element={<ProtectedRoute><MilkywaySearchPage /></ProtectedRoute>} />

          {/* Admin */}
          <Route path="/admin/settings" element={<ProtectedRoute><AdminSettingsPage /></ProtectedRoute>} />
          <Route path="/admin/logs" element={<ProtectedRoute><AdminLogsPage /></ProtectedRoute>} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}
