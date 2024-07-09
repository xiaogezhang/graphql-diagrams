import * as React from 'react';
import styled from '@emotion/styled';
import {
  DiagramEngine,
} from '@projectstorm/react-diagrams';
import CanvasContext from './graphql/CanvasContext';
import { CanvasWidget } from './CanvasWidget';

namespace Styled {
  export const Canvas = styled(CanvasWidget)<{
    rows?: number;
    columns?: number;
    nodeWidth?: number;
    nodeHeight?: number;
  }>`
    id: digram-canvas;
    width: ${(p) => (p.columns ?? 4) * (p.nodeWidth ?? 150)}px;
    min-height: ${(p) => (p.rows ?? 4) * (p.nodeHeight ?? 150)}px;
  `;
}

export default function Canvas(props: {
  engine: DiagramEngine;
  rows?: number;
  columns?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  
}) {
  const {engine, rows, columns, nodeWidth, nodeHeight} = props;
  
  const scrollCanvas = React.useCallback(
    (x: number, y: number) => {
      // below doesn't work, as the canvas model maintains offsetX and offsetY
      // htmlElem.scrollIntoView(..) or other scroll method don't update
      // canvas offsets, and will cause wrong position for all nodes and links.
      //const canvasElem = engine.getCanvas();
      //canvasElem?.scrollBy(x, y);
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
    },
    [engine],
  );
  return (
    <>
      <CanvasContext.Provider
        value={{scrollCanvas: scrollCanvas, canvasModel: engine.getModel()}}>
        <Styled.Canvas
          engine={engine}
          columns={columns}
          nodeWidth={nodeWidth}
          rows={rows}
          nodeHeight={nodeHeight}
        />
      </CanvasContext.Provider>
    </>
  );
}
