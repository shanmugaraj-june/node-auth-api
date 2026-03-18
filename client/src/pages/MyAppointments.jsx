import { Link } from 'react-router-dom';
import Navbar              from '../components/Navbar';
import AppointmentCard     from '../components/AppointmentCard';
import CancelConfirmModal  from '../components/CancelConfirmModal';
import useAppointments     from '../hooks/useAppointments';

const EmptyState = ({ type }) => (
  <div className="appt-empty">
    {type === 'upcoming' ? (
      <>
        <div className="empty-icon">◷</div>
        <p>No upcoming appointments</p>
        <Link to="/doctors" className="btn-primary-sm">Browse doctors</Link>
      </>
    ) : (
      <>
        <div className="empty-icon">✓</div>
        <p>No past appointments yet</p>
      </>
    )}
  </div>
);

const SkeletonCard = () => (
  <div className="appt-card">
    <div className="appt-accent" style={{ background: 'var(--color-border-tertiary)' }} />
    <div className="appt-body" style={{ gap: '10px' }}>
      <div className="skel-line wide"  style={{ height: 14 }} />
      <div className="skel-line narrow" style={{ height: 12 }} />
      <div className="skel-line" style={{ height: 12, width: '50%' }} />
    </div>
  </div>
);

const MyAppointments = () => {
  const {
    upcoming, past, loading, error,
    cancelTarget, cancelling, cancelError,
    handleCancelClick, handleCancelDismiss, handleCancelConfirm,
    formatDate, formatTime, retry,
  } = useAppointments();

  return (
    <>
      <Navbar />
      <main className="page-container">

        <div className="page-header">
          <div>
            <h1>My appointments</h1>
            <p className="page-sub">
              {!loading && `${upcoming.length} upcoming · ${past.length} past`}
            </p>
          </div>
          <Link to="/doctors" className="btn-primary-sm">+ Book new</Link>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}{' '}
            <button className="link-btn" onClick={retry}>Retry</button>
          </div>
        )}

        {/* ── Upcoming ── */}
        <section className="appt-section">
          <h2 className="section-title">Upcoming</h2>
          {loading ? (
            <div className="appt-list">
              {[1, 2].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : upcoming.length === 0 ? (
            <EmptyState type="upcoming" />
          ) : (
            <div className="appt-list">
              {upcoming.map(a => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  onCancel={handleCancelClick}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  isPast={false}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── Past ── */}
        <section className="appt-section">
          <h2 className="section-title">Past &amp; cancelled</h2>
          {loading ? (
            <div className="appt-list">
              {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
            </div>
          ) : past.length === 0 ? (
            <EmptyState type="past" />
          ) : (
            <div className="appt-list">
              {past.map(a => (
                <AppointmentCard
                  key={a.id}
                  appointment={a}
                  onCancel={handleCancelClick}
                  formatDate={formatDate}
                  formatTime={formatTime}
                  isPast={true}
                />
              ))}
            </div>
          )}
        </section>

      </main>

      {cancelTarget && (
        <CancelConfirmModal
          appointment={cancelTarget}
          onConfirm={handleCancelConfirm}
          onDismiss={handleCancelDismiss}
          cancelling={cancelling}
          error={cancelError}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
    </>
  );
};

export default MyAppointments;