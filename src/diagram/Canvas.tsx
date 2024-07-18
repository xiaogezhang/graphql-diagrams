import * as React from 'react';
import styled from '@emotion/styled';
import {
  DiagramEngine,
} from '@projectstorm/react-diagrams';
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
  
  return (
    <>
        <Styled.Canvas
          engine={engine}
          columns={columns}
          nodeWidth={nodeWidth}
          rows={rows}
          nodeHeight={nodeHeight}
        />
    </>
  );
}
