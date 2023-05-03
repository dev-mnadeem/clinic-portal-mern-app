import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import {API_BASE,currentSession,clearSession} from '../api/session';
import '../styles/passwordStyle.scss';

const endpoints={patient:'Patients',doctor:'Doctors',lab:'Labs',pharmacy:'Pharmacies',admin:'Admin'};
export default function Password() {
  const navigate=useNavigate();
  const session=currentSession();
  const [password,setPassword]=useState('');
  const [newpass,setNewpass]=useState('');
  const [error,setError]=useState('');
  const [saving,setSaving]=useState(false);
  async function submit(event) {
    event.preventDefault();setError('');setSaving(true);
    try {
      await axios.post(`${API_BASE}/api/${endpoints[session.role]}/changePass`,{data:{password,newpass}});
      clearSession();navigate('/');
    } catch {setError('Password change failed. Check your current password and try again.');}
    finally {setSaving(false);}
  }
  return <main id="password-page" className="container py-5">
    <h1>Change your password</h1>
    <p>Changing it signs out your existing sessions.</p>
    <form onSubmit={submit}>
      <label htmlFor="current-password" className="form-label">Current password</label>
      <input id="current-password" className="form-control mb-3" type="password" autoComplete="current-password" required value={password} onChange={event=>setPassword(event.target.value)}/>
      <label htmlFor="new-password" className="form-label">New password</label>
      <input id="new-password" className="form-control mb-3" type="password" autoComplete="new-password" required minLength={12} value={newpass} onChange={event=>setNewpass(event.target.value)}/>
      {error && <p role="alert">{error}</p>}
      <button className="btn btn-primary" disabled={saving}>{saving?'Saving…':'Change password'}</button>
    </form>
  </main>;
}
