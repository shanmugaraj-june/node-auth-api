-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. users table (patients + doctors share this)
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100)        NOT NULL,
  email       VARCHAR(150)        UNIQUE NOT NULL,
  password_hash VARCHAR(255)      NOT NULL,
  role        VARCHAR(20)         NOT NULL CHECK (role IN ('patient', 'doctor', 'admin')),
  created_at  TIMESTAMP           DEFAULT NOW()
);

-- 2. doctors table (extended profile for doctor users)
CREATE TABLE IF NOT EXISTS doctors (
  id             SERIAL PRIMARY KEY,
  user_id        INTEGER           NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  specialization VARCHAR(100)      NOT NULL,
  phone          VARCHAR(20),
  created_at     TIMESTAMP         DEFAULT NOW()
);

-- 3. slots table (time blocks a doctor makes available)
CREATE TABLE IF NOT EXISTS slots (
  id           SERIAL PRIMARY KEY,
  doctor_id    INTEGER             NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_date    DATE                NOT NULL,
  start_time   TIME                NOT NULL,
  end_time     TIME                NOT NULL,
  is_available BOOLEAN             DEFAULT TRUE,
  CONSTRAINT no_overlap UNIQUE (doctor_id, slot_date, start_time)
);

-- 4. appointments table
CREATE TABLE IF NOT EXISTS appointments (
  id          SERIAL PRIMARY KEY,
  patient_id  INTEGER             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  doctor_id   INTEGER             NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  slot_id     INTEGER             NOT NULL REFERENCES slots(id) ON DELETE CASCADE,
  status      VARCHAR(20)         NOT NULL DEFAULT 'pending'
                                  CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes       TEXT,
  created_at  TIMESTAMP           DEFAULT NOW()
);