import * as React from 'react';
import styled from '@emotion/styled';
import {
  DiagramEngine,
  SmartLayerWidget,
  TransformLayerWidget,
} from '@projectstorm/react-diagrams';

export interface DiagramProps {
  engine: DiagramEngine;
  className?: string;
}

namespace Styled {
  export const Canvas = styled.div`
    position: relative;
    cursor: move;
    overflow: hidden;
  `;
}
/**
 * This is code from the lib "react-diagrams". There's bug in the code so I have to
 * make a copy and fix here, as the fix I submitted to "react-diagrams" repository
 * gets no response
 */
export function CanvasWidget(props: DiagramProps) {
  const ref = React.useRef(null);
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  const {engine, className} = props;
  const model = engine.getModel();
  // @ts-ignore
  const keyDown = React.useCallback((event) => {
    engine.getActionEventBus().fireAction({event});
  }, [engine]);
  // @ts-ignore
  const keyUp = React.useCallback((event) => {
    engine.getActionEventBus().fireAction({event});
  }, [engine]);

  React.useEffect(() => {
    const canvasListener = engine.registerListener({
      repaintCanvas: () => {
        if (ref.current) {
          engine.setCanvas(ref.current);
          forceUpdate();
        }
      },
    });
    if (ref.current) {
      engine.setCanvas(ref.current);
    }

    document.addEventListener('keyup', keyUp);
    document.addEventListener('keydown', keyDown);
    engine.iterateListeners((list) => {
      list.rendered && list.rendered();
    });

    return () => {
      engine.deregisterListener(canvasListener);
      engine.setCanvas(undefined);

      document.removeEventListener('keyup', keyUp);
      document.removeEventListener('keydown', keyDown);
    };
  }, [engine, keyDown, keyUp]);

  return (
    <Styled.Canvas
      className={className}
      ref={ref}
      onWheel={(event) => { 
        engine.getActionEventBus().fireAction({event});
      }}
      onMouseDown={(event) => { 
        engine.getActionEventBus().fireAction({event}); 
      }}
      onMouseUp={(event) => { 
        engine.getActionEventBus().fireAction({event}); 
      }}
      onMouseMove={(event) => { 
        engine.getActionEventBus().fireAction({event}); 
      }}
      onTouchStart={(event) => {
        engine.getActionEventBus().fireAction({event}); 
      }}
      onTouchEnd={(event) => { 
        engine.getActionEventBus().fireAction({event}); 
      }}
      onTouchMove={(event) => { 
        engine.getActionEventBus().fireAction({event}); 
      }}>
      {model.getLayers().map((layer) => {
        return (
          <TransformLayerWidget layer={layer} key={layer.getID()}>
            <SmartLayerWidget
              layer={layer}
              engine={engine}
              key={layer.getID()}
            />
          </TransformLayerWidget>
        );
      })}
    </Styled.Canvas>
  );
}
