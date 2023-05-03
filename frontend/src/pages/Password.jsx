import {useState} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {currentSession, clearSession} from '../api/session';
import {roleEndpoints, send, errorMessage} from '../api/clinic';

const homes = {patient:'/pat', doctor:'/doc', lab:'/lab', pharmacy:'/pharm', admin:'/admin'};

export default function Password() {
  const navigate = useNavigate();
  const session = currentSession();
  const [password, setPassword] = useState('');
  const [newpass, setNewpass] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setError('');
    setSaving(true);
    try {
      await send(`${roleEndpoints[session.role]}/changePass`, {password, newpass});
      clearSession();
      navigate('/');
    } catch (failure) {
      setError(errorMessage(failure, 'Password change failed. Check your current password and try again.'));
      setSaving(false);
    }
  }
  return <main className="entry entry-narrow">
    <p className="eyebrow"><Link to={homes[session?.role] || '/'}>Back to your workspace</Link></p>
    <h1>Change your password</h1>
    <p>Changing it signs out every existing session, including this one.</p>
    <form className="stack" onSubmit={submit}>
      <label htmlFor="current-password">Current password</label>
      <input id="current-password" type="password" autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)}/>
      <label htmlFor="new-password">New password <span className="hint">(at least 12 characters)</span></label>
      <input id="new-password" type="password" autoComplete="new-password" required minLength={12} value={newpass} onChange={event => setNewpass(event.target.value)}/>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      <button className="button" disabled={saving}>{saving ? 'Saving…' : 'Change password'}</button>
    </form>
  </main>;
}
