import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import UserSelector from "./pages/UserSelector";
import Register from "./pages/Register";
import Password from "./pages/Password";
import Login from "./pages/Login";
import Dasboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserSelector />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pass" element={<Password />} />
        <Route path="/patientlogin" element={<Login heading="Patient's" />} />
        <Route path="/doctorlogin" element={<Login heading="Doctor's" />} />
        <Route path="/pharmacylogin" element={<Login heading="Pahrmacy's" />} />
        <Route path="/lablogin" element={<Login heading="Lab's" />} />
        <Route path="/adminlogin" element={<Login heading="Admin's" />} />
        <Route path="/dash" element={<Dasboard />} />
      </Routes>
    </Router>
  );
}

export default App;
