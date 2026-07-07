"use client";

// Lightweight client-side project store. No backend in this demo — projects
// live in localStorage and are shared across the sidebar / dashboard / compose
// via useSyncExternalStore. Seeds a Demo Project on first run.

import { useSyncExternalStore } from "react";
import type { Project } from "./types";
import { demoProject } from "./demoProject";

const KEY = "appening.projects.v1";

let projects: Project[] = [];
let initialized = false;
const listeners = new Set<() => void>();

function emit() {
  for (const l of listeners) l();
}

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(projects));
  } catch {
    /* storage unavailable — keep in-memory only */
  }
}

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const raw = localStorage.getItem(KEY);
    projects = raw ? (JSON.parse(raw) as Project[]) : [demoProject()];
    if (!raw) persist();
  } catch {
    projects = [demoProject()];
  }
}

function commit(next: Project[]) {
  projects = next;
  persist();
  emit();
}

function genId() {
  return "p_" + Math.random().toString(36).slice(2, 9);
}

function nextUntitledName() {
  const base = "Untitled project";
  const taken = new Set(projects.map((p) => p.name));
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base} ${i}`)) i++;
  return `${base} ${i}`;
}

/* ---- mutations ---- */

export function createProject(name?: string): Project {
  ensureInit();
  const project: Project = {
    id: genId(),
    name: name?.trim() || nextUntitledName(),
    createdAt: Date.now(),
    messages: [],
  };
  commit([project, ...projects]);
  return project;
}

export function renameProject(id: string, name: string) {
  ensureInit();
  const trimmed = name.trim();
  if (!trimmed) return;
  commit(projects.map((p) => (p.id === id ? { ...p, name: trimmed } : p)));
}

export function deleteProject(id: string) {
  ensureInit();
  commit(projects.filter((p) => p.id !== id));
}

export function updateProject(id: string, patch: Partial<Project>) {
  ensureInit();
  commit(projects.map((p) => (p.id === id ? { ...p, ...patch } : p)));
}

export function getProject(id: string): Project | undefined {
  ensureInit();
  return projects.find((p) => p.id === id);
}

/* ---- subscription ---- */

function subscribe(cb: () => void) {
  ensureInit();
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function getSnapshot() {
  return projects;
}

// Stable empty array for SSR + first hydration render (avoids mismatch).
const SERVER_SNAPSHOT: Project[] = [];
function getServerSnapshot() {
  return SERVER_SNAPSHOT;
}

/** Reactive list of all projects (newest first). */
export function useProjects(): Project[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
