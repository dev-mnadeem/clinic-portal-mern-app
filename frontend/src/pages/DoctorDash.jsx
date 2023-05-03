import {useState} from 'react';
import Workspace from '../components/Workspace';
import Section from '../components/Section';
import ListState from '../components/ListState';
import useResource from '../hooks/useResource';
import {send, errorMessage} from '../api/clinic';

const loadPending = () => send('Doctors/getAllPendingAppointments');
const loadAccepted = () => send('Doctors/getAllAcceptedAppointments');

function OrderForm({appointment, kind, onDone, onCancel}) {
  const [medicine, setMedicine] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [testType, setTestType] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const prefix = `${kind}-${appointment._id}`;
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      if (kind === 'prescription') {
        await send('Doctors/addPrescription', {Med:medicine, quantity:Number(quantity), patientId:appointment.patientId});
      } else {
        await send('Doctors/addReport', {reporttype:testType, patientId:appointment.patientId});
      }
      onDone(kind === 'prescription' ? `Prescription for ${appointment.patientName} saved. The administrator routes it to a pharmacy.` : `Test request for ${appointment.patientName} saved. The administrator routes it to a laboratory.`);
    } catch (failure) {
      setError(errorMessage(failure, 'Could not save. Try again.'));
      setBusy(false);
    }
  }
  return <form className="inline-form" onSubmit={submit} aria-label={kind === 'prescription' ? `Prescribe for ${appointment.patientName}` : `Request a test for ${appointment.patientName}`}>
    {kind === 'prescription' ? <>
      <label htmlFor={`${prefix}-med`}>Medicine<input id={`${prefix}-med`} required value={medicine} onChange={event => setMedicine(event.target.value)}/></label>
      <label htmlFor={`${prefix}-qty`}>Quantity<input id={`${prefix}-qty`} type="number" min="1" step="1" required value={quantity} onChange={event => setQuantity(event.target.value)}/></label>
    </> : <label htmlFor={`${prefix}-type`}>Test<input id={`${prefix}-type`} required placeholder="e.g. Full blood count" value={testType} onChange={event => setTestType(event.target.value)}/></label>}
    {error && <p className="notice notice-error" role="alert">{error}</p>}
    <div className="actions">
      <button className="button" disabled={busy}>Save</button>
      <button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button>
    </div>
  </form>;
}

export default function DoctorDash() {
  const pending = useResource(loadPending, []);
  const accepted = useResource(loadAccepted, []);
  const [open, setOpen] = useState(null);
  const [notice, setNotice] = useState(null);

  async function decide(appointment, action) {
    try {
      await send(`Doctors/${action}Appointments`, {AppID:appointment._id});
      setNotice({ok:true, text:action === 'accept' ? `Confirmed the visit with ${appointment.patientName}.` : `Declined the request from ${appointment.patientName}.`});
      await Promise.all([pending.reload(), accepted.reload()]);
    } catch (failure) {
      setNotice({ok:false, text:errorMessage(failure, 'That appointment could not be updated.')});
    }
  }

  return <Workspace title="Today’s patients" intro="Confirm visit requests, then prescribe or request tests for confirmed patients.">
    {notice && <p className={`notice ${notice.ok ? 'notice-ok' : 'notice-error'}`} role={notice.ok ? 'status' : 'alert'}>{notice.text}</p>}
    <Section id="pending-heading" title="Visit requests">
      <ListState {...pending} empty={!pending.data.length} emptyText="No visit requests are waiting." onRetry={pending.reload}>
        <ul className="rows">
          {pending.data.map(row => <li key={row._id} className="row">
            <div><strong>{row.patientName}</strong><span className="muted">{row.dateTime} · {row.reason}</span></div>
            <div className="actions">
              <button type="button" className="button" onClick={() => decide(row, 'accept')}>Confirm</button>
              <button type="button" className="button button-quiet" onClick={() => decide(row, 'reject')}>Decline</button>
            </div>
          </li>)}
        </ul>
      </ListState>
    </Section>
    <Section id="accepted-heading" title="Confirmed visits">
      <ListState {...accepted} empty={!accepted.data.length} emptyText="No confirmed visits yet." onRetry={accepted.reload}>
        <ul className="rows">
          {accepted.data.map(row => <li key={row._id} className="row row-wrap">
            <div><strong>{row.patientName}</strong><span className="muted">{row.dateTime} · {row.reason}</span></div>
            <div className="actions">
              <button type="button" className="button button-quiet" aria-expanded={open?.id === row._id && open.kind === 'prescription'} onClick={() => setOpen({id:row._id, kind:'prescription'})}>Prescribe</button>
              <button type="button" className="button button-quiet" aria-expanded={open?.id === row._id && open.kind === 'test'} onClick={() => setOpen({id:row._id, kind:'test'})}>Request test</button>
            </div>
            {open?.id === row._id && <OrderForm key={open.kind} appointment={row} kind={open.kind} onCancel={() => setOpen(null)} onDone={text => {setOpen(null); setNotice({ok:true, text});}}/>}
          </li>)}
        </ul>
      </ListState>
    </Section>
  </Workspace>;
}
