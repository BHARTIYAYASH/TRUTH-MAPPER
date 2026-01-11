import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ArgumentNode, ArgumentTree } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function buildTree(nodes: ArgumentNode[]): ArgumentTree[] {
  if (!nodes || nodes.length === 0) return [];
  const nodeMap = new Map<string, ArgumentTree>();
  nodes.forEach(node => {
    nodeMap.set(node.id, { ...node, children: [] });
  });

  const tree: ArgumentTree[] = [];
  nodeMap.forEach(node => {
    if (node.parentId && nodeMap.has(node.parentId)) {
      const parent = nodeMap.get(node.parentId);
      if (parent) {
        parent.children.push(node);
      }
    } else {
      tree.push(node);
    }
  });

  return tree;
}
