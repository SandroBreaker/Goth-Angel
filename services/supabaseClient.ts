
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://phmmvngzhrzyuauiwpzc.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobW12bmd6aHJ6eXVhdWl3cHpjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjczMjM0NjIsImV4cCI6MjA4Mjg5OTQ2Mn0.figqanHwmRg5v7jOSHbPMJ58WANJFqv3_L0TXMvZQXc';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
