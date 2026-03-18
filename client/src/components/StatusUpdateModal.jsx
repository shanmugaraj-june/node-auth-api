const ACTION_COPY = {
  confirmed: {
    title:   'Confirm appointment?',
    warning: null,
    cta:     'Yes, confirm',
    btnClass:'btn-confirm',
  },
  completed: {
    title:   'Mark as completed?',
    warning: 'This closes the appointment. The slot will remain taken.',
    cta:     'Mark completed',
    btnClass:'btn-complete',
  },
  cancelled: {
    title:   'Cancel this appointment?',
    warning: 'The patient will lose their slot. This cannot be undone.',
    cta:     'Yes, cancel',
    btnClass:'btn-danger',
  },
};

const StatusUpdateModal = ({
  appointment, newStatus,
  onConfirm, onDismiss,
  updating, error,
  formatDate, formatTime,
}) => {
  const copy = ACTION_COPY[newStatus];

  return (
    <div className="modal-overlay" onClick={onDismiss}>
      <div className="modal" onClick={e => e.stopPropagation()}>

        <div className="modal-header">
          <h2>{copy.title}</h2>
          <button className="modal-close" onClick={onDismiss}>✕</button>
        </div>

        <div className="modal-body">
          {copy.warning && (
            <p className="cancel-warning">{copy.warning}</p>
          )}

          <div className="confirm-row">
            <span className="confirm-label">Patient</span>
            <span className="confirm-value">{appointment.patient_name}</span>
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
          {appointment.notes && (
            <div className="confirm-row">
              <span className="confirm-label">Notes</span>
              <span className="confirm-value" style={{ fontStyle: 'italic' }}>
                {appointment.notes}
              </span>
            </div>
          )}

          {error && (
            <div className="alert alert-error" style={{ marginTop: '0.75rem' }}>
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-ghost" onClick={onDismiss} disabled={updating}>
            Cancel
          </button>
          <button className={copy.btnClass} onClick={onConfirm} disabled={updating}>
            {updating ? 'Updating...' : copy.cta}
          </button>
        </div>

      </div>
    </div>
  );
};

export default StatusUpdateModal;