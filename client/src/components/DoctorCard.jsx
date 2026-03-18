import { useNavigate } from 'react-router-dom';

const SPECIALTY_COLORS = {
  'Cardiologist':      { bg: '#FAECE7', text: '#712B13', dot: '#D85A30' },
  'Neurologist':       { bg: '#EEEDFE', text: '#3C3489', dot: '#7F77DD' },
  'Dermatologist':     { bg: '#FBEAF0', text: '#72243E', dot: '#D4537E' },
  'Orthopedic':        { bg: '#E1F5EE', text: '#085041', dot: '#1D9E75' },
  'General Physician': { bg: '#E6F1FB', text: '#0C447C', dot: '#378ADD' },
};

const getInitials = (name) =>
  name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const DoctorCard = ({ doctor }) => {
  const navigate = useNavigate();
  const color    = SPECIALTY_COLORS[doctor.specialization] || { bg: '#F1EFE8', text: '#444441', dot: '#888780' };

  return (
    <div
      className="doctor-card"
      onClick={() => navigate(`/doctors/${doctor.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && navigate(`/doctors/${doctor.id}`)}
    >
      <div className="card-top">
        <div className="avatar" style={{ background: color.bg, color: color.text }}>
          {getInitials(doctor.name)}
        </div>
        <div>
          <div className="doctor-name">{doctor.name}</div>
          <div className="doctor-email">{doctor.email}</div>
        </div>
      </div>

      <div className="card-bottom">
        <span className="specialty-badge" style={{ background: color.bg, color: color.text }}>
          <span className="badge-dot" style={{ background: color.dot }} />
          {doctor.specialization}
        </span>
        <span className="card-arrow">→</span>
      </div>
    </div>
  );
};

export default DoctorCard;