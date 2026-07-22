import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing env vars')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function main() {
  const { data: users, error } = await supabase.auth.admin.listUsers()
  if (error) { console.error('List error:', error); return }

  console.log(`Total users: ${users.users.length}`)
  for (const u of users.users) {
    console.log(`Deleting: ${u.email} (${u.id})`)
    const { error: delErr } = await supabase.auth.admin.deleteUser(u.id)
    if (delErr) console.error(`  Error deleting ${u.email}:`, delErr.message)
    else console.log(`  Deleted OK`)
  }
  console.log('Done!')
}

main()
