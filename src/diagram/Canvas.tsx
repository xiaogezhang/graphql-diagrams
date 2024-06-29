import * as React from 'react';
import styled from '@emotion/styled';
import createEngine, {
  CanvasWidget,
  DiagramEngine,
  DiagramModel,
} from '@projectstorm/react-diagrams';
import {ListNodeFactory} from './node/ListNodeFactory';
import GraphQLDiagramContext, {
  defaultTypeGraphOptions,
  TypeGraphOptions,
} from './graphql/GraphQLDiagramContext';
import CanvasContext from './graphql/CanvasContext';

namespace Styled {
  export const Canvas = styled(CanvasWidget)<{
    engine: DiagramEngine;
    rows?: number;
    columns?: number;
    nodeWidth?: number;
    nodeHeight?: number;
  }>`
    id: digram-canvas;
    width: ${(p) => (p.columns ?? 4) * (p.nodeWidth ?? 150)}px;
    min-height: ${(p) => (p.rows ?? 4) * (p.nodeHeight ?? 150)}px;
  `;

  export const Float = styled.div`
    position: fixed;
    bottom: 36px;
    left: 24px;
    margin-left: 48px;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-direction: row;
    flow-wrap: nowrap;
    background: Silver;
    opacity: 0.9;
    border-radius: 8px;
  `;

  export const Checkbox = styled.input`
    margin-right: 4px;
  `;

  export const Label = styled.label`
    padding: 12px;
  `;
}

function createDefaultEngine(): DiagramEngine {
  const engine = createEngine();
  engine.getNodeFactories().registerFactory(new ListNodeFactory());
  return engine;
}

const engine = createDefaultEngine();

export default function Canvas(props: {
  model: DiagramModel;
  rows?: number;
  columns?: number;
  nodeWidth?: number;
  nodeHeight?: number;
  showOptions?: boolean;
}) {
  const {model, rows, columns, nodeWidth, nodeHeight, showOptions} = props;
  engine.setModel(model);
  const [options, setOptions] = React.useState<TypeGraphOptions>(
    defaultTypeGraphOptions,
  );
  const scrollCanvas = React.useCallback(
    (x: number, y: number) => {
      // below doesn't work, as the canvas model maintains offsetX and offsetY
      // htmlElem.scrollIntoView(..) or other scroll method don't update 
      // canvas offsets, and will cause wrong position for all nodes and links.
      //const canvasElem = engine.getCanvas();
      //canvasElem?.scrollBy(x, y);
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
    [model],
  );
  return (
    <>
      <CanvasContext.Provider
        value={{scrollCanvas: scrollCanvas, canvasModel: model}}>
        <Styled.Canvas
          engine={engine}
          columns={columns}
          nodeWidth={nodeWidth}
          rows={rows}
          nodeHeight={nodeHeight}
        />
      </CanvasContext.Provider>
      {!showOptions ? null : (
        <Styled.Float>
          <Styled.Label>
            <Styled.Checkbox
              id="meta-links"
              type="checkbox"
              color="primary"
              checked={options.createMetaLinks}
              onChange={() =>
                setOptions({
                  createMetaLinks: !options.createMetaLinks,
                  createInheritanceLinks: options.createInheritanceLinks,
                  createInputObjectTypes: options.createInputObjectTypes,
                })
              }
            />
            Show Meta Links
          </Styled.Label>
          <Styled.Label>
            <Styled.Checkbox
              id="inheritance"
              type="checkbox"
              color="primary"
              checked={options.createInheritanceLinks}
              onChange={() =>
                setOptions({
                  createMetaLinks: options.createMetaLinks,
                  createInheritanceLinks: !options.createInheritanceLinks,
                  createInputObjectTypes: options.createInputObjectTypes,
                })
              }
            />
            Show Inheritance
          </Styled.Label>
          <Styled.Label>
            <Styled.Checkbox
              id="input-object-types"
              type="checkbox"
              color="primary"
              checked={options.createInputObjectTypes}
              onChange={() =>
                setOptions({
                  createMetaLinks: options.createMetaLinks,
                  createInheritanceLinks: options.createInheritanceLinks,
                  createInputObjectTypes: !options.createInputObjectTypes,
                })
              }
            />
            Show Input Object Types
          </Styled.Label>
        </Styled.Float>
      )}
    </>
  );
}
