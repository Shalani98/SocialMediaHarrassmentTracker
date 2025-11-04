import { BrowserRouter, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import Social from "./pages/Social";
import LogRegister from "./pages/LogRegister";
import VictimDashboard from "./pages/VictimDashboard";
import ModeratorDashboard from "./pages/ModeratorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/Main" element={<Main />} />
        <Route path="/" element={<Social />} />

        <Route path="/LogRegister" element={<LogRegister />} />
        <Route path="/VictimDashboard" element={<VictimDashboard />} />
        <Route path="/ModeratorDashboard" element={<ModeratorDashboard />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
