import Navbar              from '../components/Navbar';
import DoctorAppointmentCard from '../components/DoctorAppointmentCard';
import StatusUpdateModal   from '../components/StatusUpdateModal';
import useDoctorDashboard  from '../hooks/useDoctorDashboard';

const TABS = [
  { key: 'upcoming',  label: 'Upcoming'  },
  { key: 'today',     label: 'Today'     },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

const SkeletonCard = () => (
  <div className="appt-card">
    <div className="appt-accent" style={{ background: 'var(--color-border-tertiary)' }} />
    <div className="appt-body" style={{ gap: 10 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="skel-circle" style={{ width: 36, height: 36 }} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div className="skel-line wide"   style={{ height: 13 }} />
          <div className="skel-line narrow" style={{ height: 11 }} />
        </div>
      </div>
      <div className="skel-line" style={{ height: 11, width: '45%' }} />
    </div>
  </div>
);

const DoctorDashboard = () => {
  const {
    tabs, stats, loading, error,
    activeTab, setActiveTab,
    actionTarget, updating, actionError,
    handleAction, handleDismiss, handleConfirmAction,
    formatDate, formatTime, retry,
  } = useDoctorDashboard();

  const isPast = ['completed', 'cancelled'].includes(activeTab);
  const list   = tabs[activeTab] || [];

  return (
    <>
      <Navbar />
      <main className="page-container">

        {/* ── Header ── */}
        <div className="page-header" style={{ marginBottom: '1.25rem' }}>
          <div>
            <h1>My schedule</h1>
            <p className="page-sub">Manage your patient appointments</p>
          </div>
        </div>

        {/* ── Stats row ── */}
        <div className="stats-row">
          <div className="stat-card">
            <span className="stat-value">{loading ? '–' : stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-card stat-highlight">
            <span className="stat-value">{loading ? '–' : stats.today}</span>
            <span className="stat-label">Today</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{loading ? '–' : stats.upcoming}</span>
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{loading ? '–' : stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {error && (
          <div className="alert alert-error">
            {error}{' '}
            <button className="link-btn" onClick={retry}>Retry</button>
          </div>
        )}

        {/* ── Tabs ── */}
        <div className="dash-tabs">
          {TABS.map(t => (
            <button
              key={t.key}
              className={`dash-tab ${activeTab === t.key ? 'dash-tab-active' : ''}`}
              onClick={() => setActiveTab(t.key)}
            >
              {t.label}
              {!loading && tabs[t.key]?.length > 0 && (
                <span className="tab-count">{tabs[t.key].length}</span>
              )}
            </button>
          ))}
        </div>

        {/* ── List ── */}
        {loading ? (
          <div className="appt-list">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : list.length === 0 ? (
          <div className="appt-empty">
            <div className="empty-icon">◷</div>
            <p>No {activeTab} appointments</p>
          </div>
        ) : (
          <div className="appt-list">
            {list.map(a => (
              <DoctorAppointmentCard
                key={a.id}
                appointment={a}
                onAction={handleAction}
                formatDate={formatDate}
                formatTime={formatTime}
                isPast={isPast}
              />
            ))}
          </div>
        )}

      </main>

      {actionTarget && (
        <StatusUpdateModal
          appointment={actionTarget.appointment}
          newStatus={actionTarget.newStatus}
          onConfirm={handleConfirmAction}
          onDismiss={handleDismiss}
          updating={updating}
          error={actionError}
          formatDate={formatDate}
          formatTime={formatTime}
        />
      )}
    </>
  );
};

export default DoctorDashboard;