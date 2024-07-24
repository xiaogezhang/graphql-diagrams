import React from 'react';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';
import {Anchor, useResize} from '../core/hooks';
import DepthContext from '../DepthContext';

const DraggerSize: number = 4;
namespace Styled {
  export const Pane = styled.div<{
    anchor?: Anchor;
    size?: string;
    backgroundColor?: string;
    opacity?: number;
    depth?: number;
  }>`
    position: absolute;
    left: ${(p) => (p.anchor === 'right' ? undefined : '0')};
    right: ${(p) => (p.anchor === 'left' ? undefined : '0')};
    top: ${(p) => (p.anchor === 'bottom' ? undefined : '0')};
    bottom: ${(p) => (p.anchor === 'top' ? undefined : '0')};
    display: flex;
    background-color: ${(p) => p.backgroundColor ?? 'inherit'};
    flex-direction: ${(p) =>
      p.anchor === 'left' || p.anchor === 'right' ? 'row' : 'column'};
    opacity: ${(p) => p.opacity ?? '1'};
    overflow: hidden;
    width: ${(p) =>
      p.anchor === 'left' || p.anchor === 'right'
        ? p.size ?? 'auto'
        : undefined};
    height: ${(p) =>
      p.anchor === 'top' || p.anchor === 'bottom'
        ? p.size ?? 'auto'
        : undefined};
    z-index: ${(p) => (p.depth ? p.depth : 'auto')};
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
  `;

  export const Dragger = styled.div<{
    anchor?: Anchor;
    backgroundColor?: string;
  }>`
    position: absolute;
    background-color: ${(p) => p.backgroundColor ?? 'inherit'};
    top: ${(p) =>
      p.anchor === 'left' || p.anchor === 'right'
        ? '0'
        : p.anchor === 'bottom'
        ? '0'
        : undefined};
    bottom: ${(p) =>
      p.anchor === 'left' || p.anchor === 'right'
        ? '0'
        : p.anchor === 'top'
        ? '0'
        : undefined};
    left: ${(p) =>
      p.anchor === 'top' || p.anchor === 'bottom'
        ? '0'
        : p.anchor === 'right'
        ? '0'
        : undefined};
    right: ${(p) =>
      p.anchor === 'top' || p.anchor === 'bottom'
        ? '0'
        : p.anchor === 'left'
        ? '0'
        : undefined};
    width: ${(p) =>
      p.anchor === 'left' || p.anchor === 'right'
        ? DraggerSize + 'px'
        : undefined};
    height: ${(p) =>
      p.anchor === 'top' || p.anchor === 'bottom'
        ? DraggerSize + 'px'
        : undefined};
    cursor: ${(p) =>
      p.anchor === 'left' || p.anchor === 'right'
        ? 'col-resize'
        : 'row-resize'};
  `;

  export const Content = styled.div<{
    anchor?: Anchor;
    opacity?: number;
  }>`
    position: absolute;
    top: ${(p) => p.anchor === 'bottom' ? (DraggerSize + 'px') : '0'};
    bottom: ${(p) => p.anchor === 'top'? (DraggerSize + 'px') : '0'};
    left: ${(p) => p.anchor === 'right'? (DraggerSize + 'px') : '0'};
    right: ${(p) => p.anchor === 'left'? (DraggerSize + 'px') : '0'};
    opacity: ${(p) => p.opacity ?? '1'};
  `;
}

const DefaultSidePaneSize: number = 100;

export type SidePaneProps = {
  anchor?: Anchor;
  size?: number;
  minSize?: number;
  maxSize?: number;
  backgroundColor?: string;
  opacity?: number;
};

/**
 * Side pane can stick to one of four anchors of the parent component: left, right, top, bottom
 * A dragger bar can be dragged to change the size of the side pane. 
 * 
 * This is different from drawer in that it's floating above the other components, not share the 
 * space. 
 * 
 * @param props 
 * @returns 
 */
export default function SidePane(
  props: React.PropsWithChildren<SidePaneProps>,
) {
  const {
    size: initSize,
    minSize,
    maxSize,
    backgroundColor,
    anchor,
    opacity,
    children,
  } = props;
  const {size, enableResize} = useResize(
    anchor ?? 'right',
    initSize ?? DefaultSidePaneSize,
    minSize,
    maxSize,
  );
  const depth = React.useContext(DepthContext);
  const draggerColor = backgroundColor ? tinycolor(backgroundColor).darken(5).toRgbString()
    : backgroundColor;

  return anchor === 'left' || anchor === 'top' ? (
    <Styled.Pane
      anchor={anchor}
      size={size + 'px'}
      backgroundColor={backgroundColor}
      opacity={opacity}
      depth={depth + 1}>
      <Styled.Content anchor={anchor} opacity={opacity}>
        {children}
      </Styled.Content>
      <Styled.Dragger
        anchor={anchor}
        backgroundColor={draggerColor}
        onMouseDown={enableResize}
      />
    </Styled.Pane>
  ) : (
    <Styled.Pane
      anchor={anchor}
      size={size + 'px'}
      backgroundColor={backgroundColor}
      opacity={opacity}
      depth={depth + 1}>
      <Styled.Dragger
        anchor={anchor}
        backgroundColor={draggerColor}
        onMouseDown={enableResize}
      />
      <Styled.Content anchor={anchor} opacity={opacity}>
        {children}
      </Styled.Content>
    </Styled.Pane>
  );
}
