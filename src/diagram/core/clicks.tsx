import {DiagramEngine} from '@projectstorm/react-diagrams';
import {ClickableTarget, TargetType} from '../list/ClickableText';
import {ListNodeModel} from '../node/ListNodeModel';
import {DiagramContextType} from '../DiagramContext';

function scrollCanvas(engine: DiagramEngine, x: number, y: number): void {
  // browser API to scroll element doesn't work, as the canvas model maintains 
  // offsetX and offsetY. 
  // htmlElem.scrollIntoView(..) or other scroll method don't update
  // canvas offsets, and will cause wrong position for all nodes and links.
  const model = engine.getModel();
  if (!model) {
    return;
  }
  const width = window.innerWidth;
  const height = window.innerHeight;
  const oldOffsetX = model.getOffsetX();
  const oldOffsetY = model.getOffsetY();
  // Below test both x and y dimensions.
  // x is the coordinate it's going to scroll to. offsetX is the x dimension
  // offset for the canvas, so if (x + oldOffsetX) < 0, it means if we scroll
  // to x, the x coordinate of the target node will be negative, which means it's
  // outside of the viewable area to the left; on the other side, if
  // (x + oldOffsetX) > (2 * width) / 3, it means the x coordinate of the node
  // is less than 1/3 width of the viewable area to the right side, so we don't want
  // to scroll that far.
  // On Y dimension, it's same idea as on X dimension.
  if (
    x + oldOffsetX < 0 ||
    x + oldOffsetX > (2 * width) / 3 ||
    y + oldOffsetY < 0 ||
    y + oldOffsetY > (2 * height) / 3
  ) {
    const xMove = 0 - x + width / 3;
    const yMove = 0 - y + height / 3;
    model.setOffsetX(xMove);
    model.setOffsetY(yMove);
    engine.repaintCanvas();
  }
}

/**
 * Action handler for different kinds of target types. Usually this is provided through
 * diagram context to the elements in the diagram.
 * 
 * @param context context info about the diagram. Accessible by elements in the diagram
 * @param target target definition, such as node, url, schema etc. Currently only support node inside the diagram
 * @returns 
 */
export async function click(
  context: DiagramContextType,
  target?: ClickableTarget,
  _?: HTMLElement | null,
) {
  if (target && target.type === TargetType.NODE) {
    const {engine, isVisible} = context;
    // The following scrollToElement() method is messing up the internal offset of the canvas,
    // so choose different approach
    // scrollToElement(target.value);
    const model = engine?.getModel();
    if (model && engine) {
      const targetNode = model.getNode(target.value);
      if (targetNode) {
        if (targetNode instanceof ListNodeModel) {
          // target node is not visible
          if (!targetNode.isVisible(isVisible)) {
            return;
          }
        }
        targetNode.setSelected();
        const x = targetNode.getX();
        const y = targetNode.getY();
        scrollCanvas(engine, x, y);
      }
    }
  }
}
