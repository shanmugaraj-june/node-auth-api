const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: '#FAEEDA', text: '#633806' },
  confirmed: { label: 'Confirmed', bg: '#EAF3DE', text: '#27500A' },
  cancelled: { label: 'Cancelled', bg: '#F1EFE8', text: '#5F5E5A' },
  completed: { label: 'Completed', bg: '#E6F1FB', text: '#0C447C' },
};

const getInitials = (name = '') =>
  name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const DoctorAppointmentCard = ({
  appointment, onAction,
  formatDate, formatTime, isPast,
}) => {
  const status     = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;
  const canConfirm = !isPast && appointment.status === 'pending';
  const canComplete= !isPast && appointment.status === 'confirmed';
  const canCancel  = !isPast && !['cancelled','completed'].includes(appointment.status);

  return (
    <div className={`appt-card ${isPast ? 'appt-card-past' : ''}`}>
      <div
        className="appt-accent"
        style={{ background: appointment.status === 'cancelled' ? '#b4b2a9' : '#534AB7' }}
      />

      <div className="appt-body">
        <div className="appt-top">

          {/* Patient info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="patient-avatar">
              {getInitials(appointment.patient_name)}
            </div>
            <div>
              <div className="appt-doctor">{appointment.patient_name}</div>
              <div className="appt-specialty">{appointment.patient_email}</div>
            </div>
          </div>

          <span
            className="appt-status"
            style={{ background: status.bg, color: status.text }}
          >
            {status.label}
          </span>
        </div>

        <div className="appt-meta">
          <span className="appt-meta-item">
            <span className="meta-icon">◷</span>
            {formatDate(appointment.slot_date)} · {formatTime(appointment.start_time)} – {formatTime(appointment.end_time)}
          </span>
          {appointment.notes && (
            <span className="appt-meta-item appt-notes">
              <span className="meta-icon">✎</span>
              {appointment.notes}
            </span>
          )}
        </div>

        {/* Action buttons — only shown for active appointments */}
        {(canConfirm || canComplete || canCancel) && (
          <div className="appt-actions">
            {canConfirm && (
              <button
                className="btn-ghost btn-sm"
                onClick={() => onAction(appointment, 'confirmed')}
              >
                Confirm
              </button>
            )}
            {canComplete && (
              <button
                className="btn-complete-sm btn-sm"
                onClick={() => onAction(appointment, 'completed')}
              >
                Mark completed
              </button>
            )}
            {canCancel && (
              <button
                className="btn-danger-ghost btn-sm"
                onClick={() => onAction(appointment, 'cancelled')}
              >
                Cancel
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorAppointmentCard;