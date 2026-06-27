"use client";

import { useMemo, useState } from "react";
import type { GeneratedFile } from "@/lib/types";
import { Folder, FolderOpen, FileCode } from "./icons";

type Node = { name: string; path: string; isFile: boolean; children: Node[] };

function buildTree(files: GeneratedFile[]): Node[] {
  const root: Node = { name: "", path: "", isFile: false, children: [] };
  for (const f of files) {
    const parts = f.path.split("/").filter(Boolean);
    let cur = root;
    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;
      let child = cur.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, path: parts.slice(0, i + 1).join("/"), isFile, children: [] };
        cur.children.push(child);
      }
      cur = child;
    });
  }
  const sort = (nodes: Node[]) => {
    nodes.sort((a, b) =>
      a.isFile === b.isFile ? a.name.localeCompare(b.name) : a.isFile ? 1 : -1
    );
    nodes.forEach((n) => sort(n.children));
  };
  sort(root.children);
  return root.children;
}

function Row({
  node,
  depth,
  selected,
  onSelect,
  expanded,
  toggle,
}: {
  node: Node;
  depth: number;
  selected: string | null;
  onSelect: (path: string) => void;
  expanded: Set<string>;
  toggle: (path: string) => void;
}) {
  const pad = { paddingLeft: 8 + depth * 14 };
  const isOpen = expanded.has(node.path);

  if (node.isFile) {
    return (
      <button
        type="button"
        onClick={() => onSelect(node.path)}
        style={pad}
        className={`flex w-full items-center gap-2 rounded-md py-1 pr-2 text-left text-[13px] transition-colors ${
          selected === node.path
            ? "bg-surface-2 font-medium text-foreground"
            : "text-muted hover:bg-surface-2 hover:text-foreground"
        }`}
      >
        <FileCode width={15} height={15} className="shrink-0 text-muted-2" />
        <span className="truncate">{node.name}</span>
      </button>
    );
  }

  return (
    <div>
      <button
        type="button"
        onClick={() => toggle(node.path)}
        style={pad}
        className="flex w-full items-center gap-2 rounded-md py-1 pr-2 text-left text-[13px] font-medium text-foreground hover:bg-surface-2"
      >
        {isOpen ? (
          <FolderOpen width={15} height={15} className="shrink-0 text-muted" />
        ) : (
          <Folder width={15} height={15} className="shrink-0 text-muted" />
        )}
        <span className="truncate">{node.name}</span>
      </button>
      {isOpen &&
        node.children.map((c) => (
          <Row
            key={c.path}
            node={c}
            depth={depth + 1}
            selected={selected}
            onSelect={onSelect}
            expanded={expanded}
            toggle={toggle}
          />
        ))}
    </div>
  );
}

export default function FileTree({
  files,
  selected,
  onSelect,
}: {
  files: GeneratedFile[];
  selected: string | null;
  onSelect: (path: string) => void;
}) {
  const tree = useMemo(() => buildTree(files), [files]);
  // All folders expanded by default.
  const allFolders = useMemo(() => {
    const set = new Set<string>();
    const walk = (nodes: Node[]) =>
      nodes.forEach((n) => {
        if (!n.isFile) {
          set.add(n.path);
          walk(n.children);
        }
      });
    walk(tree);
    return set;
  }, [tree]);
  const [expanded, setExpanded] = useState<Set<string>>(allFolders);

  const toggle = (path: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(path) ? next.delete(path) : next.add(path);
      return next;
    });

  return (
    <div className="flex flex-col gap-0.5 p-2">
      {tree.map((n) => (
        <Row
          key={n.path}
          node={n}
          depth={0}
          selected={selected}
          onSelect={onSelect}
          expanded={expanded}
          toggle={toggle}
        />
      ))}
    </div>
  );
}
