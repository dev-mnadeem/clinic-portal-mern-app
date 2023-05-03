import {useState} from 'react';
import Section from './Section';
import ListState from './ListState';
import useResource from '../hooks/useResource';
import {send, fetchJson, errorMessage} from '../api/clinic';

const loadDesk = () => fetchJson('Admin/assignments');
const lanes = [
  {kind:'report', title:'Test requests', rows:'reports', targets:'labs', target:'Laboratory', endpoint:'assignReport', body:(request, target) => ({reportId:request, LabId:target}), describe:row => `${row.patientName || 'Patient'} — ${row.Type}`},
  {kind:'prescription', title:'Prescriptions', rows:'prescriptions', targets:'pharmacies', target:'Pharmacy', endpoint:'assignPrescription', body:(request, target) => ({prescriptionId:request, pharmacyId:target}), describe:row => `${row.patientId?.name || 'Patient'} — ${row.Quantity} × ${row.Medicine}`},
];

export default function AssignmentDesk() {
  const desk = useResource(loadDesk, null);
  const [notice, setNotice] = useState(null);

  async function assign(event, lane) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    try {
      await send(`Admin/${lane.endpoint}`, lane.body(fields.get('request'), fields.get('destination')));
      setNotice({ok:true, text:`Routed the ${lane.kind}.`});
      await desk.reload();
    } catch (failure) {
      setNotice({ok:false, text:errorMessage(failure, 'The request could not be assigned. Refresh and try again.')});
    }
  }

  return <ListState loading={desk.loading} error={desk.error} empty={!desk.data} emptyText="" onRetry={desk.reload}>
    {notice && <p className={`notice ${notice.ok ? 'notice-ok' : 'notice-error'}`} role={notice.ok ? 'status' : 'alert'}>{notice.text}</p>}
    <div className="lanes">
      {desk.data && lanes.map(lane => {
        const requests = desk.data[lane.rows];
        const targets = desk.data[lane.targets];
        return <Section key={lane.kind} id={`${lane.kind}-lane`} title={lane.title} aside={<span className="count">{requests.length} waiting</span>}>
          {!requests.length ? <p className="notice notice-empty">Nothing to route.</p>
            : !targets.length ? <p className="notice notice-empty">Add a {lane.target.toLowerCase()} account before routing these.</p>
            : <form className="stack" onSubmit={event => assign(event, lane)}>
              <label htmlFor={`${lane.kind}-request`}>Request
                <select id={`${lane.kind}-request`} name="request" required defaultValue="">
                  <option value="">Choose a request</option>
                  {requests.map(row => <option key={row._id} value={row._id}>{lane.describe(row)}</option>)}
                </select>
              </label>
              <label htmlFor={`${lane.kind}-destination`}>{lane.target}
                <select id={`${lane.kind}-destination`} name="destination" required defaultValue="">
                  <option value="">Choose a {lane.target.toLowerCase()}</option>
                  {targets.map(row => <option key={row._id} value={row._id}>{row.name}</option>)}
                </select>
              </label>
              <button className="button">Route {lane.kind}</button>
            </form>}
        </Section>;
      })}
    </div>
  </ListState>;
}
