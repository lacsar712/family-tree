import { Gender, Member, isDeceased } from "@/types/member";
import { getYear } from "@/utils/dateUtils";

export type CanvasMemberFilterGender = "all" | Gender;
export type CanvasMemberFilterStatus = "all" | "alive" | "deceased";

export interface CanvasMemberFilterState {
  gender: CanvasMemberFilterGender;
  status: CanvasMemberFilterStatus;
  hasPhoto: boolean;
  birthStartYear: number | null;
  birthEndYear: number | null;
}

export const DEFAULT_CANVAS_MEMBER_FILTER: CanvasMemberFilterState = {
  gender: "all",
  status: "all",
  hasPhoto: false,
  birthStartYear: null,
  birthEndYear: null,
};

export function memberMatchesCanvasFilter(
  member: Pick<Member, "gender" | "deceased" | "date" | "imageData">,
  filters: CanvasMemberFilterState,
): boolean {
  if (filters.gender !== "all" && member.gender !== filters.gender) {
    return false;
  }

  const deceased = isDeceased(member);
  if (filters.status === "alive" && deceased) return false;
  if (filters.status === "deceased" && !deceased) return false;

  if (filters.hasPhoto && !member.imageData) return false;

  if (filters.birthStartYear !== null || filters.birthEndYear !== null) {
    const birthYear = getYear(member.date.birth);
    if (birthYear === null) return false;
    if (
      filters.birthStartYear !== null &&
      birthYear < filters.birthStartYear
    ) {
      return false;
    }
    if (filters.birthEndYear !== null && birthYear > filters.birthEndYear) {
      return false;
    }
  }

  return true;
}

export function getCanvasMatchedMemberIds<
  T extends Pick<
    Member,
    "id" | "gender" | "deceased" | "date" | "imageData"
  >,
>(members: readonly T[], filters: CanvasMemberFilterState): Set<string> {
  return new Set(
    members
      .filter((member) => memberMatchesCanvasFilter(member, filters))
      .map((member) => member.id),
  );
}

export function isDefaultCanvasMemberFilter(
  filters: CanvasMemberFilterState,
): boolean {
  return (
    filters.gender === DEFAULT_CANVAS_MEMBER_FILTER.gender &&
    filters.status === DEFAULT_CANVAS_MEMBER_FILTER.status &&
    filters.hasPhoto === DEFAULT_CANVAS_MEMBER_FILTER.hasPhoto &&
    filters.birthStartYear === DEFAULT_CANVAS_MEMBER_FILTER.birthStartYear &&
    filters.birthEndYear === DEFAULT_CANVAS_MEMBER_FILTER.birthEndYear
  );
}

export function countActiveCanvasMemberFilters(
  filters: CanvasMemberFilterState,
): number {
  let count = 0;
  if (filters.gender !== "all") count++;
  if (filters.status !== "all") count++;
  if (filters.hasPhoto) count++;
  if (filters.birthStartYear !== null) count++;
  if (filters.birthEndYear !== null) count++;
  return count;
}
