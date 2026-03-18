import { useNavigate } from 'react-router-dom';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   bg: '#FAEEDA', text: '#633806' },
  confirmed: { label: 'Confirmed', bg: '#EAF3DE', text: '#27500A' },
  cancelled: { label: 'Cancelled', bg: '#F1EFE8', text: '#5F5E5A' },
  completed: { label: 'Completed', bg: '#E6F1FB', text: '#0C447C' },
};

const SPECIALTY_COLORS = {
  'Cardiologist':      '#D85A30',
  'Neurologist':       '#7F77DD',
  'Dermatologist':     '#D4537E',
  'Orthopedic':        '#1D9E75',
  'General Physician': '#378ADD',
};

const AppointmentCard = ({ appointment, onCancel, formatDate, formatTime, isPast }) => {
  const navigate  = useNavigate();
  const status    = STATUS_CONFIG[appointment.status] || STATUS_CONFIG.pending;
  const accentColor = SPECIALTY_COLORS[appointment.specialization] || '#888780';
  const canCancel = !isPast && appointment.status !== 'cancelled' && appointment.status !== 'completed';

  return (
    <div className={`appt-card ${isPast ? 'appt-card-past' : ''}`}>

      {/* Left accent bar */}
      <div className="appt-accent" style={{ background: accentColor }} />

      <div className="appt-body">
        <div className="appt-top">
          <div className="appt-main">
            <div className="appt-doctor">{appointment.doctor_name}</div>
            <div className="appt-specialty">{appointment.specialization}</div>
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

        <div className="appt-actions">
         <button
  className="btn-ghost btn-sm"
  onClick={() => {
    console.log('Navigating to doctor id:', appointment.doctor_id);
    navigate(`/doctors/${appointment.doctor_id}`);
  }}
>
  View doctor
</button>
          {canCancel && (
            <button
              className="btn-danger-ghost btn-sm"
              onClick={() => onCancel(appointment)}
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppointmentCard;