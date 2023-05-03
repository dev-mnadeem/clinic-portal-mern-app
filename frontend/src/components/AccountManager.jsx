import {useCallback, useState} from 'react';
import Section from './Section';
import ListState from './ListState';
import useResource from '../hooks/useResource';
import {send, fetchJson, errorMessage} from '../api/clinic';

// What the admin API calls each account type, and the extra profile fields it accepts.
export const accountKinds = {
  patients:{singular:'Patient', api:'Patient', list:'getAllPatients', extra:[['age', 'Age', 'number'], ['disease', 'Condition', 'text'], ['address', 'Address', 'text']]},
  doctors:{singular:'Doctor', api:'Doctor', list:'getAllDoctors', extra:[['specification', 'Speciality', 'text'], ['address', 'Address', 'text']]},
  pharmacies:{singular:'Pharmacy', api:'Pharmacy', list:'getAllPharmacies', extra:[]},
  labs:{singular:'Laboratory', api:'Lab', list:'getAllLabs', extra:[['specification', 'Tests offered', 'text'], ['address', 'Address', 'text']]},
};

function AccountForm({kind, account, onSaved, onCancel}) {
  const {singular, api, extra} = accountKinds[kind];
  const editing = Boolean(account);
  const blank = {name:'', email:'', phone:'', password:'', ...Object.fromEntries(extra.map(([field]) => [field, '']))};
  const [form, setForm] = useState(editing ? {...blank, ...account, phone:account.phoneNumber || '', password:''} : blank);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const id = editing ? account._id : `new-${kind}`;
  const update = field => event => setForm({...form, [field]:event.target.value});

  async function submit(event) {
    event.preventDefault();
    setBusy(true);
    setError('');
    const payload = {name:form.name, email:form.email, phone:form.phone, ...Object.fromEntries(extra.map(([field]) => [field, form[field]]))};
    if (form.password) payload.password = form.password;
    try {
      await send(`Admin/${editing ? 'update' : 'add'}${api}`, payload);
      onSaved(editing ? `Saved changes to ${form.name || form.email}.` : `Created the ${singular.toLowerCase()} account for ${form.name || form.email}.`);
      if (!editing) setForm(blank);
    } catch (failure) {
      setError(errorMessage(failure, 'The account could not be saved.'));
    } finally {
      setBusy(false);
    }
  }

  return <form className="form-grid" onSubmit={submit} aria-label={editing ? `Edit ${account.name || account.email}` : `New ${singular.toLowerCase()}`}>
    <label htmlFor={`${id}-name`}>Name<input id={`${id}-name`} required={!editing} value={form.name} onChange={update('name')}/></label>
    <label htmlFor={`${id}-email`}>Email<input id={`${id}-email`} type="email" required readOnly={editing} value={form.email} onChange={update('email')}/></label>
    <label htmlFor={`${id}-phone`}>Phone<input id={`${id}-phone`} type="tel" required={!editing} value={form.phone} onChange={update('phone')}/></label>
    <label htmlFor={`${id}-password`}>{editing ? 'New password (optional)' : 'Initial password'}
      <input id={`${id}-password`} type="password" autoComplete="new-password" minLength={12} required={!editing} value={form.password} onChange={update('password')}/>
    </label>
    {extra.map(([field, label, type]) => <label key={field} htmlFor={`${id}-${field}`}>{label}
      <input id={`${id}-${field}`} type={type} min={type === 'number' ? 0 : undefined} required={!editing && field === 'age'} value={form[field] ?? ''} onChange={update(field)}/>
    </label>)}
    {error && <p className="notice notice-error span-2" role="alert">{error}</p>}
    <div className="actions span-2">
      <button className="button" disabled={busy}>{editing ? 'Save changes' : `Create ${singular.toLowerCase()}`}</button>
      {onCancel && <button type="button" className="button button-quiet" onClick={onCancel}>Cancel</button>}
    </div>
  </form>;
}

export default function AccountManager({kind}) {
  const {singular, api, list} = accountKinds[kind];
  const accounts = useResource(useCallback(() => fetchJson(`Admin/${list}`), [list]), []);
  const [editing, setEditing] = useState(null);
  const [notice, setNotice] = useState(null);

  function saved(text) {
    setEditing(null);
    setNotice({ok:true, text});
    void accounts.reload();
  }
  async function remove(account) {
    if (!window.confirm(`Delete ${account.name || account.email}? Their linked records are removed or returned to the routing desk.`)) return;
    try {
      await send(`Admin/del${api}`, {userId:account._id});
      saved(`Deleted ${account.name || account.email}.`);
    } catch (failure) {
      setNotice({ok:false, text:errorMessage(failure, 'The account could not be deleted.')});
    }
  }

  return <>
    {notice && <p className={`notice ${notice.ok ? 'notice-ok' : 'notice-error'}`} role={notice.ok ? 'status' : 'alert'}>{notice.text}</p>}
    <Section id={`${kind}-list`} title={`${singular} accounts`}>
      <ListState {...accounts} empty={!accounts.data.length} emptyText={`No ${singular.toLowerCase()} accounts yet.`} onRetry={accounts.reload}>
        <ul className="rows">
          {accounts.data.map(account => <li key={account._id} className="row row-wrap">
            <div><strong>{account.name || 'Unnamed'}</strong><span className="muted">{account.email}{account.phoneNumber ? ` · ${account.phoneNumber}` : ''}</span></div>
            <div className="actions">
              <button type="button" className="button button-quiet" aria-expanded={editing === account._id} onClick={() => setEditing(editing === account._id ? null : account._id)}>Edit</button>
              <button type="button" className="button button-danger" onClick={() => remove(account)}>Delete</button>
            </div>
            {editing === account._id && <AccountForm kind={kind} account={account} onSaved={saved} onCancel={() => setEditing(null)}/>}
          </li>)}
        </ul>
      </ListState>
    </Section>
    <Section id={`${kind}-new`} title={`Add a ${singular.toLowerCase()}`}>
      <AccountForm kind={kind} onSaved={saved}/>
    </Section>
  </>;
}
