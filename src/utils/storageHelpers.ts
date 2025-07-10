import { Teacher } from "../types";

const TEACHERS_KEY = "teachers";

export function loadTeachers(): Teacher[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(TEACHERS_KEY);
    if (!data) return [];
    return JSON.parse(data) as Teacher[];
  } catch {
    return [];
  }
}

export function saveTeachers(teachers: Teacher[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TEACHERS_KEY, JSON.stringify(teachers));
}
