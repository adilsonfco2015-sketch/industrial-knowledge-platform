import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
export const storageEnabled = Boolean(url && serviceRoleKey);
export const supabase = storageEnabled ? createClient(url, serviceRoleKey, { auth: { persistSession: false } }) : null;
export const evidenceBucket = 'evidencias';
