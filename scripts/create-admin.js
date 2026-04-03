const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Basic .env.local parser
const envPath = path.resolve(__dirname, '../../../.env.local');
const envFile = fs.readFileSync(envPath, 'utf8');
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(line => line.includes('='))
    .map(line => line.split('=').map(s => s.trim()))
);

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing SUPABASE_URL or SERVICE_ROLE_KEY in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdmin() {
  const { data, error } = await supabase.auth.admin.createUser({
    email: 'admin@zenith.com',
    password: 'ZenithAdmin123!',
    user_metadata: { full_name: 'Administrator' },
    email_confirm: true
  });

  if (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }

  console.log("Admin account created successfully!");
  console.log("ID:", data.user.id);
  console.log("Email: admin@zenith.com");
}

createAdmin();
