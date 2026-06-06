export default function Navbar() {
  return (
    <div className="navbar" role="banner">
      <div className="container">
        <div className="navbar_inner" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', width: '100%' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
            <a href="/" className="nav_link w-inline-block hover-underline" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <div className="p_xlarge" style={{ margin: 0 }}>Home</div>
            </a>
            <a href="/investment-calculators" className="nav_link w-inline-block hover-underline" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'relative' }}>
              <div className="p_xlarge" style={{ margin: 0 }}>Calculators</div>
            </a>
            <div className="navbar_cta">
              <a href="/talk-with-me" className="nav_link w-inline-block hover-underline" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', position: 'relative' }}>
                <div className="p_xlarge" style={{ margin: 0 }}>Talk with me</div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
