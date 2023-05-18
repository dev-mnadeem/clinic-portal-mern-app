import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserSelector from "./pages/UserSelector";
import Register from "./pages/Register";
import Password from "./pages/Password";
import Login from "./pages/Login";
import Dasboard from "./pages/Dashboard";
import DoctorDash from "./pages/DoctorDash";
import Patientdash from "./pages/patientdash";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSelector />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pass" element={<Password />} />
        <Route path="/patientlogin" element={<Login heading="Patients" />} />
        <Route path="/doctorlogin" element={<Login heading="Doctors" />} />
        <Route path="/pharmacylogin" element={<Login heading="Pharmacies" />} />
        <Route path="/lablogin" element={<Login heading="Labs" />} />
        <Route path="/adminlogin" element={<Login heading="Admin" />} />
        <Route path="/dash" element={<Dasboard />} />
        <Route path="/doc" element={<DoctorDash />} />
        <Route path="/pat" element={<Patientdash />} />
      </Routes>
    </Router>
  );
}

export default App;
