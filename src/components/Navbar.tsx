export default function Navbar() {
  return (
    <div
      data-animation="over-right"
      className="navbar w-nav"
      data-easing2="ease-in-out-quart"
      data-easing="ease-in-out-quart"
      homepage="true"
      data-collapse="small"
      role="banner"
      data-no-scroll={1}
      data-duration={500}
      data-doc-height={1}
    >
      <div className="container">
        <div className="navbar_inner">
          <a
            href="#"
            aria-current="page"
            className="navbar_brand w-inline-block w--current"
            style={{ display: 'none' }}
          />
          <nav role="navigation" className="navbar_menu w-nav-menu">
            <div className="nav_link-set" style={{ marginLeft: '1rem' }}>
              <a href="#" className="nav_link w-inline-block">
                <div>My Journey</div>
              </a>
              <div className="nav_link comma">
                <div>,</div>
              </div>
              <a href="#" className="nav_link w-inline-block">
                <div>Media &amp; Interviews</div>
              </a>
              {/* <div className="nav_link comma">
                <div>,</div>
              </div> */}
              {/* <a href="#" className="nav_link w-inline-block">
                <div>Learning Hub</div>
              </a> */}
              <div className="nav_link comma">
                <div>,</div>
              </div>
              <a href="#" className="nav_link w-inline-block">
                <div>Contact</div>
              </a>
            </div>
            <div className="navbar_cta">
              <a href="#" className="nav_cta w-inline-block">
                <div className="p_xlarge mobile-nav-cta">Financial Educator</div>
              </a>
              {/* <a href="#" className="nav_cta w-inline-block">
                <div className="p_xlarge mobile-nav-cta">Gold &amp; Long-Term Investor</div>
              </a> */}
            </div>
          </nav>
          <div className="nav_menu-icon w-nav-button">
            <div className="nav_menu-icon-inner">
              <div data-label-close="Close" data-label="menu" className="p_xlarge">
                Menu
              </div>
              <div className="nav_menu-icon_box">
                <div className="icon_20">≡</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
