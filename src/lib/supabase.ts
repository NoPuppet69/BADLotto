import { createClient } from '@supabase/supabase-js';


// Initialize Supabase client
// Using direct values from project configuration
const supabaseUrl = 'https://jaubzwdpprqdaqwelgbg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImphdWJ6d2RwcHJxZGFxd2VsZ2JnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0MjQ0NjEsImV4cCI6MjA2ODAwMDQ2MX0.7mOdWhnG63_q1cuKVYdG8-e9N5pKxqzowHd3DfV0Xtg';
const supabase = createClient(supabaseUrl, supabaseKey);


export { supabase };