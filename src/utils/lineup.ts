import type { LineupSlot } from '../types/Social';
import { formatLongDay } from './eventFormat';
import { nightKey } from './eventTime';

export interface StageGroup {
  id: string | null;
  name: string | null;
  slots: LineupSlot[];
}

export interface DayGroup {
  key: string;
  label: string;
  stages: StageGroup[];
}

const UNKNOWN_DAY = 'unknown';

function byStart(a: LineupSlot, b: LineupSlot): number {
  if (a.startTime === null) return b.startTime === null ? 0 : 1;
  if (b.startTime === null) return -1;
  return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
}

/** Groups a lineup by night, then by stage. Slots without a start time end up last. */
export function groupLineup(slots: LineupSlot[]): DayGroup[] {
  const days = new Map<string, LineupSlot[]>();
  for (const slot of [...slots].sort(byStart)) {
    const key = slot.startTime === null ? UNKNOWN_DAY : nightKey(new Date(slot.startTime));
    days.set(key, [...(days.get(key) ?? []), slot]);
  }

  return [...days.entries()]
    .sort(([a], [b]) => (a === UNKNOWN_DAY ? 1 : b === UNKNOWN_DAY ? -1 : a.localeCompare(b)))
    .map(([key, daySlots]) => {
      const first = daySlots.find((slot) => slot.startTime !== null);
      const stages = new Map<string | null, StageGroup>();
      for (const slot of daySlots) {
        const group = stages.get(slot.stageId) ?? { id: slot.stageId, name: slot.stageName, slots: [] };
        stages.set(slot.stageId, { ...group, slots: [...group.slots, slot] });
      }
      const ordered = [...stages.values()].sort((a, b) => (a.id === null ? 1 : b.id === null ? -1 : 0));
      return {
        key,
        label: key === UNKNOWN_DAY || first?.startTime == null ? 'Time unknown' : formatLongDay(first.startTime),
        stages: ordered,
      };
    });
}