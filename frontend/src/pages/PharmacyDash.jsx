import {useState} from 'react';
import Workspace from '../components/Workspace';
import Section from '../components/Section';
import ListState from '../components/ListState';
import useResource from '../hooks/useResource';
import {send, fetchJson, errorMessage} from '../api/clinic';

const loadStock = async () => Object.entries(await send('Pharmacies/getAllMedicine') || {}).filter(([, count]) => count > 0);

// One row per patient, with every undelivered prescription assigned here.
async function loadQueue() {
  const patients = await fetchJson('Pharmacies/patients');
  return Promise.all(patients.map(async patient => ({
    ...patient,
    prescriptions:(await send('Pharmacies/getClientPrescription', {patientId:patient._id})).Prescription,
  })));
}

function StockForm({onAdded}) {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [error, setError] = useState('');
  async function submit(event) {
    event.preventDefault();
    setError('');
    try {
      await send('Pharmacies/addMedicine', {Med:name.trim(), quantity:Number(quantity)});
      setName('');
      setQuantity('');
      onAdded();
    } catch (failure) {
      setError(errorMessage(failure, 'Stock could not be updated.'));
    }
  }
  return <form className="form-grid" onSubmit={submit}>
    <label htmlFor="stock-name">Medicine<input id="stock-name" required pattern="[^.$]+" title="Names cannot contain . or $" value={name} onChange={event => setName(event.target.value)}/></label>
    <label htmlFor="stock-qty">Units received<input id="stock-qty" type="number" min="1" step="1" required value={quantity} onChange={event => setQuantity(event.target.value)}/></label>
    {error && <p className="notice notice-error span-2" role="alert">{error}</p>}
    <button className="button">Add to stock</button>
  </form>;
}

export default function PharmacyDash() {
  const queue = useResource(loadQueue, []);
  const stock = useResource(loadStock, []);
  const [notice, setNotice] = useState(null);

  async function dispense(patient, prescription) {
    try {
      await send('Pharmacies/deliverMedicine', {PresId:prescription._id});
      setNotice({ok:true, text:`Dispensed ${prescription.Quantity} × ${prescription.Medicine} to ${patient.name}.`});
      await Promise.all([queue.reload(), stock.reload()]);
    } catch (failure) {
      setNotice({ok:false, text:errorMessage(failure, 'That prescription could not be dispensed.')});
    }
  }

  return <Workspace title="Dispensing" intro="Prescriptions routed to this pharmacy, and the stock they draw from.">
    {notice && <p className={`notice ${notice.ok ? 'notice-ok' : 'notice-error'}`} role={notice.ok ? 'status' : 'alert'}>{notice.text}</p>}
    <Section id="queue-heading" title="Waiting to collect">
      <ListState {...queue} empty={!queue.data.length} emptyText="No prescriptions are waiting." onRetry={queue.reload}>
        <ul className="rows">
          {queue.data.flatMap(patient => patient.prescriptions.map(prescription => <li key={prescription._id} className="row">
            <div><strong>{patient.name}</strong><span className="muted">{prescription.Quantity} × {prescription.Medicine} · prescribed by {prescription.doctorName}</span></div>
            <div className="actions"><button type="button" className="button" onClick={() => dispense(patient, prescription)}>Dispense</button></div>
          </li>))}
        </ul>
      </ListState>
    </Section>
    <Section id="stock-heading" title="Stock">
      <StockForm onAdded={stock.reload}/>
      <ListState {...stock} empty={!stock.data.length} emptyText="No stock recorded yet." onRetry={stock.reload}>
        <table className="table">
          <thead><tr><th scope="col">Medicine</th><th scope="col" className="num">Units</th></tr></thead>
          <tbody>{stock.data.map(([name, count]) => <tr key={name}><td>{name}</td><td className="num">{count}</td></tr>)}</tbody>
        </table>
      </ListState>
    </Section>
  </Workspace>;
}
