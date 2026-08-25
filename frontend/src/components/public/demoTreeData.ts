import { Gender, Member, Relation } from "@/types/member";
import { Tree } from "@/types/tree";
import i18n from "@/i18n/i18n";

/**
 * Built-in, fully local demo family: rendered without any backend request or
 * login state. The dataset deliberately covers every canvas-filter dimension:
 * three generations, all genders (incl. "other"), living and deceased
 * members, members with and without photos, and birth years spanning more
 * than 40 years.
 */
export const DEMO_TREE_ID = "demo-local-tree";

interface DemoMemberSpec {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birth: string;
  death?: string;
  deceased?: boolean;
  photo?: string | null;
  maidenName?: string | null;
  x: number;
  y: number;
  parents?: { father: string; mother: string };
  spouse?: string;
}

// Small inline SVG portrait so demo photos need no network access.
function photoDataUri(initials: string, background: string): string {
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128">` +
    `<rect width="128" height="128" fill="${background}"/>` +
    `<text x="64" y="66" font-family="sans-serif" font-size="44" ` +
    `font-weight="bold" fill="#ffffff" text-anchor="middle" ` +
    `dominant-baseline="middle">${initials}</text></svg>`;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const DEMO_SPECS: DemoMemberSpec[] = [
  // --- Generation 1 ---
  {
    id: "demo-henry",
    firstName: "Henry",
    lastName: "Bennett",
    gender: "m",
    birth: "1928-04-12",
    death: "2005-11-03",
    deceased: true,
    photo: photoDataUri("HB", "#1e3a8a"),
    x: 700,
    y: 0,
    spouse: "demo-margaret",
  },
  {
    id: "demo-margaret",
    firstName: "Margaret",
    lastName: "Bennett",
    maidenName: "Lawson",
    gender: "f",
    birth: "1932-07-25",
    death: "2018-02-19",
    deceased: true,
    photo: photoDataUri("MB", "#be185d"),
    x: 1050,
    y: 0,
    spouse: "demo-henry",
  },
  // --- Generation 2 ---
  {
    id: "demo-robert",
    firstName: "Robert",
    lastName: "Bennett",
    gender: "m",
    birth: "1955-09-01",
    photo: photoDataUri("RB", "#0f766e"),
    x: 250,
    y: 350,
    parents: { father: "demo-henry", mother: "demo-margaret" },
    spouse: "demo-linda",
  },
  {
    id: "demo-linda",
    firstName: "Linda",
    lastName: "Bennett",
    maidenName: "Carter",
    gender: "f",
    birth: "1958-03-14",
    photo: null,
    x: 600,
    y: 350,
    spouse: "demo-robert",
  },
  {
    id: "demo-dorothy",
    firstName: "Dorothy",
    lastName: "Miller",
    maidenName: "Bennett",
    gender: "f",
    birth: "1960-12-08",
    death: "2021-06-30",
    deceased: true,
    photo: null,
    x: 1150,
    y: 350,
    parents: { father: "demo-henry", mother: "demo-margaret" },
    spouse: "demo-george",
  },
  {
    id: "demo-george",
    firstName: "George",
    lastName: "Miller",
    gender: "m",
    birth: "1962-05-22",
    photo: photoDataUri("GM", "#4338ca"),
    x: 1500,
    y: 350,
    spouse: "demo-dorothy",
  },
  // --- Generation 3 ---
  {
    id: "demo-alex",
    firstName: "Alex",
    lastName: "Bennett",
    gender: "o",
    birth: "1988-08-08",
    photo: null,
    x: 100,
    y: 700,
    parents: { father: "demo-robert", mother: "demo-linda" },
  },
  {
    id: "demo-sophia",
    firstName: "Sophia",
    lastName: "Bennett",
    gender: "f",
    birth: "1990-01-17",
    photo: photoDataUri("SB", "#b45309"),
    x: 450,
    y: 700,
    parents: { father: "demo-robert", mother: "demo-linda" },
  },
  {
    id: "demo-noah",
    firstName: "Noah",
    lastName: "Miller",
    gender: "m",
    birth: "1992-10-05",
    photo: null,
    x: 1050,
    y: 700,
    parents: { father: "demo-george", mother: "demo-dorothy" },
  },
  {
    id: "demo-olivia",
    firstName: "Olivia",
    lastName: "Miller",
    gender: "f",
    birth: "1995-02-28",
    death: "2010-07-14",
    deceased: true,
    photo: null,
    x: 1400,
    y: 700,
    parents: { father: "demo-george", mother: "demo-dorothy" },
  },
];

function buildDemoMembers(): Member[] {
  return DEMO_SPECS.map((spec) => {
    const relations: Relation[] = [];
    if (spec.spouse) {
      relations.push({
        fromMemberId: spec.id,
        toMemberId: spec.spouse,
        relationType: "married",
      });
    }

    return {
      id: spec.id,
      gender: spec.gender,
      academicTitle: null,
      firstName: spec.firstName,
      middleNames: null,
      baptismalName: null,
      lastName: spec.lastName,
      maidenName: spec.maidenName ?? null,
      imageData: spec.photo ?? null,
      deceased: spec.deceased ?? false,
      adopted: false,
      date: {
        birth: spec.birth,
        death: spec.death ?? null,
      },
      parents: {
        paternalParent: spec.parents?.father ?? null,
        maternalParent: spec.parents?.mother ?? null,
      },
      additionalData: null,
      birthplace: null,
      hometown: null,
      cemetery: null,
      placesLived: [],
      isCollapsed: false,
      linkedTreeId: null,
      linkedMemberId: null,
      position: { x: spec.x, y: spec.y },
      relations,
    };
  });
}

export const DEMO_MEMBERS: Member[] = buildDemoMembers();

/** Synthetic read-only tree descriptor used to boot the canvas locally. */
export function getDemoTree(): Tree {
  return {
    id: DEMO_TREE_ID,
    name: i18n.t("demo.tree-name"),
    role: "viewer",
    public_role: "viewer",
    restrictions: [],
  };
}
