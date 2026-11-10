import { Link } from 'react-router-dom';
import { MapPin, Star } from 'lucide-react';

const formatPrice = (price, category) => {
  if (category === 'Catering') {
    return `₹${Number(price).toLocaleString('en-IN')}/guest`;
  }
  return `From ₹${Number(price).toLocaleString('en-IN')}`;
};

const VendorCard = ({ vendor }) => (
  <article className="vendor-card">
    <div className="vendor-card-image">
      <img src={vendor.image} alt={vendor.businessName} />
    </div>
    <div className="vendor-card-body">
      <p className="eyebrow">{vendor.category}</p>
      <h3>{vendor.businessName}</h3>
      <p className="muted">
        <MapPin size={16} /> {vendor.location}
      </p>
      <div className="vendor-card-meta">
        <span>{formatPrice(vendor.price, vendor.category)}</span>
        <span className="rating">
          <Star size={16} /> {vendor.rating ? vendor.rating.toFixed(1) : 'New'}
        </span>
      </div>
      <Link to={`/vendors/${vendor._id}`} className="btn btn-secondary">
        View Details
      </Link>
    </div>
  </article>
);

export default VendorCard;
