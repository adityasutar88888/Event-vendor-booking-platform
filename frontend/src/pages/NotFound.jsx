import { Link } from 'react-router-dom';

const NotFound = () => (
  <section className="section">
    <div className="container narrow">
      <h1>Page not found</h1>
      <p className="lede">The page you are looking for does not exist.</p>
      <Link className="btn btn-primary" to="/">
        Back to home
      </Link>
    </div>
  </section>
);

export default NotFound;
