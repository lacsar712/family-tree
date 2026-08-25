import { describe, expect, it } from "vitest";
import { Member } from "@/types/member";
import {
  CanvasMemberFilterState,
  DEFAULT_CANVAS_MEMBER_FILTER,
  countActiveCanvasFilters,
  countMatchedMembers,
  getDimmedMemberIds,
  isCanvasMemberFilterActive,
  memberMatchesCanvasFilter,
  parseYearInput,
} from "@/utils/canvasMemberFilter";

function makeMember(
  partial: Partial<Member> & Pick<Member, "id">,
): Member {
  return {
    gender: "o",
    academicTitle: null,
    firstName: "",
    middleNames: null,
    baptismalName: null,
    lastName: "",
    maidenName: null,
    imageData: null,
    deceased: false,
    adopted: false,
    date: { birth: "", death: null },
    parents: { paternalParent: null, maternalParent: null },
    additionalData: null,
    birthplace: null,
    hometown: null,
    cemetery: null,
    placesLived: [],
    isCollapsed: false,
    linkedTreeId: null,
    linkedMemberId: null,
    position: { x: 0, y: 0 },
    ...partial,
  } as Member;
}

const members: Member[] = [
  makeMember({ id: "m1", gender: "m", date: { birth: "1928-04-12", death: "2005-11-03" }, deceased: true, imageData: "data:img" }),
  makeMember({ id: "m2", gender: "f", date: { birth: "1958-03-14", death: null }, imageData: null }),
  makeMember({ id: "m3", gender: "o", date: { birth: "1988-08-08", death: null }, imageData: "data:img" }),
  // Deceased flag false but death date set → treated as deceased.
  makeMember({ id: "m4", gender: "f", date: { birth: "1995-02-28", death: "2010-07-14" }, imageData: null }),
  // No birth year.
  makeMember({ id: "m5", gender: "m", date: { birth: "", death: null }, imageData: "data:img" }),
];

describe("parseYearInput", () => {
  it("returns null for blank or non-numeric input", () => {
    expect(parseYearInput("")).toBeNull();
    expect(parseYearInput("   ")).toBeNull();
    expect(parseYearInput("abc")).toBeNull();
  });

  it("parses integer years and truncates decimals", () => {
    expect(parseYearInput("1958")).toBe(1958);
    expect(parseYearInput(" 1988 ")).toBe(1988);
    expect(parseYearInput("2000.9")).toBe(2000);
  });
});

describe("isCanvasMemberFilterActive", () => {
  it("is inactive for the default state", () => {
    expect(isCanvasMemberFilterActive(DEFAULT_CANVAS_MEMBER_FILTER)).toBe(false);
    expect(countActiveCanvasFilters(DEFAULT_CANVAS_MEMBER_FILTER)).toBe(0);
  });

  it("counts each active dimension", () => {
    const f: CanvasMemberFilterState = {
      gender: "f",
      status: "alive",
      hasPhoto: true,
      birthYearFrom: "1950",
      birthYearTo: "2000",
    };
    expect(isCanvasMemberFilterActive(f)).toBe(true);
    expect(countActiveCanvasFilters(f)).toBe(5);
  });

  it("treats a non-numeric year entry as inactive", () => {
    expect(
      isCanvasMemberFilterActive({ ...DEFAULT_CANVAS_MEMBER_FILTER, birthYearFrom: "x" }),
    ).toBe(false);
  });
});

