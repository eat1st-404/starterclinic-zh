const SUPA_URL = 'https://ntmbsgoyhnwjrvwyykkc.supabase.co';
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bWJzZ295aG53anJ2d3l5a2tjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODEwMTMwMjcsImV4cCI6MjA5NjU4OTAyN30.3KAm2UFGRHuRZ6x8ryR_WId1jKnjcCdtabhh0iqJDx0';

const headers = {
  'Content-Type': 'application/json',
  'apikey': SUPA_KEY,
  'Authorization': `Bearer ${SUPA_KEY}`,
};

async function supaGet(table, params = '') {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}?${params}`, { headers });
  return r.json();
}

async function supaPost(table, body) {
  const r = await fetch(`${SUPA_URL}/rest/v1/${table}`, {
    method: 'POST',
    headers: { ...headers, 'Prefer': 'return=representation' },
    body: JSON.stringify(body),
  });
  return r.json();
}

async function getOrCreateUser(contact) {
  const rows = await supaGet('users', `contact=eq.${encodeURIComponent(contact)}&select=id`);
  if (rows.length) return rows[0].id;
  const created = await supaPost('users', { contact });
  return created[0].id;
}

async function saveRecord(userId, data) {
  return supaPost('clinic_records', { user_id: userId, ...data });
}

async function getUserRecords(userId) {
  return supaGet('clinic_records', `user_id=eq.${userId}&order=created_at.desc`);
}
