/*
  # Create poems table and authentication setup

  1. New Tables
    - `poems`
      - `id` (text, primary key) - matches local storage IDs
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `content` (text)
      - `theme` (text)
      - `feedback` (jsonb, nullable) - stores feedback data
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `poems` table
    - Add policies for authenticated users to manage their own poems
    - Users can only access their own poems

  3. Indexes
    - Index on user_id for efficient queries
    - Index on created_at for sorting
*/

-- Create poems table
CREATE TABLE IF NOT EXISTS poems (
  id text PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  theme text NOT NULL,
  feedback jsonb,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
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

-- Create indexes
CREATE INDEX IF NOT EXISTS poems_user_id_idx ON poems(user_id);
CREATE INDEX IF NOT EXISTS poems_created_at_idx ON poems(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_poems_updated_at
  BEFORE UPDATE ON poems
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();