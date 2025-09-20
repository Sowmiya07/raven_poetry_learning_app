/*
  # Create poems table and authentication setup

  1. New Tables
    - `poems`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `content` (text)
      - `theme` (text)
      - `feedback` (jsonb, nullable)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `poems` table
    - Add policies for users to manage their own poems
    - Create indexes for performance

  3. Functions
    - Auto-update `updated_at` timestamp
*/

-- Create poems table
CREATE TABLE IF NOT EXISTS poems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  theme text NOT NULL,
  feedback jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own poems"
  ON poems
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own poems"
  ON poems
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own poems"
  ON poems
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own poems"
  ON poems
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS poems_user_id_idx ON poems(user_id);
CREATE INDEX IF NOT EXISTS poems_created_at_idx ON poems(created_at DESC);
CREATE INDEX IF NOT EXISTS poems_theme_idx ON poems(theme);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_poems_updated_at ON poems;
CREATE TRIGGER update_poems_updated_at
  BEFORE UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();