-- 1. Create the Missions Table
CREATE TABLE IF NOT EXISTS missions (
  id TEXT PRIMARY KEY,
  destination TEXT NOT NULL,
  departure TIMESTAMP WITH TIME ZONE NOT NULL,
  seats_available INTEGER NOT NULL,
  status TEXT NOT NULL,
  price_usd BIGINT NOT NULL,
  duration_days INTEGER NOT NULL,
  difficulty TEXT NOT NULL,
  tagline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create the Bookings Table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uid UUID NOT NULL, -- Ties to auth.users.id
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  mission_id TEXT REFERENCES missions(id),
  destination TEXT NOT NULL,
  cabin_class TEXT NOT NULL,
  passenger_id TEXT NOT NULL,
  special_requirements TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable RLS (Row Level Security)
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 4. Create Policies
-- Allow anyone to read missions
CREATE POLICY "Public Missions are viewable by everyone" ON missions
  FOR SELECT USING (true);

-- Allow users to see only their own bookings
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = uid);

-- Allow authenticated users to insert a booking
CREATE POLICY "Users can insert their own bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = uid);

-- Allow users to delete their own bookings
CREATE POLICY "Users can delete their own bookings" ON bookings
  FOR DELETE USING (auth.uid() = uid);

-- 5. Seed Initial Missions
INSERT INTO missions (id, destination, departure, seats_available, status, price_usd, duration_days, difficulty, tagline)
VALUES 
  ('MSN-001', 'Mars Colony Alpha', '2026-09-15T00:00:00Z', 12, 'Active', 120000, 180, 'Medium', 'First permanent human settlement on Mars'),
  ('MSN-002', 'Saturn Ring Hotel', '2026-11-01T00:00:00Z', 0, 'Full', 450000, 365, 'Hard', 'Float between the rings in zero gravity'),
  ('MSN-003', 'Europa Station', '2026-12-20T00:00:00Z', 8, 'Active', 380000, 240, 'Hard', 'Beneath the ice, an ocean awaits'),
  ('MSN-004', 'Titan Outpost', '2027-02-10T00:00:00Z', 3, 'Upcoming', 310000, 240, 'Medium', 'Explore Saturn''s largest moon'),
  ('MSN-005', 'Kepler-22b Gateway', '2027-04-05T00:00:00Z', 0, 'Full', 1200000, 730, 'Hard', 'Humanity''s first interstellar passage'),
  ('MSN-006', 'Lunar Base Zero', '2026-08-30T00:00:00Z', 20, 'Active', 120000, 7, 'Easy', 'Your first step beyond Earth'),
  ('MSN-007', 'Venus Cloud City', '2026-10-15T00:00:00Z', 5, 'Active', 250000, 60, 'Medium', 'High altitude luxury above the storms'),
  ('MSN-008', 'Mercury Core Mine', '2027-01-20T00:00:00Z', 2, 'Active', 550000, 45, 'Hard', 'Deep core extraction and intense sun exposure')
ON CONFLICT (id) DO NOTHING;
