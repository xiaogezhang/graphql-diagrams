import React from 'react';

import styled from '@emotion/styled';
import Draggable from 'react-draggable';

namespace Styled {
  export const Container = styled.div<{
    backgroundColor?: string;
    left?: string;
    top?: string;
    width?: string;
    height?: string;
    maxWidth?: string;
    maxHeight?: string;
    opacity?: number;
    resizable?: boolean;
    border?: string;
    depth?: number;
  }>`
    background-color: ${(p) => p.backgroundColor ?? 'inherit'};
    border: ${(p) => (p.border ? p.border : '')};
    position: ${(p) =>
      p.left !== undefined && p.top !== undefined ? 'fixed' : 'inherit'};
    top: ${(p) => p.top ?? 'auto'};
    left: ${(p) => p.left ?? 'auto'};
    opacity: ${(p) => (p.opacity !== undefined ? p.opacity : 'inherit')};
    overflow: hidden;
    border-radius: 8px;
    height: ${(p) => p.height ?? 'auto'};
    width: ${(p) => p.width ?? 'auto'};
    max-height: fit-content;
    max-width: fit-content;
    resize: ${(p) => (p.resizable ? 'both' : 'none')};
    z-index: ${(p) => (p.depth ? p.depth : 'auto')};
  `;
}

export type ViewportProps = {  
  backgroundColor?: string;
  border?: string;
  left?: number;
  top?: number;
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  opacity?: number;
  draggable?: boolean;
  draggableHandle?: string;
  resizable?: boolean;
  depth?: number;
};

const Viewport = React.forwardRef(function Viewport(
  props: React.PropsWithChildren<ViewportProps>, ref?: React.ForwardedRef<HTMLDivElement>
) {
  const {
    backgroundColor,
    border,
    left,
    top,
    width,
    height,
    maxWidth,
    maxHeight,
    opacity,
    draggable,
    draggableHandle,
    resizable,
    depth,
  } = props;
  const winMaxWidth = window.innerWidth - 20;
  const winMaxHeight = window.innerHeight - 20;
  const component = (
    <Styled.Container
      ref={ref}
      backgroundColor={backgroundColor}
      border={border}
      left={left ? left + 'px' : 'auto'}
      top={top ? top + 'px' : 'auto'}
      width={width}
      height={height}
      maxWidth={maxWidth ?? winMaxWidth + 'px'}
      maxHeight={maxHeight ?? winMaxHeight + 'px'}
      opacity={opacity}
      resizable={resizable}
      depth={depth}>
      {props.children}
    </Styled.Container>
  );
  return draggable ? (
    <Draggable handle={draggableHandle}>{component}</Draggable>
  ) : (
    component
  );
});

export default Viewport;
