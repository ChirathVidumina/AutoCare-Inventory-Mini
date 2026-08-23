import Navigation from '../../components/Navigation';

const modules = [
  ['Inventory', 'Track parts and stock levels', 'inventory'],
  ['Job cards', 'Manage workshop jobs', 'job-card'],
  ['Customers and vehicles', 'Keep service history organized', 'customer-vehicle'],
  ['Billing', 'Create invoices and record payments', 'billing'],
];

function Dashboard() {
  return (
    <main style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem', fontFamily: 'sans-serif' }}>
      <header>
        <p>AutoCare Inventory Mini</p>
        <h1>Workshop dashboard</h1>
        <Navigation />
      </header>
      <section aria-label="Frontend modules">
        {modules.map(([name, description, path]) => (
          <article key={path}>
            <h2>{name}</h2>
            <p>{description}</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default Dashboard;
