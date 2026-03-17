-- Clean slate (safe to re-run)
TRUNCATE appointments, slots, doctors, users RESTART IDENTITY CASCADE;

-- ─── Seed users (doctors) ──────────────────────────────────────
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Dr. Priya Sharma',   'priya@clinic.com',   '$2b$10$abcdefghijklmnopqrstuuVfjWGT6ZyMoIJ3e4W1nFqOiP.fake1', 'doctor'),
  ('Dr. Arjun Mehta',    'arjun@clinic.com',   '$2b$10$abcdefghijklmnopqrstuuVfjWGT6ZyMoIJ3e4W1nFqOiP.fake2', 'doctor'),
  ('Dr. Sneha Nair',     'sneha@clinic.com',   '$2b$10$abcdefghijklmnopqrstuuVfjWGT6ZyMoIJ3e4W1nFqOiP.fake3', 'doctor'),
  ('Dr. Karthik Raj',    'karthik@clinic.com', '$2b$10$abcdefghijklmnopqrstuuVfjWGT6ZyMoIJ3e4W1nFqOiP.fake4', 'doctor'),
  ('Dr. Meena Iyer',     'meena@clinic.com',   '$2b$10$abcdefghijklmnopqrstuuVfjWGT6ZyMoIJ3e4W1nFqOiP.fake5', 'doctor');

-- ─── Seed users (patients) ─────────────────────────────────────
INSERT INTO users (name, email, password_hash, role) VALUES
  ('Arun Kumar',   'arun@example.com',  '$2b$10$abcdefghijklmnopqrstuuVfjWGT6ZyMoIJ3e4W1nFqOiP.fake6', 'patient'),
  ('Divya Pillai', 'divya@example.com', '$2b$10$abcdefghijklmnopqrstuuVfjWGT6ZyMoIJ3e4W1nFqOiP.fake7', 'patient');

-- ─── Seed doctors (profiles) ───────────────────────────────────
INSERT INTO doctors (user_id, specialization, phone) VALUES
  (1, 'Cardiologist',     '+91-98400-11111'),
  (2, 'Neurologist',      '+91-98400-22222'),
  (3, 'Dermatologist',    '+91-98400-33333'),
  (4, 'Orthopedic',       '+91-98400-44444'),
  (5, 'General Physician','+91-98400-55555'); 



  -- ─── Seed slots (next 3 days, 4 slots per doctor) ──────────────
INSERT INTO slots (doctor_id, slot_date, start_time, end_time, is_available) VALUES
  -- Dr. Priya Sharma (Cardiologist) — doctor id 1
  (1, CURRENT_DATE + 1, '09:00', '09:30', true),
  (1, CURRENT_DATE + 1, '09:30', '10:00', true),
  (1, CURRENT_DATE + 2, '10:00', '10:30', true),
  (1, CURRENT_DATE + 2, '10:30', '11:00', true),

  -- Dr. Arjun Mehta (Neurologist) — doctor id 2
  (2, CURRENT_DATE + 1, '11:00', '11:30', true),
  (2, CURRENT_DATE + 1, '11:30', '12:00', true),
  (2, CURRENT_DATE + 2, '14:00', '14:30', true),
  (2, CURRENT_DATE + 2, '14:30', '15:00', true),

  -- Dr. Sneha Nair (Dermatologist) — doctor id 3
  (3, CURRENT_DATE + 1, '08:00', '08:30', true),
  (3, CURRENT_DATE + 1, '08:30', '09:00', true),
  (3, CURRENT_DATE + 3, '13:00', '13:30', true),
  (3, CURRENT_DATE + 3, '13:30', '14:00', true);