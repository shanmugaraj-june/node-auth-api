const SlotPicker = ({ slotsByDate, onSelect, formatDate, formatTime }) => {
  const dates = Object.keys(slotsByDate).sort();

  if (dates.length === 0) {
    return (
      <div className="no-slots">
        <p>No available slots at the moment.</p>
        <p className="no-slots-sub">Check back soon or try another doctor.</p>
      </div>
    );
  }

  return (
    <div className="slot-picker">
      {dates.map(date => (
        <div key={date} className="slot-date-group">
          <div className="slot-date-label">{formatDate(date)}</div>
          <div className="slot-grid">
            {slotsByDate[date].map(slot => (
              <button
                key={slot.id}
                className="slot-btn"
                onClick={() => onSelect(slot)}
              >
                {formatTime(slot.start_time)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SlotPicker;