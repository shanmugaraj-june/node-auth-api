const CancelConfirmModal = ({
  appointment, onConfirm, onDismiss,
  cancelling, error, formatDate, formatTime,
}) => (
  <div className="modal-overlay" onClick={onDismiss}>
    <div className="modal" onClick={e => e.stopPropagation()}>

      <div className="modal-header">
        <h2>Cancel appointment?</h2>
        <button className="modal-close" onClick={onDismiss}>✕</button>
      </div>

      <div className="modal-body">
        <p className="cancel-warning">
          This will free up the slot for other patients. This action cannot be undone.
        </p>

        <div className="confirm-row">
          <span className="confirm-label">Doctor</span>
          <span className="confirm-value">{appointment.doctor_name}</span>
        </div>
        <div className="confirm-row">
          <span className="confirm-label">Date</span>
          <span className="confirm-value">{formatDate(appointment.slot_date)}</span>
        </div>
        <div className="confirm-row">
          <span className="confirm-label">Time</span>
          <span className="confirm-value">
            {formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}
          </span>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginTop: '0.75rem' }}>
            {error}
          </div>
        )}
      </div>

      <div className="modal-footer">
        <button className="btn-ghost" onClick={onDismiss} disabled={cancelling}>
          Keep appointment
        </button>
        <button className="btn-danger" onClick={onConfirm} disabled={cancelling}>
          {cancelling ? 'Cancelling...' : 'Yes, cancel'}
        </button>
      </div>

    </div>
  </div>
);

export default CancelConfirmModal;