describe("memberMatchesCanvasFilter", () => {
  it("matches everyone when no filter is active", () => {
    expect(
      members.every((m) => memberMatchesCanvasFilter(m, DEFAULT_CANVAS_MEMBER_FILTER)),
    ).toBe(true);
  });

  it("filters by gender", () => {
    const f = { ...DEFAULT_CANVAS_MEMBER_FILTER, gender: "f" as const };
    expect(members.filter((m) => memberMatchesCanvasFilter(m, f)).map((m) => m.id)).toEqual([
      "m2",
      "m4",
    ]);
  });

  it("filters by living status, treating a death date as deceased even without the flag", () => {
    const alive = { ...DEFAULT_CANVAS_MEMBER_FILTER, status: "alive" as const };
    expect(members.filter((m) => memberMatchesCanvasFilter(m, alive)).map((m) => m.id)).toEqual([
      "m2",
      "m3",
      "m5",
    ]);
    const deceased = { ...DEFAULT_CANVAS_MEMBER_FILTER, status: "deceased" as const };
    expect(members.filter((m) => memberMatchesCanvasFilter(m, deceased)).map((m) => m.id)).toEqual([
      "m1",
      "m4",
    ]);
  });

  it("filters by photo presence", () => {
    const f = { ...DEFAULT_CANVAS_MEMBER_FILTER, hasPhoto: true };
    expect(members.filter((m) => memberMatchesCanvasFilter(m, f)).map((m) => m.id)).toEqual([
      "m1",
      "m3",
      "m5",
    ]);
  });

  it("applies the birth year as a closed interval (endpoints included)", () => {
    const f = {
      ...DEFAULT_CANVAS_MEMBER_FILTER,
      birthYearFrom: "1958",
      birthYearTo: "1988",
    };
    expect(members.filter((m) => memberMatchesCanvasFilter(m, f)).map((m) => m.id)).toEqual([
      "m2",
      "m3",
    ]);
  });

  it("supports single-sided year bounds", () => {
    const from = { ...DEFAULT_CANVAS_MEMBER_FILTER, birthYearFrom: "1988" };
    expect(members.filter((m) => memberMatchesCanvasFilter(m, from)).map((m) => m.id)).toEqual([
      "m3",
      "m4",
    ]);
    const to = { ...DEFAULT_CANVAS_MEMBER_FILTER, birthYearTo: "1958" };
    expect(members.filter((m) => memberMatchesCanvasFilter(m, to)).map((m) => m.id)).toEqual([
      "m1",
      "m2",
    ]);
  });

  it("excludes members without a birth year while a year bound is active", () => {
    const f = { ...DEFAULT_CANVAS_MEMBER_FILTER, birthYearFrom: "1900" };
    expect(members.filter((m) => memberMatchesCanvasFilter(m, f)).map((m) => m.id)).not.toContain(
      "m5",
    );
  });

  it("combines dimensions with AND semantics", () => {
    const f: CanvasMemberFilterState = {
      gender: "f",
      status: "alive",
      hasPhoto: false,
      birthYearFrom: "",
      birthYearTo: "",
    };
    // Living women without a photo: only m2 (m4 is deceased).
    expect(members.filter((m) => memberMatchesCanvasFilter(m, f)).map((m) => m.id)).toEqual([
      "m2",
    ]);
  });
});

describe("getDimmedMemberIds / countMatchedMembers", () => {
  it("returns null and counts everyone when no filter is active", () => {
    expect(getDimmedMemberIds(members, DEFAULT_CANVAS_MEMBER_FILTER)).toBeNull();
    expect(countMatchedMembers(members, DEFAULT_CANVAS_MEMBER_FILTER)).toBe(members.length);
  });

  it("returns the non-matching ids to dim", () => {
    const f = { ...DEFAULT_CANVAS_MEMBER_FILTER, status: "deceased" as const };
    const dimmed = getDimmedMemberIds(members, f);
    expect([...(dimmed as Set<string>)].sort()).toEqual(["m2", "m3", "m5"]);
    expect(countMatchedMembers(members, f)).toBe(2);
  });

  it("dims everyone when nothing matches", () => {
    const f = { ...DEFAULT_CANVAS_MEMBER_FILTER, birthYearFrom: "3000" };
    const dimmed = getDimmedMemberIds(members, f);
    expect(dimmed?.size).toBe(members.length);
    expect(countMatchedMembers(members, f)).toBe(0);
  });
});
