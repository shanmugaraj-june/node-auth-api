const BookingConfirmModal = ({
  doctor, slot,
  notes, onNotesChange,
  onConfirm, onCancel,
  booking, formatDate, formatTime,
}) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div className="modal" onClick={e => e.stopPropagation()}>

      <div className="modal-header">
        <h2>Confirm appointment</h2>
        <button className="modal-close" onClick={onCancel}>✕</button>
      </div>

      <div className="modal-body">
        <div className="confirm-row">
          <span className="confirm-label">Doctor</span>
          <span className="confirm-value">{doctor?.name}</span>
        </div>
        <div className="confirm-row">
          <span className="confirm-label">Specialty</span>
          <span className="confirm-value">{doctor?.specialization}</span>
        </div>
        <div className="confirm-row">
          <span className="confirm-label">Date</span>
          <span className="confirm-value">{formatDate(slot?.slot_date?.split('T')[0])}</span>
        </div>
        <div className="confirm-row">
          <span className="confirm-label">Time</span>
          <span className="confirm-value">
            {formatTime(slot?.start_time)} – {formatTime(slot?.end_time)}
          </span>
        </div>

        <div className="notes-field">
          <label htmlFor="notes">Notes for doctor <span className="optional">(optional)</span></label>
          <textarea
            id="notes"
            rows={3}
            placeholder="Describe your symptoms or reason for visit..."
            value={notes}
            onChange={e => onNotesChange(e.target.value)}
          />
        </div>
      </div>

      <div className="modal-footer">
        <button className="btn-ghost" onClick={onCancel} disabled={booking}>
          Cancel
        </button>
        <button className="btn-primary" onClick={onConfirm} disabled={booking}>
          {booking ? 'Booking...' : 'Confirm booking'}
        </button>
      </div>

    </div>
  </div>
);

export default BookingConfirmModal;