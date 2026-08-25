import { Gender, Member } from "@/types/member";
import { Tree } from "@/types/tree";

function avatarDataUri(initials: string, background: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"><rect width="128" height="128" rx="64" fill="${background}"/><text x="64" y="64" dominant-baseline="central" text-anchor="middle" font-family="Arial,sans-serif" font-size="44" font-weight="700" fill="#ffffff">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

interface DemoMemberInput {
  id: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  birth: string;
  death?: string;
  imageData?: string | null;
  position: { x: number; y: number };
  parents?: {
    paternalParent: string | null;
    maternalParent: string | null;
  };
}

function createDemoMember(input: DemoMemberInput): Member {
  return {
    id: input.id,
    gender: input.gender,
    academicTitle: null,
    firstName: input.firstName,
    middleNames: null,
    baptismalName: null,
    lastName: input.lastName,
    maidenName: null,
    imageData: input.imageData ?? null,
    deceased: Boolean(input.death),
    adopted: false,
    date: {
      birth: input.birth,
      death: input.death ?? null,
    },
    parents: input.parents ?? {
      paternalParent: null,
      maternalParent: null,
    },
    additionalData: null,
    birthplace: null,
    hometown: null,
    cemetery: null,
    placesLived: [],
    isCollapsed: false,
    linkedTreeId: null,
    linkedMemberId: null,
    position: input.position,
    relations: [],
    diseases: [],
  };
}

export const DEMO_TREE: Tree = {
  id: "demo-family-tree",
  name: "Demo Family Tree",
  role: "viewer",
  public_role: null,
  restrictions: [],
};

export const DEMO_FAMILY_MEMBERS: Member[] = [
  createDemoMember({
    id: "demo-arthur",
    firstName: "Arthur",
    lastName: "Bennett",
    gender: "m",
    birth: "1925-04-12",
    death: "2008-11-03",
    imageData: avatarDataUri("AB", "#2563eb"),
    position: { x: 0, y: 0 },
  }),
  createDemoMember({
    id: "demo-eleanor",
    firstName: "Eleanor",
    lastName: "Bennett",
    gender: "f",
    birth: "1928-09-25",
    death: "2019-02-18",
    position: { x: 300, y: 0 },
  }),
  createDemoMember({
    id: "demo-robert",
    firstName: "Robert",
    lastName: "Bennett",
    gender: "m",
    birth: "1955-01-30",
    position: { x: 0, y: 260 },
    parents: { paternalParent: "demo-arthur", maternalParent: "demo-eleanor" },
  }),
  createDemoMember({
    id: "demo-linda",
    firstName: "Linda",
    lastName: "Bennett",
    gender: "f",
    birth: "1960-07-14",
    imageData: avatarDataUri("LB", "#db2777"),
    position: { x: 300, y: 260 },
  }),
  createDemoMember({
    id: "demo-margaret",
    firstName: "Margaret",
    lastName: "Owens",
    gender: "f",
    birth: "1958-03-08",
    imageData: avatarDataUri("MO", "#be185d"),
    position: { x: 650, y: 260 },
    parents: { paternalParent: "demo-arthur", maternalParent: "demo-eleanor" },
  }),
  createDemoMember({
    id: "demo-jordan",
    firstName: "Jordan",
    lastName: "Owens",
    gender: "o",
    birth: "1957-12-02",
    position: { x: 950, y: 260 },
  }),
  createDemoMember({
    id: "demo-susan",
    firstName: "Susan",
    lastName: "Bennett",
    gender: "f",
    birth: "1988-06-21",
    imageData: avatarDataUri("SB", "#ec4899"),
    position: { x: -50, y: 520 },
    parents: { paternalParent: "demo-robert", maternalParent: "demo-linda" },
  }),
  createDemoMember({
    id: "demo-david",
    firstName: "David",
    lastName: "Bennett",
    gender: "m",
    birth: "1992-10-05",
    position: { x: 250, y: 520 },
    parents: { paternalParent: "demo-robert", maternalParent: "demo-linda" },
  }),
  createDemoMember({
    id: "demo-alex",
    firstName: "Alex",
    lastName: "Owens",
    gender: "m",
    birth: "1994-08-17",
    death: "2025-01-12",
    position: { x: 775, y: 520 },
    parents: { paternalParent: "demo-jordan", maternalParent: "demo-margaret" },
  }),
];
