import {useState} from 'react';
import Workspace from '../components/Workspace';
import Section from '../components/Section';
import ListState from '../components/ListState';
import useResource from '../hooks/useResource';
import {send, fetchJson, errorMessage} from '../api/clinic';

const loadAppointments = () => send('Patients/getAllAppointments');
const loadPrescriptions = async () => (await send('Patients/myPrescription')).Prescription;
const loadReports = () => send('Patients/getMyReport');
const loadDoctors = () => fetchJson('Patients/doctors');

function BookingForm({onBooked}) {
  const doctors = useResource(loadDoctors, []);
  const [form, setForm] = useState({doctorId:'', datetime:'', reason:''});
  const [message, setMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const update = field => event => setForm({...form, [field]:event.target.value});
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    try {
      await send('Patients/addAppointment', form);
      setForm({doctorId:'', datetime:'', reason:''});
      setMessage({ok:true, text:'Request sent. It appears under Appointments as waiting until the doctor confirms it.'});
      onBooked();
    } catch (failure) {
      setMessage({ok:false, text:errorMessage(failure, 'The request could not be sent. Try again.')});
    } finally {
      setBusy(false);
    }
  }
  return <Section id="book-heading" title="Request an appointment">
    <ListState loading={doctors.loading} error={doctors.error} empty={!doctors.data.length} emptyText="No doctors are registered yet." onRetry={doctors.reload}>
      <form className="form-grid" onSubmit={submit}>
        <label htmlFor="doctor">Doctor
          <select id="doctor" required value={form.doctorId} onChange={update('doctorId')}>
            <option value="">Choose a doctor</option>
            {doctors.data.map(doctor => <option key={doctor._id} value={doctor._id}>{doctor.name}{doctor.specification ? ` — ${doctor.specification}` : ''}</option>)}
          </select>
        </label>
        <label htmlFor="date">Preferred date
          <input id="date" type="date" required value={form.datetime} onChange={update('datetime')}/>
        </label>
        <label htmlFor="reason" className="span-2">Reason for the visit
          <input id="reason" type="text" required maxLength={200} value={form.reason} onChange={update('reason')}/>
        </label>
        {message && <p className={`notice span-2 ${message.ok ? 'notice-ok' : 'notice-error'}`} role={message.ok ? 'status' : 'alert'}>{message.text}</p>}
        <button className="button" disabled={busy}>{busy ? 'Sending…' : 'Send request'}</button>
      </form>
    </ListState>
  </Section>;
}

export default function Patientdash() {
  const [tab, setTab] = useState('records');
  const appointments = useResource(loadAppointments, []);
  const prescriptions = useResource(loadPrescriptions, []);
  const reports = useResource(loadReports, []);

  return <Workspace title="Your care record" intro="Appointments, prescriptions and lab results from this clinic."
    tabs={[['records', 'Records'], ['book', 'Book a visit']]} activeTab={tab} onTab={setTab}>
    {tab === 'book' ? <BookingForm onBooked={appointments.reload}/> : <>
      <Section id="appointments-heading" title="Appointments">
        <ListState {...appointments} empty={!appointments.data.length} emptyText="No appointments yet. Use Book a visit to request one." onRetry={appointments.reload}>
          <table className="table">
            <thead><tr><th scope="col">Doctor</th><th scope="col">Date</th><th scope="col">Reason</th><th scope="col">Status</th></tr></thead>
            <tbody>{appointments.data.map(row => <tr key={row._id}>
              <td>{row.doctorName}</td><td>{row.dateTime}</td><td>{row.reason}</td>
              <td><span className={`tag ${row.Accepted ? 'tag-ok' : 'tag-wait'}`}>{row.Accepted ? 'Confirmed' : 'Waiting'}</span></td>
            </tr>)}</tbody>
          </table>
        </ListState>
      </Section>
      <Section id="prescriptions-heading" title="Prescriptions">
        <ListState {...prescriptions} empty={!prescriptions.data.length} emptyText="No prescriptions on record." onRetry={prescriptions.reload}>
          <table className="table">
            <thead><tr><th scope="col">Medicine</th><th scope="col">Quantity</th><th scope="col">Prescribed by</th><th scope="col">Status</th></tr></thead>
            <tbody>{prescriptions.data.map(row => <tr key={row._id}>
              <td>{row.Medicine}</td><td>{row.Quantity}</td><td>{row.doctorName}</td>
              <td><span className={`tag ${row.delivered ? 'tag-ok' : 'tag-wait'}`}>{row.delivered ? 'Collected' : 'Not collected'}</span></td>
            </tr>)}</tbody>
          </table>
        </ListState>
      </Section>
      <Section id="reports-heading" title="Lab results">
        <ListState {...reports} empty={!reports.data.length} emptyText="No lab tests have been requested for you." onRetry={reports.reload}>
          <table className="table">
            <thead><tr><th scope="col">Test</th><th scope="col">Status</th><th scope="col">Laboratory remarks</th><th scope="col">Doctor remarks</th></tr></thead>
            <tbody>{reports.data.map(row => <tr key={row._id}>
              <td>{row.Type}</td>
              <td><span className={`tag ${row.progress === 'Completed' ? 'tag-ok' : 'tag-wait'}`}>{row.progress}</span></td>
              <td>{row.LabRemarks || '—'}</td><td>{row.doctorRemarks || '—'}</td>
            </tr>)}</tbody>
          </table>
        </ListState>
      </Section>
    </>}
  </Workspace>;
}
