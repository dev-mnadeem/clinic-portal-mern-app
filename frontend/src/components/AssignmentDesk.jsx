import {useCallback,useEffect,useState} from 'react';
import axios from 'axios';
import {API_BASE} from '../api/session';

export default function AssignmentDesk() {
  const [data,setData]=useState(null);
  const [error,setError]=useState('');
  const load=useCallback(async()=>{
    try {setData((await axios.get(`${API_BASE}/api/Admin/assignments`)).data);setError('');}
    catch {setError('Unable to load unassigned requests.');}
  },[]);
  useEffect(()=>{void load();},[load]);
  async function assign(event,kind) {
    event.preventDefault();
    const fields=new FormData(event.currentTarget);
    const payload=kind==='report'
      ? {reportId:fields.get('request'),LabId:fields.get('destination')}
      : {prescriptionId:fields.get('request'),pharmacyId:fields.get('destination')};
    try {
      await axios.post(`${API_BASE}/api/Admin/${kind==='report'?'assignReport':'assignPrescription'}`,{data:payload});
      await load();
    } catch {setError('The request could not be assigned. Refresh and try again.');}
  }
  if (!data) return <p role="status">{error || 'Loading assignment desk…'}</p>;
  return <section className="card m-3 p-3" aria-labelledby="assignment-heading">
    <h2 id="assignment-heading">Route clinical requests</h2>
    <p>Only the assigned laboratory or pharmacy can open these requests.</p>
    {error && <p role="alert">{error}</p>}
    {[['report',data.reports,data.labs],['prescription',data.prescriptions,data.pharmacies]].map(([kind,requests,destinations])=><form key={kind} onSubmit={event=>assign(event,kind)} className="mb-3">
      <label className="d-block">Unassigned {kind}
        <select name="request" className="form-select" required defaultValue="">
          <option value="">Choose a request</option>
          {requests.map(row=><option key={row._id} value={row._id}>{row.patientName || row.patientId?.name || 'Patient'} — {row.Type || row.Medicine}</option>)}
        </select>
      </label>
      <label className="d-block mt-2">{kind==='report'?'Laboratory':'Pharmacy'}
        <select name="destination" className="form-select" required defaultValue="">
          <option value="">Choose a destination</option>
          {destinations.map(row=><option key={row._id} value={row._id}>{row.name}</option>)}
        </select>
      </label>
      <button className="btn btn-primary mt-2" disabled={!requests.length || !destinations.length}>Assign {kind}</button>
    </form>)}
  </section>;
}
