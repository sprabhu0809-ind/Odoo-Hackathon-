import { createClient } from '@supabase/supabase-js'

// StockSense Supabase Client
// TODO: Replace with live credentials in .env.local:
// VITE_SUPABASE_URL=your_project_url_here
// VITE_SUPABASE_ANON_KEY=your_anon_key_here
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mock-stocksense-db.supabase.co'
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'mock-anon-key-placeholder'

export const supabase = createClient(supabaseUrl, supabaseKey)
