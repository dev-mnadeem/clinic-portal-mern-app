import {useNavigate, Link} from 'react-router-dom';
import {clearSession, currentSession} from '../api/session';

const roleTitles = {patient:'Patient', doctor:'Doctor', lab:'Laboratory', pharmacy:'Pharmacy', admin:'Administrator'};

export default function Workspace({title, intro, tabs, activeTab, onTab, children}) {
  const navigate = useNavigate();
  const session = currentSession();
  function signOut() {
    clearSession();
    navigate('/');
  }
  return <div className="workspace">
    <header className="workspace-bar">
      <span className="brand">Curify</span>
      <span className="who">{roleTitles[session?.role]}{session?.user?.name ? ` · ${session.user.name}` : ''}</span>
      <nav aria-label="Account" className="account-links">
        <Link to="/pass">Change password</Link>
        <button type="button" className="link-button" onClick={signOut}>Sign out</button>
      </nav>
    </header>
    {tabs && <nav className="tabs" aria-label="Sections">
      {tabs.map(([key, label]) => <button key={key} type="button" className="tab" aria-current={activeTab === key ? 'page' : undefined} onClick={() => onTab(key)}>{label}</button>)}
    </nav>}
    <main className="workspace-main">
      <div className="page-heading">
        <h1>{title}</h1>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </main>
  </div>;
}
