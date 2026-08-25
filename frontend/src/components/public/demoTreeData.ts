import { Member } from "@/types/member";

/**
 * Build a tiny inline SVG avatar as a data URI so the demo works fully offline
 * (no media endpoint). useMediaUrl passes data: URIs through untouched, so
 * these render without any network request.
 */
function avatar(bg: string, initials: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120"><rect width="120" height="120" fill="${bg}"/><text x="60" y="74" font-family="sans-serif" font-size="52" fill="#ffffff" text-anchor="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/** Shared defaults so each demo member literal only spells out what differs. */
function demoMember(overrides: Partial<Member> & Pick<Member, "id">): Member {
  return {
    id: overrides.id,
    gender: "o",
    academicTitle: null,
    firstName: "",
    middleNames: null,
    baptismalName: null,
    lastName: "Anderson",
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
    relations: [],
    diseases: [],
    ...overrides,
  };
}

/** Fixed tree id for the local, backend-free demo tree. */
export const DEMO_TREE_ID = "demo-local-tree";

/**
 * A self-contained three-generation family used by the no-login demo. It is
 * deliberately varied so every canvas filter shows a visible difference:
 * - genders: male, female and "other" (Alex)
 * - status: two deceased grandparents, the rest alive
 * - photos: some members have an avatar, some don't
 * - birth years span 1940 → 2010 (70 years)
 *
 * Positions are pre-arranged (three rows) so the demo needs no layout pass and
 * no backend round-trip. Parent links drive the union dots and connectors the
 * same way a real tree does.
 */
export function buildDemoMembers(): Member[] {
  const robert = demoMember({
    id: "demo-robert",
    gender: "m",
    firstName: "Robert",
    imageData: avatar("#2563eb", "RA"),
    deceased: true,
    date: { birth: "1940", death: "2010" },
    position: { x: 350, y: 0 },
  });
  const margaret = demoMember({
    id: "demo-margaret",
    gender: "f",
    firstName: "Margaret",
    maidenName: "Hughes",
    deceased: true,
    date: { birth: "1945", death: "2015" },
    position: { x: 700, y: 0 },
  });

  const james = demoMember({
    id: "demo-james",
    gender: "m",
    firstName: "James",
    imageData: avatar("#0891b2", "JA"),
    date: { birth: "1970", death: null },
    parents: { paternalParent: "demo-robert", maternalParent: "demo-margaret" },
    position: { x: 500, y: 320 },
  });
  const linda = demoMember({
    id: "demo-linda",
    gender: "f",
    firstName: "Linda",
    maidenName: "Carter",
    date: { birth: "1972", death: null },
    position: { x: 850, y: 320 },
  });
  const susan = demoMember({
    id: "demo-susan",
    gender: "f",
    firstName: "Susan",
    imageData: avatar("#db2777", "SA"),
    date: { birth: "1968", death: null },
    parents: { paternalParent: "demo-robert", maternalParent: "demo-margaret" },
    position: { x: 100, y: 320 },
  });

  const michael = demoMember({
    id: "demo-michael",
    gender: "m",
    firstName: "Michael",
    imageData: avatar("#16a34a", "MA"),
    date: { birth: "2000", death: null },
    parents: { paternalParent: "demo-james", maternalParent: "demo-linda" },
    position: { x: 450, y: 640 },
  });
  const emily = demoMember({
    id: "demo-emily",
    gender: "f",
    firstName: "Emily",
    date: { birth: "2003", death: null },
    parents: { paternalParent: "demo-james", maternalParent: "demo-linda" },
    position: { x: 750, y: 640 },
  });
  const alex = demoMember({
    id: "demo-alex",
    gender: "o",
    firstName: "Alex",
    date: { birth: "2010", death: null },
    parents: { paternalParent: "demo-james", maternalParent: "demo-linda" },
    position: { x: 1050, y: 640 },
  });

  return [robert, margaret, susan, james, linda, michael, emily, alex];
}
