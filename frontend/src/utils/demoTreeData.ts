import { MemberDB, RelationDB, Member } from "@/types/member";
import { Tree } from "@/types/tree";
import { mapMembersFromRows } from "@/utils/memberMapping";

/**
 * Built-in demo family tree: rendered locally without any backend requests so
 * visitors can try the read-only tree view (and the canvas filters) without
 * an account. 10 members across 3 generations, mixed genders (m/f/o), alive
 * and deceased, with and without photos, birth years 1935–1994.
 */

export const DEMO_TREE_ID = "demo-local-tree";

export function getDemoTree(): Tree {
  return {
    id: DEMO_TREE_ID,
    name: "Demo Family Tree",
    // Viewer role keeps the canvas read-only, like the public tree view.
    role: "viewer",
  };
}

/** Tiny locally-generated portrait (data URI) — no network, no assets. */
function demoPhoto(initials: string, bg: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">` +
    `<rect width="96" height="96" fill="${bg}"/>` +
    `<text x="48" y="60" font-family="sans-serif" font-size="34" fill="#ffffff" text-anchor="middle">${initials}</text>` +
    `</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

function row(
  partial: Partial<MemberDB> & Pick<MemberDB, "id" | "gender" | "firstName" | "lastName">,
): MemberDB {
  return {
    academicTitle: null,
    middleNames: null,
    baptismalName: null,
    maidenName: null,
    imageData: null,
    dateOfBirth: null,
    dateOfDeath: null,
    deceased: false,
    adopted: false,
    isCollapsed: 0,
    positionX: 0,
    positionY: 0,
    ...partial,
  };
}

// Layout grid: NODE_WIDTH is 250, the canvas snaps to 50 — generations are
// 250px apart vertically, partners/siblings 300px apart horizontally.
const DEMO_ROWS: MemberDB[] = [
  // Generation 1
  row({
    id: "demo-karl",
    gender: "m",
    firstName: "Karl",
    lastName: "Schmidt",
    imageData: demoPhoto("KS", "#5b7fa6"),
    dateOfBirth: "1935-03-12",
    dateOfDeath: "2001-11-02",
    deceased: true,
    positionX: -150,
    positionY: 0,
  }),
  row({
    id: "demo-anna",
    gender: "f",
    firstName: "Anna",
    lastName: "Schmidt",
    maidenName: "Krüger",
    dateOfBirth: "1938-07-01",
    dateOfDeath: "2015-04-19",
    deceased: true,
    positionX: 150,
    positionY: 0,
  }),
  // Generation 2
  row({
    id: "demo-peter",
    gender: "m",
    firstName: "Peter",
    lastName: "Schmidt",
    imageData: demoPhoto("PS", "#6a8f6d"),
    dateOfBirth: "1960-05-20",
    positionX: -450,
    positionY: 250,
  }),
  row({
    id: "demo-maria",
    gender: "f",
    firstName: "Maria",
    lastName: "Schmidt",
    maidenName: "Weber",
    dateOfBirth: "1963-09-14",
    positionX: -150,
    positionY: 250,
  }),
  row({
    id: "demo-hans",
    gender: "m",
    firstName: "Hans",
    lastName: "Schmidt",
    dateOfBirth: "1965-01-30",
    positionX: 150,
    positionY: 250,
  }),
  row({
    id: "demo-clara",
    gender: "f",
    firstName: "Clara",
    lastName: "Schmidt",
    dateOfBirth: "1967-02-18",
    dateOfDeath: "1998-06-05",
    deceased: true,
    positionX: 450,
    positionY: 250,
  }),
  // Generation 3
  row({
    id: "demo-julia",
    gender: "f",
    firstName: "Julia",
    lastName: "Schmidt",
    imageData: demoPhoto("JS", "#a66a8c"),
    dateOfBirth: "1988-06-10",
    positionX: -600,
    positionY: 500,
  }),
  row({
    id: "demo-tim",
    gender: "m",
    firstName: "Tim",
    lastName: "Schmidt",
    dateOfBirth: "1990-12-05",
    positionX: -300,
    positionY: 500,
  }),
  row({
    id: "demo-lena",
    gender: "f",
    firstName: "Lena",
    lastName: "Schmidt",
    imageData: demoPhoto("LS", "#8c7ba6"),
    dateOfBirth: "1992-04-25",
    positionX: 0,
    positionY: 500,
  }),
  row({
    id: "demo-alex",
    gender: "o",
    firstName: "Alex",
    lastName: "Schmidt",
    dateOfBirth: "1994-10-08",
    positionX: 300,
    positionY: 500,
  }),
];

const DEMO_RELATIONS: RelationDB[] = [
  // Couples (union dots + couple lines).
  { from_member_id: "demo-karl", to_member_id: "demo-anna", relation_type: "married" },
  { from_member_id: "demo-peter", to_member_id: "demo-maria", relation_type: "married" },
  // Parent links (child -> parent).
  { from_member_id: "demo-peter", to_member_id: "demo-karl", relation_type: "parent" },
  { from_member_id: "demo-peter", to_member_id: "demo-anna", relation_type: "parent" },
  { from_member_id: "demo-hans", to_member_id: "demo-karl", relation_type: "parent" },
  { from_member_id: "demo-hans", to_member_id: "demo-anna", relation_type: "parent" },
  { from_member_id: "demo-clara", to_member_id: "demo-karl", relation_type: "parent" },
  { from_member_id: "demo-clara", to_member_id: "demo-anna", relation_type: "parent" },
  { from_member_id: "demo-julia", to_member_id: "demo-peter", relation_type: "parent" },
  { from_member_id: "demo-julia", to_member_id: "demo-maria", relation_type: "parent" },
  { from_member_id: "demo-tim", to_member_id: "demo-peter", relation_type: "parent" },
  { from_member_id: "demo-tim", to_member_id: "demo-maria", relation_type: "parent" },
  { from_member_id: "demo-lena", to_member_id: "demo-peter", relation_type: "parent" },
  { from_member_id: "demo-lena", to_member_id: "demo-maria", relation_type: "parent" },
  { from_member_id: "demo-alex", to_member_id: "demo-hans", relation_type: "parent" },
];

/** Demo members mapped through the same DB-row path as a backend-loaded tree. */
export function getDemoMembers(): Member[] {
  return mapMembersFromRows(DEMO_ROWS, DEMO_RELATIONS);
}
