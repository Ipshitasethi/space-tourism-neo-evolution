const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

// Fail gracefully instead of crashing on startup
let supabase = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️  Supabase configuration is missing in environment variables. Database features will be disabled.');
} else {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('✅ Supabase client initialized.');
  } catch (err) {
    console.error('❌ Failed to initialize Supabase client:', err.message);
  }
}

module.exports = { supabase };
