import { Member, isDeceased } from "@/types/member";
import { getYear } from "@/utils/dateUtils";

/**
 * Filter state for the tree-canvas member filter bar. Mirrors the list view's
 * dimensions (gender / status / has-photo) and adds a birth-year range so the
 * same criteria can dim (rather than remove) unmatched nodes on the canvas.
 *
 * `birthYearFrom` / `birthYearTo` are the raw input strings; empty means that
 * end of the range is unbounded. The range is inclusive on both ends.
 */
export interface CanvasFilterState {
  gender: "all" | "m" | "f" | "o";
  status: "all" | "alive" | "deceased";
  hasPhoto: boolean;
  birthYearFrom: string;
  birthYearTo: string;
}

export const DEFAULT_CANVAS_FILTERS: CanvasFilterState = {
  gender: "all",
  status: "all",
  hasPhoto: false,
  birthYearFrom: "",
  birthYearTo: "",
};

/** Parse a year input into a number, or null when empty / not a valid year. */
function parseYearInput(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (!/^\d{1,4}$/.test(trimmed)) return null;
  return Number(trimmed);
}

/** True when the filter differs from the cleared/default state. */
export function isCanvasFilterActive(filters: CanvasFilterState): boolean {
  return (
    filters.gender !== "all" ||
    filters.status !== "all" ||
    filters.hasPhoto ||
    filters.birthYearFrom.trim() !== "" ||
    filters.birthYearTo.trim() !== ""
  );
}

/** Number of active filter dimensions — used for the "N active" badge. */
export function countActiveCanvasFilters(filters: CanvasFilterState): number {
  let count = 0;
  if (filters.gender !== "all") count++;
  if (filters.status !== "all") count++;
  if (filters.hasPhoto) count++;
  if (filters.birthYearFrom.trim() !== "" || filters.birthYearTo.trim() !== "")
    count++;
  return count;
}

/**
 * True when a single member satisfies every active filter dimension. Multiple
 * dimensions are combined with AND (all must match). The birth-year range is
 * an inclusive closed interval; a member with no birth year fails whenever
 * either year bound is set.
 */
export function memberMatchesCanvasFilter(
  member: Member,
  filters: CanvasFilterState,
): boolean {
  if (filters.gender !== "all" && member.gender !== filters.gender) {
    return false;
  }
  if (filters.status === "alive" && isDeceased(member)) return false;
  if (filters.status === "deceased" && !isDeceased(member)) return false;
  if (filters.hasPhoto && !member.imageData) return false;

  const from = parseYearInput(filters.birthYearFrom);
  const to = parseYearInput(filters.birthYearTo);
  if (from !== null || to !== null) {
    const birthYear = getYear(member.date.birth);
    if (birthYear === null) return false;
    if (from !== null && birthYear < from) return false;
    if (to !== null && birthYear > to) return false;
  }

  return true;
}

export interface CanvasFilterResult {
  /** ids of members that match every active filter. */
  matchedIds: Set<string>;
  /** ids of members that should be dimmed (only populated when active). */
  dimmedIds: Set<string>;
  /** number of matched members. */
  matchedCount: number;
  /** total number of members considered. */
  totalCount: number;
  /** whether any filter dimension is active. */
  active: boolean;
}

/**
 * Compute the match / dim sets for the whole member set. When no filter is
 * active nothing is dimmed (every node stays fully opaque). Unmatched members
 * are never removed — the caller only lowers their opacity — so the layout,
 * edges, and generation lines are untouched.
 */
export function computeCanvasFilter(
  members: Member[],
  filters: CanvasFilterState,
): CanvasFilterResult {
  const active = isCanvasFilterActive(filters);
  const matchedIds = new Set<string>();
  const dimmedIds = new Set<string>();

  if (!active) {
    for (const member of members) matchedIds.add(member.id);
    return {
      matchedIds,
      dimmedIds,
      matchedCount: members.length,
      totalCount: members.length,
      active,
    };
  }

  for (const member of members) {
    if (memberMatchesCanvasFilter(member, filters)) {
      matchedIds.add(member.id);
    } else {
      dimmedIds.add(member.id);
    }
  }

  return {
    matchedIds,
    dimmedIds,
    matchedCount: matchedIds.size,
    totalCount: members.length,
    active,
  };
}
