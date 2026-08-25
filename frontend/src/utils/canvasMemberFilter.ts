import { Member, isDeceased } from "@/types/member";
import { getYear } from "@/utils/dateUtils";

/**
 * Filter state for the tree-canvas member filter bar. Mirrors the list-view
 * filters (gender / status / hasPhoto) and adds an inclusive birth-year
 * range. Year bounds are raw input strings: an empty or non-numeric bound
 * means "unbounded" on that side.
 */
export interface CanvasMemberFilterState {
  gender: "all" | "m" | "f" | "o";
  status: "all" | "alive" | "deceased";
  hasPhoto: boolean;
  birthYearFrom: string;
  birthYearTo: string;
}

export const DEFAULT_CANVAS_MEMBER_FILTER: CanvasMemberFilterState = {
  gender: "all",
  status: "all",
  hasPhoto: false,
  birthYearFrom: "",
  birthYearTo: "",
};

export interface CanvasMemberFilterResult {
  /** True when at least one filter condition is set. */
  active: boolean;
  /** Members that satisfy every active condition. */
  matchedIds: ReadonlySet<string>;
  /** Members to render dimmed (non-matching while a filter is active). */
  dimmedIds: ReadonlySet<string>;
  matchedCount: number;
  totalCount: number;
}

function parseYearBound(raw: string): number | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  const year = Number(trimmed);
  return Number.isInteger(year) ? year : null;
}

/** True when at least one filter condition differs from the default. */
export function isCanvasMemberFilterActive(
  filters: CanvasMemberFilterState,
): boolean {
  return (
    filters.gender !== "all" ||
    filters.status !== "all" ||
    filters.hasPhoto ||
    parseYearBound(filters.birthYearFrom) !== null ||
    parseYearBound(filters.birthYearTo) !== null
  );
}

/** A member matches only when it satisfies *every* active condition. */
export function memberMatchesCanvasFilter(
  member: Member,
  filters: CanvasMemberFilterState,
): boolean {
  if (filters.gender !== "all" && member.gender !== filters.gender) {
    return false;
  }
  if (filters.status === "alive" && isDeceased(member)) return false;
  if (filters.status === "deceased" && !isDeceased(member)) return false;
  if (filters.hasPhoto && !member.imageData) return false;

  const from = parseYearBound(filters.birthYearFrom);
  const to = parseYearBound(filters.birthYearTo);
  if (from !== null || to !== null) {
    const birthYear = getYear(member.date.birth);
    if (birthYear === null) return false;
    // Closed interval: members exactly on a set boundary still match.
    if (from !== null && birthYear < from) return false;
    if (to !== null && birthYear > to) return false;
  }
  return true;
}

const EMPTY_IDS: ReadonlySet<string> = new Set<string>();

/**
 * Evaluate the filter bar against all members. Nothing is removed from the
 * layout — non-matching members are only reported as dimmed.
 */
export function applyCanvasMemberFilter(
  members: Member[],
  filters: CanvasMemberFilterState,
): CanvasMemberFilterResult {
  const active = isCanvasMemberFilterActive(filters);
  if (!active) {
    return {
      active,
      matchedIds: EMPTY_IDS,
      dimmedIds: EMPTY_IDS,
      matchedCount: members.length,
      totalCount: members.length,
    };
  }

  const matchedIds = new Set<string>();
  const dimmedIds = new Set<string>();
  for (const member of members) {
    if (memberMatchesCanvasFilter(member, filters)) {
      matchedIds.add(member.id);
    } else {
      dimmedIds.add(member.id);
    }
  }
  return {
    active,
    matchedIds,
    dimmedIds,
    matchedCount: matchedIds.size,
    totalCount: members.length,
  };
}
