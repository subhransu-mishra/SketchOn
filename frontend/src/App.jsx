import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Pricing from "./pages/Pricing";
import HowToUse from "./pages/HowToUse";
import Dashboard from "./pages/Dashboard";
import CanvasPage from "./pages//SketchPage/CanvasPage";
import AuthDebugger from "./components/AuthDebugger";
import ProductionAuthDebugger from "./components/ProductionAuthDebugger";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/how-to-use" element={<HowToUse />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/canvas" element={<CanvasPage />} />
      </Routes>
      <AuthDebugger />
      {window.location.hostname !== "localhost" && <ProductionAuthDebugger />}
    </BrowserRouter>
  );
}

export default App;
