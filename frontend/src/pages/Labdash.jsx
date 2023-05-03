import {useState} from 'react';
import Workspace from '../components/Workspace';
import Section from '../components/Section';
import ListState from '../components/ListState';
import useResource from '../hooks/useResource';
import {send, fetchJson, errorMessage} from '../api/clinic';

const loadOpen = () => fetchJson('Labs/getAllReport');
const loadCompleted = async () => (await send('Labs/getAllReportsLab')).filter(row => row.progress === 'Completed');

function ResultForm({report, onFiled}) {
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    try {
      await send('Labs/addReportRemarks', {reportId:report._id, Remarks:remarks});
      onFiled(report);
    } catch (failure) {
      setError(errorMessage(failure, 'The result could not be filed.'));
      setBusy(false);
    }
  }
  return <form className="inline-form" onSubmit={submit}>
    <label htmlFor={`remarks-${report._id}`}>Result and remarks
      <textarea id={`remarks-${report._id}`} rows={2} required value={remarks} onChange={event => setRemarks(event.target.value)}/>
    </label>
    {error && <p className="notice notice-error" role="alert">{error}</p>}
    <div className="actions"><button className="button" disabled={busy}>File result</button></div>
  </form>;
}

export default function Labdash() {
  const open = useResource(loadOpen, []);
  const completed = useResource(loadCompleted, []);
  const [notice, setNotice] = useState('');
  async function filed(report) {
    setNotice(`Filed the ${report.Type} result for ${report.patientName}.`);
    await Promise.all([open.reload(), completed.reload()]);
  }
  return <Workspace title="Laboratory requests" intro="Only requests the administrator has routed to this laboratory appear here.">
    {notice && <p className="notice notice-ok" role="status">{notice}</p>}
    <Section id="open-heading" title="Waiting for results">
      <ListState {...open} empty={!open.data.length} emptyText="Nothing is waiting. New requests appear once they are routed here." onRetry={open.reload}>
        <ul className="rows">
          {open.data.map(row => <li key={row._id} className="row row-wrap">
            <div><strong>{row.Type}</strong><span className="muted">{row.patientName}</span></div>
            <ResultForm report={row} onFiled={filed}/>
          </li>)}
        </ul>
      </ListState>
    </Section>
    <Section id="done-heading" title="Filed results">
      <ListState {...completed} empty={!completed.data.length} emptyText="No results filed yet." onRetry={completed.reload}>
        <table className="table">
          <thead><tr><th scope="col">Test</th><th scope="col">Patient</th><th scope="col">Remarks</th></tr></thead>
          <tbody>{completed.data.map(row => <tr key={row._id}><td>{row.Type}</td><td>{row.patientName}</td><td>{row.LabRemarks}</td></tr>)}</tbody>
        </table>
      </ListState>
    </Section>
  </Workspace>;
}
