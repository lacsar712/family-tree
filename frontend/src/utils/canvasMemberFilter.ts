import { Member, isDeceased } from "@/types/member";
import { getYear } from "@/utils/dateUtils";

export type CanvasGenderFilter = "all" | "m" | "f" | "o";
export type CanvasStatusFilter = "all" | "alive" | "deceased";

/**
 * Filter state for the tree-canvas member filter bar. Mirrors the list-view
 * filter dimensions (gender, living status, photo) and adds a closed birth
 * year interval. Empty strings mean "no bound"; filling only one side applies
 * a single-sided filter.
 */
export interface CanvasMemberFilterState {
  gender: CanvasGenderFilter;
  status: CanvasStatusFilter;
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

/** Parse a year input into an integer, or null when blank / not a number. */
export function parseYearInput(raw: string): number | null {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) return null;
  const year = Number(trimmed);
  if (!Number.isFinite(year)) return null;
  return Math.trunc(year);
}

/** True when at least one filter dimension is active. */
export function isCanvasMemberFilterActive(
  filter: CanvasMemberFilterState,
): boolean {
  return (
    filter.gender !== "all" ||
    filter.status !== "all" ||
    filter.hasPhoto ||
    parseYearInput(filter.birthYearFrom) !== null ||
    parseYearInput(filter.birthYearTo) !== null
  );
}

/** Number of active filter dimensions (used for the trigger badge). */
export function countActiveCanvasFilters(
  filter: CanvasMemberFilterState,
): number {
  let count = 0;
  if (filter.gender !== "all") count++;
  if (filter.status !== "all") count++;
  if (filter.hasPhoto) count++;
  if (parseYearInput(filter.birthYearFrom) !== null) count++;
  if (parseYearInput(filter.birthYearTo) !== null) count++;
  return count;
}

/**
 * All active dimensions must match (AND semantics). The birth year range is a
 * closed interval: a member born exactly on a boundary year still matches.
 * A member whose birth year is unknown never matches while a year bound is set.
 */
export function memberMatchesCanvasFilter(
  member: Pick<Member, "gender" | "deceased" | "date" | "imageData">,
  filter: CanvasMemberFilterState,
): boolean {
  if (filter.gender !== "all" && member.gender !== filter.gender) {
    return false;
  }

  if (filter.status === "alive" && isDeceased(member)) return false;
  if (filter.status === "deceased" && !isDeceased(member)) return false;

  if (filter.hasPhoto && !member.imageData) return false;

  const fromYear = parseYearInput(filter.birthYearFrom);
  const toYear = parseYearInput(filter.birthYearTo);
  if (fromYear !== null || toYear !== null) {
    const birthYear = getYear(member.date.birth);
    if (birthYear === null) return false;
    if (fromYear !== null && birthYear < fromYear) return false;
    if (toYear !== null && birthYear > toYear) return false;
  }

  return true;
}

/** Count members matching the filter (or all members when no filter active). */
export function countMatchedMembers(
  members: Array<Pick<Member, "id" | "gender" | "deceased" | "date" | "imageData">>,
  filter: CanvasMemberFilterState,
): number {
  if (!isCanvasMemberFilterActive(filter)) return members.length;
  return members.reduce(
    (acc, member) =>
      acc + (memberMatchesCanvasFilter(member, filter) ? 1 : 0),
    0,
  );
}

/**
 * Returns the ids of members that should be dimmed, or null when no filter is
 * active (nothing dimmed). Non-matching nodes stay in the layout — they are
 * only faded, never removed.
 */
export function getDimmedMemberIds(
  members: Array<Pick<Member, "id" | "gender" | "deceased" | "date" | "imageData">>,
  filter: CanvasMemberFilterState,
): ReadonlySet<string> | null {
  if (!isCanvasMemberFilterActive(filter)) return null;
  const dimmed = new Set<string>();
  for (const member of members) {
    if (!memberMatchesCanvasFilter(member, filter)) {
      dimmed.add(member.id);
    }
  }
  return dimmed;
}
