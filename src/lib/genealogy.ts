// Transcribed from the text and arrow endpoints in public/media/geneaolgy.pdf (2017).
// The chart's ranks and lateral ordering preserve the original branching layout.
import records from '@/data/genealogy.json';

export type Scholar = (typeof records)[number];
export const scholars: Scholar[] = records;
export const rootScholar = scholars[0];
export const byId = new Map(scholars.map(person => [person.id, person]));
export const students = new Map(scholars.map(person => [person.id, [] as Scholar[]]));

for (const student of scholars) {
  for (const id of student.advisors) students.get(id)!.push(student);
}

// Breadth-first traversal chooses one shortest path when several branches converge.
const previous = new Map<string, string | null>([[rootScholar.id, null]]);
const queue = [rootScholar];
for (let i = 0; i < queue.length; i++) {
  for (const advisor of queue[i].advisors) {
    if (previous.has(advisor)) continue;
    previous.set(advisor, queue[i].id);
    queue.push(byId.get(advisor)!);
  }
}
export function lineageTo(person: Scholar) {
  const path: Scholar[] = [];
  let id: string | null = person.id;
  while (id) {
    path.push(byId.get(id)!);
    id = previous.get(id) ?? null;
  }
  return path.reverse();
}

export const recentLine: Scholar[] = [rootScholar];
while (recentLine[recentLine.length - 1].advisors.length === 1) {
  recentLine.push(byId.get(recentLine[recentLine.length - 1].advisors[0])!);
}

export const landmarks = [
  {id: 'robert-mario-fano', label: 'Robert Fano'},
  {id: 'carl-friedrich-gauss', label: 'Carl Friedrich Gauß'},
  {id: 'jean-baptiste-joseph-fourier', label: 'Joseph Fourier'},
  {id: 'pierre-simon-laplace', label: 'Pierre-Simon Laplace'},
  {id: 'leonhard-euler', label: 'Leonhard Euler'},
  {id: 'gottfried-wilhelm-leibniz', label: 'Gottfried Wilhelm Leibniz'},
  {id: 'nicolaus-mikolaj-kopernik-copernicus', label: 'Nicolaus Copernicus'},
  {id: 'nasir-al-din-al-tusi', label: 'Nasir al-Din al-Tusi'},
];
export const linkCount = scholars.reduce((sum, person) => sum + person.advisors.length, 0);

export function normalizeName(text: string) {
  return text.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '').replace(/ß/g, 'ss').replace(/ł/g, 'l');
}
