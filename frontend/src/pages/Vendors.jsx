import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import VendorCard from '../components/VendorCard.jsx';
import api from '../services/api.js';

const categories = ['all', 'Photography', 'Catering', 'Decoration', 'Venue', 'Music & DJ', 'Makeup Artist'];

const Vendors = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (searchParams.get('search')) params.search = searchParams.get('search');
        if (searchParams.get('category')) params.category = searchParams.get('category');
        if (searchParams.get('location')) params.location = searchParams.get('location');
        if (searchParams.get('sort')) params.sort = searchParams.get('sort');
        const { data } = await api.get('/vendors', { params });
        setVendors(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [searchParams]);

  const locations = useMemo(
    () => [...new Set(vendors.map((vendor) => vendor.location))].sort(),
    [vendors]
  );

  const applyFilters = (event) => {
    event.preventDefault();
    const next = {};
    if (search.trim()) next.search = search.trim();
    if (category && category !== 'all') next.category = category;
    if (location.trim()) next.location = location.trim();
    if (sort) next.sort = sort;
    setSearchParams(next);
  };

  return (
    <section className="section animate-fade-in-up">
      <div className="container">
        <div className="section-heading">
          <p className="eyebrow">Directory</p>
          <h1>Explore Vendors</h1>
          <p className="lede">Search by name, filter by category or city, and sort by starting price.</p>
        </div>

        <form className="filter-bar" onSubmit={applyFilters}>
          <input
            type="search"
            placeholder="Vendor name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item === 'all' ? 'All categories' : item}
              </option>
            ))}
          </select>
          <input
            type="text"
            list="locations"
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <datalist id="locations">
            {locations.map((item) => (
              <option key={item} value={item} />
            ))}
          </datalist>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">Newest</option>
            <option value="price-asc">Price: low to high</option>
            <option value="price-desc">Price: high to low</option>
          </select>
          <button className="btn btn-primary" type="submit">
            Apply
          </button>
        </form>

        {loading && <p className="page-status">Loading vendors...</p>}
        {error && <p className="alert error">{error}</p>}
        {!loading && !error && vendors.length === 0 && (
          <p className="page-status">No vendors match these filters.</p>
        )}
        <div className="vendor-grid">
          {vendors.map((vendor) => (
            <VendorCard key={vendor._id} vendor={vendor} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Vendors;
