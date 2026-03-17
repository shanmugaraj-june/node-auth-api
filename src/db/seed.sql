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