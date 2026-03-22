import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<div className="p-6">Dashboard coming soon</div>} />
          <Route path="complaints" element={<div className="p-6">Complaints List coming soon</div>} />
          <Route path="complaints/:id" element={<div className="p-6">Complaint Detail coming soon</div>} />
          <Route path="analytics" element={<div className="p-6">Analytics coming soon</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
