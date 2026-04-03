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
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const ADMIN_EMAIL = 'admin@zenith.com';

async function setup() {
  // Get User
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  const admin = users.find(u => u.email === ADMIN_EMAIL);

  if (!admin) {
    console.error("Admin user not found.");
    process.exit(1);
  }

  // Create Wallet if missing
  const { data: existing } = await supabase
    .from('wallets')
    .select('id')
    .eq('user_id', admin.id)
    .limit(1);

  if (existing && existing.length > 0) {
    console.log("Wallet already exists.");
    return;
  }

  console.log("Creating default wallet...");
  await supabase.from('wallets').insert({
    user_id: admin.id,
    name: 'Utama',
    type: 'cash',
    balance: 0
  });

  console.log("Setup complete!");
}

setup();
