import {useState} from 'react';
import Workspace from '../components/Workspace';
import AssignmentDesk from '../components/AssignmentDesk';
import AccountManager, {accountKinds} from '../components/AccountManager';

const tabs = [['routing', 'Routing desk'], ...Object.entries(accountKinds).map(([key, kind]) => [key, `${kind.singular} accounts`])];

export default function AdminDash() {
  const [tab, setTab] = useState('routing');
  return <Workspace title={tab === 'routing' ? 'Route clinical requests' : 'Manage accounts'}
    intro={tab === 'routing' ? 'Labs and pharmacies can open a request only after it is routed to them here.' : 'Create, update and remove the people and providers who use the portal.'}
    tabs={tabs} activeTab={tab} onTab={setTab}>
    {tab === 'routing' ? <AssignmentDesk/> : <AccountManager key={tab} kind={tab}/>}
  </Workspace>;
}
