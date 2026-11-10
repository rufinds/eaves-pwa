import { toRecords } from '../utils/guards';
import { supabase } from './supabase';

/** `select ... from table where column in ids`. Returns no rows (and no request) for an empty id list. */
export async function selectIn(
  table: string,
  select: string,
  column: string,
  ids: string[],
): Promise<Record<string, unknown>[]> {
  if (ids.length === 0) return [];
  const { data, error } = await supabase.from(table).select(select).in(column, ids);
  if (error !== null) throw new Error(error.message);
  return toRecords(data);
}