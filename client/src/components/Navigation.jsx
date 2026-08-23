const items = ['Dashboard', 'Inventory', 'Job cards', 'Customers', 'Billing'];

function Navigation() {
  return (
    <nav aria-label="Main navigation">
      {items.map((item, index) => (
        <button key={item} type="button" className={index === 0 ? 'active' : ''}>
          {item}
        </button>
      ))}
    </nav>
  );
}

export default Navigation;
