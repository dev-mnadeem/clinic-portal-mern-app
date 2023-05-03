import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axios from 'axios';
import {API_BASE} from '../api/session';
import {errorMessage} from '../api/clinic';

const destinations = {Patients:'/pat', Doctors:'/doc', Labs:'/lab', Pharmacies:'/pharm', Admin:'/admin'};
const titles = {Patients:'Patient', Doctors:'Doctor', Labs:'Laboratory', Pharmacies:'Pharmacy', Admin:'Administrator'};

export default function Login({heading}) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await axios.post(`${API_BASE}/api/${heading}/login`, {data:{email, password}});
      navigate(destinations[heading]);
    } catch (failure) {
      setError(errorMessage(failure, 'Could not reach the clinic service. Try again shortly.'));
      setBusy(false);
    }
  }

  return <main className="entry entry-narrow">
    <p className="eyebrow"><Link to="/">All roles</Link></p>
    <h1>{titles[heading]} sign-in</h1>
    <form className="stack" onSubmit={submit}>
      <label htmlFor="email">Email address</label>
      <input id="email" type="email" autoComplete="username" required value={email} onChange={event => setEmail(event.target.value)}/>
      <label htmlFor="password">Password</label>
      <input id="password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)}/>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      <button className="button" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
    <p className="hint">Forgotten passwords are reset by the clinic administrator.</p>
  </main>;
}
