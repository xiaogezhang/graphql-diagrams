import { ListNodeModel } from "./node/ListNodeModel";

export type TreeNode = {
  node: ListNodeModel;
  rowsCount: number;
  width: number;
  children: Array<TreeNode>;
};

export type LayoutConfig = {
  charWidth: number;
  rowHeight: number;
  yGap: number;
  xGap: number;
  nodeWidth: number;
};

export const defaultLayoutConfig: LayoutConfig = {
  charWidth: 7,
  rowHeight: 30,
  yGap: 20,
  xGap: 20,
  nodeWidth: 30,
};

/**
 * Use BFS to traverse the tree/DAG, and calculate a simple layout 
 * 
 * @param roots the root or roots of a tree/DAG/forest
 * @param startX starting X coordinate, increasing with more objects on the canvas.
 * @param startY similar to startX
 * @param layoutConfig describe how much to conside for width of characeter, height of a row, gap 
 *     between nodes etc. These are estimate. If too small the objects may overlap on canvas.
 *     If too big, the canvas will be too big and consume more memory. Try and adjust.
 */ 
export function layout(
  roots: Array<TreeNode>,
  startX: number,
  startY: number,
  layoutConfig?: LayoutConfig,
): void {
  const {charWidth, rowHeight, yGap, xGap, nodeWidth} = layoutConfig ?? defaultLayoutConfig;
  let level: Array<TreeNode> = roots;
  const visited: Set<string> = new Set();
  let curX = startX;
  while (level.length > 0) {
    let curY = startY;
    const nextLevel: Array<TreeNode> = [];
    let maxWidth = nodeWidth;
    level.forEach((node) => {
      if (!visited.has(node.node.getID())) {
        node.node.setPosition(curX, curY);
        curY +=
          rowHeight * node.rowsCount + (node.rowsCount >= 5 ? yGap : yGap * 3);
        node.children.forEach((child) => {
          nextLevel.push(child);
        });
        visited.add(node.node.getID());
        if (node.width > maxWidth) {
          maxWidth = node.width;
        }
      }
    });
    level = nextLevel;
    curX += maxWidth * charWidth + xGap;
  }
}
