-- Add dedicated return request fields to orders table
-- Replaces the hack of storing return info in the notes column
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS return_reason text,
  ADD COLUMN IF NOT EXISTS return_notes text,
  ADD COLUMN IF NOT EXISTS return_requested_at timestamptz;
