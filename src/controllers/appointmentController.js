const pool = require('../config/db');

// ─── GET /api/doctors/:id/slots ───────────────────────────────
// Returns only available future slots for a given doctor
const getDoctorSlots = async (req, res) => {
  const { id } = req.params;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Doctor ID must be a number' });
  }

  try {
    // Confirm doctor exists first
    const doctorCheck = await pool.query(
      'SELECT id FROM doctors WHERE id = $1',
      [id]
    );
    if (doctorCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    const result = await pool.query(
      `SELECT id, slot_date, start_time, end_time, is_available
       FROM slots
       WHERE doctor_id   = $1
         AND is_available = true
         AND slot_date   >= CURRENT_DATE
       ORDER BY slot_date ASC, start_time ASC`,
      [id]
    );

    return res.status(200).json({
      doctor_id: parseInt(id),
      count: result.rows.length,
      slots: result.rows,
    });

  } catch (err) {
    console.error('getDoctorSlots error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── POST /api/appointments ───────────────────────────────────
// Patient books a slot — wraps everything in a transaction
// so the slot can't be double-booked under concurrent requests
const bookAppointment = async (req, res) => {
  const { doctor_id, slot_id, notes } = req.body;
  const patient_id = req.user.userId; // from JWT via authenticate middleware

  if (!doctor_id || !slot_id) {
    return res.status(400).json({ error: 'doctor_id and slot_id are required' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Lock the slot row so no concurrent request can book it simultaneously
    const slotResult = await client.query(
      `SELECT * FROM slots
       WHERE id          = $1
         AND doctor_id   = $2
         AND is_available = true
         AND slot_date   >= CURRENT_DATE
       FOR UPDATE`,           // ← row-level lock
      [slot_id, doctor_id]
    );

    if (slotResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'Slot is not available' });
    }

    // 2. Mark slot as taken
    await client.query(
      'UPDATE slots SET is_available = false WHERE id = $1',
      [slot_id]
    );

    // 3. Create the appointment
    const apptResult = await client.query(
      `INSERT INTO appointments (patient_id, doctor_id, slot_id, status, notes)
       VALUES ($1, $2, $3, 'pending', $4)
       RETURNING *`,
      [patient_id, doctor_id, slot_id, notes || null]
    );

    await client.query('COMMIT');

    return res.status(201).json({ appointment: apptResult.rows[0] });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('bookAppointment error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release(); // always return connection to pool
  }
};

// ─── GET /api/appointments/my ─────────────────────────────────
// Returns the logged-in patient's full appointment history
const getMyAppointments = async (req, res) => {
  const patient_id = req.user.userId;

  try {
    const result = await pool.query(
      `SELECT
         a.id,
         a.status,
         a.notes,
         a.created_at,
         s.slot_date,
         s.start_time,
         s.end_time,
         u.name        AS doctor_name,
         d.specialization
       FROM appointments a
       JOIN slots   s ON s.id = a.slot_id
       JOIN doctors d ON d.id = a.doctor_id
       JOIN users   u ON u.id = d.user_id
       WHERE a.patient_id = $1
       ORDER BY s.slot_date DESC, s.start_time DESC`,
      [patient_id]
    );

    return res.status(200).json({
      count: result.rows.length,
      appointments: result.rows,
    });

  } catch (err) {
    console.error('getMyAppointments error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── DELETE /api/appointments/:id ─────────────────────────────
// Patient cancels their own appointment and frees the slot
const cancelAppointment = async (req, res) => {
  const { id }     = req.params;
  const patient_id = req.user.userId;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'Appointment ID must be a number' });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Find the appointment — must belong to this patient
    const apptResult = await client.query(
      `SELECT * FROM appointments WHERE id = $1 AND patient_id = $2`,
      [id, patient_id]
    );

    if (apptResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'Appointment not found or not yours' });
    }

    const appt = apptResult.rows[0];

    if (appt.status === 'cancelled') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Appointment is already cancelled' });
    }

    if (appt.status === 'completed') {
      await client.query('ROLLBACK');
      return res.status(400).json({ error: 'Cannot cancel a completed appointment' });
    }

    // 2. Mark appointment as cancelled
    await client.query(
      `UPDATE appointments SET status = 'cancelled' WHERE id = $1`,
      [id]
    );

    // 3. Free the slot so others can book it
    await client.query(
      `UPDATE slots SET is_available = true WHERE id = $1`,
      [appt.slot_id]
    );

    await client.query('COMMIT');

    return res.status(200).json({ message: 'Appointment cancelled successfully' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error('cancelAppointment error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  } finally {
    client.release();
  }
};

module.exports = {
  getDoctorSlots,
  bookAppointment,
  getMyAppointments,
  cancelAppointment,
};