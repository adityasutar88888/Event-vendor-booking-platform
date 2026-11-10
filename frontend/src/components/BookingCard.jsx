const formatDate = (value) =>
  new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

const BookingCard = ({ booking, variant = 'customer', onCancel, onAccept, onReject, busyId }) => {
  const vendor = booking.vendorId;
  const customer = booking.customerId;
  const pending = booking.status === 'pending';
  const disabled = busyId === booking._id;

  return (
    <article className="booking-card">
      <div className="booking-card-top">
        <div>
          <h3>{variant === 'vendor' ? customer?.name : vendor?.businessName}</h3>
          <p className="muted">{booking.eventName} · {booking.eventType}</p>
        </div>
        <span className={`status status-${booking.status}`}>{booking.status}</span>
      </div>
      <ul className="booking-details">
        <li>
          <strong>Event date:</strong> {formatDate(booking.eventDate)}
        </li>
        {variant === 'vendor' && (
          <>
            <li>
              <strong>Contact:</strong> {customer?.email} · {customer?.phone}
            </li>
            <li>
              <strong>Location:</strong> {booking.eventLocation}
            </li>
            <li>
              <strong>Guests:</strong> {booking.guestCount}
            </li>
            {booking.requirements ? (
              <li>
                <strong>Requirements:</strong> {booking.requirements}
              </li>
            ) : null}
          </>
        )}
        {variant === 'customer' && (
          <li>
            <strong>Requested:</strong> {formatDate(booking.createdAt)}
          </li>
        )}
      </ul>
      {variant === 'customer' && pending && (
        <button className="btn btn-ghost" type="button" disabled={disabled} onClick={() => onCancel(booking._id)}>
          {disabled ? 'Cancelling...' : 'Cancel booking'}
        </button>
      )}
      {variant === 'vendor' && pending && (
        <div className="booking-actions">
          <button className="btn btn-primary" type="button" disabled={disabled} onClick={() => onAccept(booking._id)}>
            Accept Booking
          </button>
          <button className="btn btn-ghost" type="button" disabled={disabled} onClick={() => onReject(booking._id)}>
            Reject Booking
          </button>
        </div>
      )}
    </article>
  );
};

export default BookingCard;
