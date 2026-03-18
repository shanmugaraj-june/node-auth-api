import { useParams } from 'react-router-dom';
import Navbar              from '../components/Navbar';
import SlotPicker          from '../components/SlotPicker';
import BookingConfirmModal from '../components/BookingConfirmModal';
import useBooking          from '../hooks/useBooking';

const SPECIALTY_COLORS = {
  'Cardiologist':      { bg: '#FAECE7', text: '#712B13' },
  'Neurologist':       { bg: '#EEEDFE', text: '#3C3489' },
  'Dermatologist':     { bg: '#FBEAF0', text: '#72243E' },
  'Orthopedic':        { bg: '#E1F5EE', text: '#085041' },
  'General Physician': { bg: '#E6F1FB', text: '#0C447C' },
};

const getInitials = (name = '') =>
  name.replace('Dr. ', '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

const DoctorProfile = () => {
  const { id } = useParams();
  const {
    doctor, slotsByDate, selectedSlot,
    showModal, notes, setNotes,
    loading, booking, error, success,
    handleSelectSlot, handleCloseModal,
    handleConfirmBooking, formatDate, formatTime,
    goBack, goAppointments,
  } = useBooking(id);

  const color = SPECIALTY_COLORS[doctor?.specialization] || { bg: '#F1EFE8', text: '#444441' };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="profile-skeleton">
            <div className="skel-circle" />
            <div className="skel-lines">
              <div className="skel-line wide" />
              <div className="skel-line narrow" />
            </div>
          </div>
          <div className="slot-skel-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="slot-skel" />
            ))}
          </div>
        </main>
      </>
    );
  }

  if (error && !doctor) {
    return (
      <>
        <Navbar />
        <main className="page-container">
          <div className="alert alert-error">{error}</div>
          <button className="btn-ghost" onClick={goBack} style={{ marginTop: '1rem' }}>
            ← Back to doctors
          </button>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="page-container profile-page">

        {/* Back link */}
        <button className="back-btn" onClick={goBack}>← Back to doctors</button>

        {/* Success banner */}
        {success && (
          <div className="alert alert-success">
            Appointment booked successfully!{' '}
            <button className="link-btn" onClick={goAppointments}>
              View my appointments →
            </button>
          </div>
        )}

        {/* Error banner */}
        {error && <div className="alert alert-error">{error}</div>}

        <div className="profile-layout">

          {/* ── Left: Doctor info ── */}
          <aside className="profile-card">
            <div className="profile-avatar" style={{ background: color.bg, color: color.text }}>
              {getInitials(doctor?.name)}
            </div>
            <h1 className="profile-name">{doctor?.name}</h1>
            <span className="profile-badge" style={{ background: color.bg, color: color.text }}>
              {doctor?.specialization}
            </span>

            <div className="profile-details">
              <div className="detail-row">
                <span className="detail-icon">✉</span>
                <span>{doctor?.email}</span>
              </div>
              {doctor?.phone && (
                <div className="detail-row">
                  <span className="detail-icon">✆</span>
                  <span>{doctor?.phone}</span>
                </div>
              )}
              <div className="detail-row">
                <span className="detail-icon">◷</span>
                <span>30-minute appointments</span>
              </div>
            </div>
          </aside>

          {/* ── Right: Slot picker ── */}
          <section className="slots-section">
            <h2>Available slots</h2>
            <p className="slots-sub">Select a time to book your appointment</p>
            <SlotPicker
              slotsByDate={slotsByDate}
              onSelect={handleSelectSlot}
              formatDate={formatDate}
              formatTime={formatTime}
            />
          </section>

        </div>
      </main>

      {/* Confirm modal */}
      {showModal && (
        <BookingConfirmModal
          doctor={doctor}
          slot={selectedSlot}
          notes={notes}
          onNotesChange={setNotes}
          onConfirm={handleConfirmBooking}
          onCancel={handleCloseModal}
          booking={booking}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
    </>
  );
};

export default DoctorProfile;