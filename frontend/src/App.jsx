import { BrowserRouter, Routes, Route } from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";
import Dashboard from "./pages/Dashboard";
import Options from "./pages/Options";
import Bonds from "./pages/Bonds";
import Swaps from "./pages/Swaps";
import Exposure from "./pages/Exposure";
import CVA from "./pages/CVA";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/options" element={<Options />} />
          <Route path="/bonds" element={<Bonds />} />
          <Route path="/swaps" element={<Swaps />} />
          <Route path="/exposure" element={<Exposure />} />
          <Route path="/cva" element={<CVA />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}