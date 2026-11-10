import type { Session } from '@supabase/supabase-js';
import type { User } from '../types/User';
import { isRecord, readString } from '../utils/guards';
import { supabase } from './supabase';

function toUser(session: Session): User {
  const email = session.user.email ?? '';
  const metadata = isRecord(session.user.user_metadata) ? session.user.user_metadata : {};
  const name = readString(metadata, 'first_name') ?? (email.split('@')[0] || email);

  return { id: session.user.id, email, name, token: session.access_token };
}

export async function login(email: string, password: string): Promise<User> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error !== null) throw new Error(error.message);
  if (data.session === null) throw new Error('No session returned');
  return toUser(data.session);
}

export async function logout(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error !== null) throw new Error(error.message);
}

/**
 * Reports the current user on subscribe (restored session) and on every
 * sign-in / sign-out. Returns an unsubscribe function.
 */
export function subscribeToAuthChanges(onChange: (user: User | null) => void): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    onChange(session === null ? null : toUser(session));
  });
  return () => data.subscription.unsubscribe();
}
