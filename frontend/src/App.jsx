import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import HowToUse from "./pages/HowToUse";
import Dashboard from "./pages/Dashboard";
import CanvasPage from "./pages/SketchPage/CanvasPage";
import SharePage from "./pages/SharePage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/canvas" element={<CanvasPage />} />
        <Route path="/share/:projectId" element={<SharePage />} />
        {/* Catch-all: redirect unknown routes to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ToastContainer position="top-center" theme="dark" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
