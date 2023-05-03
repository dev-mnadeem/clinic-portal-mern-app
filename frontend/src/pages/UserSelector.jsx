import {Link} from 'react-router-dom';

const roles = [
  ['/patientlogin', 'Patient', 'Book visits, see prescriptions and lab results.'],
  ['/doctorlogin', 'Doctor', 'Confirm visits, prescribe and request tests.'],
  ['/pharmacylogin', 'Pharmacy', 'Dispense assigned prescriptions and keep stock.'],
  ['/lablogin', 'Laboratory', 'File results for the tests routed to you.'],
];

export default function UserSelector() {
  return <main className="entry">
    <div className="entry-intro">
      <p className="eyebrow">Curify clinic portal</p>
      <h1>Who is signing in?</h1>
      <p>Each role sees only the records it needs for its step of the visit.</p>
    </div>
    <ul className="role-list">
      {roles.map(([to, label, detail]) => <li key={to}>
        <Link className="role-link" to={to}>
          <span className="role-name">{label}</span>
          <span className="role-detail">{detail}</span>
        </Link>
      </li>)}
    </ul>
    <p className="entry-admin"><Link to="/adminlogin">Clinic administrator sign-in</Link></p>
  </main>;
}
