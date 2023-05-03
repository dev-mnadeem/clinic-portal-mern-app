export default function Section({id, title, aside, children}) {
  return <section className="panel" aria-labelledby={id}>
    <div className="panel-head">
      <h2 id={id}>{title}</h2>
      {aside}
    </div>
    {children}
  </section>;
}
