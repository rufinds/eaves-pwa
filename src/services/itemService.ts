import type { Item } from '../types/Item';
import { EVENT_COLUMNS, toItem } from './itemMapper';
import { supabase } from './supabase';

const PAGE_SIZE = 30;

/** Upcoming public events, soonest first. RLS decides what anon may read. */
export async function getItems(): Promise<Item[]> {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_COLUMNS)
    .eq('is_private', false)
    .eq('status', 'scheduled')
    .gte('end_datetime', new Date().toISOString())
    .order('start_datetime', { ascending: true })
    .limit(PAGE_SIZE);

  if (error !== null) throw new Error(error.message);

  return (data ?? []).flatMap((row) => {
    const item = toItem(row);
    return item === null ? [] : [item];
  });
}

export async function getItemById(id: string): Promise<Item> {
  const { data, error } = await supabase
    .from('events')
    .select(EVENT_COLUMNS)
    .eq('id', id)
    .eq('is_private', false)
    .maybeSingle();

  if (error !== null) throw new Error(error.message);

  const item = toItem(data);
  if (item === null) throw new Error('Event not found');
  return item;
}