import { supabase } from './supabase';

/** True when the hosted database answers a minimal read query. */
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('events')
      .select('id', { count: 'exact', head: true });
    return error === null;
  } catch {
    return false;
  }
}
