import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import DashboardPage from "./features/dashboard/DashboardPage";
import ComplaintsPage from "./features/complaints/ComplaintsPage";
import ComplaintDetailPage from "./features/complaint-detail/ComplaintDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="complaints" element={<ComplaintsPage />} />
          <Route path="complaints/:id" element={<ComplaintDetailPage />} />
          <Route path="analytics" element={<div className="p-6">Analytics coming soon</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
