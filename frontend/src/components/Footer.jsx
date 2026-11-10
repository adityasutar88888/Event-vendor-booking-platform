import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="site-footer">
    <div className="container footer-grid">
      <div>
        <h3>EventEase</h3>
        <p>
          EventEase helps customers discover photographers, caterers, venues, and other event vendors,
          then send booking requests directly to the business.
        </p>
      </div>
      <div>
        <h4>Quick links</h4>
        <Link to="/">Home</Link>
        <Link to="/vendors">Explore Vendors</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Login</Link>
      </div>
      <div>
        <h4>Contact</h4>
        <p>hello@eventease.local</p>
        <p>+91 81778 64861</p>
        <p>Maharshtra, India</p>
      </div>
    </div>
    <p className="footer-copy">© {new Date().getFullYear()} EventEase. College mini-project.</p>
  </footer>
);

export default Footer;
