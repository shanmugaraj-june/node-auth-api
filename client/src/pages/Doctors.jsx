import Navbar          from '../components/Navbar';
import DoctorCard      from '../components/DoctorCard';
import SpecialtyFilter from '../components/SpecialtyFilter';
import useDoctors      from '../hooks/useDoctors';

const Doctors = () => {
  const {
    filtered, loading, error,
    search, handleSearch,
    activeSpecialty, handleSpecialty,
    specialties, total, retry,
  } = useDoctors();

  return (
    <>
      <Navbar />
      <main className="page-container">

        <div className="page-header">
          <div>
            <h1>Find a doctor</h1>
            <p className="page-sub">
              {loading ? 'Loading...' : `${filtered.length} of ${total} doctors`}
            </p>
          </div>

          <input
            className="search-input"
            type="text"
            placeholder="Search by name or specialty..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <SpecialtyFilter
          specialties={specialties}
          active={activeSpecialty}
          onChange={handleSpecialty}
        />

        {error && (
          <div className="alert alert-error" style={{ marginTop: '1rem' }}>
            {error} <button className="link-btn" onClick={retry}>Retry</button>
          </div>
        )}

        {loading ? (
          <div className="card-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="doctor-card skeleton" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <p>No doctors found for <strong>"{search || activeSpecialty}"</strong></p>
            <button className="link-btn" onClick={() => { handleSpecialty('All'); }}>
              Clear filters
            </button>
          </div>
        ) : (
          <div className="card-grid">
            {filtered.map(doc => <DoctorCard key={doc.id} doctor={doc} />)}
          </div>
        )}

      </main>
    </>
  );
};

export default Doctors;