const pool = require('../config/db');

// ─── GET /api/doctors ─────────────────────────────────────────
// Optional query param: ?specialization=Cardiologist
const getAllDoctors = async (req, res) => {
  const { specialization } = req.query;

  try {
    let query;
    let params;

    if (specialization) {
      query = `
        SELECT
          d.id,
          u.name,
          u.email,
          d.specialization,
          d.phone,
          d.created_at
        FROM doctors d
        JOIN users u ON u.id = d.user_id
        WHERE LOWER(d.specialization) = LOWER($1)
        ORDER BY u.name ASC
      `;
      params = [specialization];
    } else {
      query = `
        SELECT
          d.id,
          u.name,
          u.email,
          d.specialization,
          d.phone,
          d.created_at
        FROM doctors d
        JOIN users u ON u.id = d.user_id
        ORDER BY u.name ASC
      `;
      params = [];
    }

    const result = await pool.query(query, params);

    return res.status(200).json({
      count: result.rows.length,
      doctors: result.rows,
    });

  } catch (err) {
    console.error('getAllDoctors error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

// ─── GET /api/doctors/:id ─────────────────────────────────────
const getDoctorById = async (req, res) => {
  const { id } = req.params;

  // Validate id is a number
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Doctor ID must be a number' });
  }

  try {
    const result = await pool.query(
      `SELECT
         d.id,
         u.name,
         u.email,
         d.specialization,
         d.phone,
         d.created_at
       FROM doctors d
       JOIN users u ON u.id = d.user_id
       WHERE d.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Doctor not found' });
    }

    return res.status(200).json({ doctor: result.rows[0] });

  } catch (err) {
    console.error('getDoctorById error:', err.message);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { getAllDoctors, getDoctorById };