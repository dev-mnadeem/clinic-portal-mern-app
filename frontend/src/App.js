import { currentSession } from "./api/session";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import UserSelector from "./pages/UserSelector";
import Register from "./pages/Register";
import Password from "./pages/Password";
import Login from "./pages/Login";

import DoctorDash from "./pages/DoctorDash";
import Patientdash from "./pages/patientdash";
import Labdash from "./pages/Labdash";
import PharmacyDash from "./pages/PharmacyDash";

function RequireRole({role, children}) {
  return currentSession()?.role === role ? children : <Navigate to="/" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSelector />} />
        <Route path="/register" element={<RequireRole role="admin"><Register /></RequireRole>} />
        <Route path="/pass" element={currentSession() ? <Password /> : <Navigate to="/" replace />} />
        <Route path="/patientlogin" element={<Login heading="Patients" />} />
        <Route path="/doctorlogin" element={<Login heading="Doctors" />} />
        <Route path="/pharmacylogin" element={<Login heading="Pharmacies" />} />
        <Route path="/lablogin" element={<Login heading="Labs" />} />
        <Route path="/adminlogin" element={<Login heading="Admin" />} />
        
        <Route path="/doc" element={<RequireRole role="doctor"><DoctorDash /></RequireRole>} />
        <Route path="/pat" element={<RequireRole role="patient"><Patientdash /></RequireRole>} />
        <Route path="/lab" element={<RequireRole role="lab"><Labdash /></RequireRole>} />
        <Route path="/pharm" element={<RequireRole role="pharmacy"><PharmacyDash /></RequireRole>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
