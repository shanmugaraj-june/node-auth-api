const SpecialtyFilter = ({ specialties, active, onChange }) => (
  <div className="specialty-filter">
    {specialties.map(s => (
      <button
        key={s}
        className={`pill ${active === s ? 'pill-active' : ''}`}
        onClick={() => onChange(s)}
      >
        {s}
      </button>
    ))}
  </div>
);

export default SpecialtyFilter;