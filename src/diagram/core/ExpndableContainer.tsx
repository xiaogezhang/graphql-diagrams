import React, {useCallback, useContext, useState} from 'react';

import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';
import OutsideClickObserver from './hooks';
import DepthContext from '../DepthContext';
import '../Diagram.css';

namespace Styled {
  export const Container = styled.div<{
    expanded?: boolean, 
    backgroundColor?: string,
    expandedOpacity?: number,
    expandedPosition?: string;
    expandedWidth?: string;
    expandedHeight?: string;
    depth: number;
  }>`
    position: ${(p) => (p.expanded ? (p.expandedPosition ?? 'fixed') : 'inherit')};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    opacity: ${(p) => (p.expanded ? (p.expandedOpacity ?? '0.9') : 'inherit')};
    overflow: hidden;
    background-color: ${(p) => (p.expanded ? (p.backgroundColor ?? 'rgb(225, 225, 225)') : 'inherit')};
    border-radius: 8px;
    height: ${(p) => (p.expanded ? (p.expandedHeight ?? '90%') : 'auto')};
    width: ${(p) => (p.expanded ? (p.expandedWidth ?? '90%') : 'auto')};
    transition: top 1s, left 1s;
    max-width: 100%;
    max-height: 100%;
    z-index: ${(p) => (p.expanded ? p.depth : 'auto')}; 
    resize: both;
  `;

  export const Button = styled.div`
    font-size: 16px;
    width: max-content;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
      background-color: Lime;
      span { visibility: visible; }
    }
  `;

  export const Tooltip = styled.span`
    visibility: hidden;
    background-color: white;
    color: #333;
    text-align: center;
    border-radius: 5px;
    padding: 4px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 14px;
    box-shadow: 2px 2px 1px silver;

    /* Position the tooltip */
    position: absolute;
    margin-top: 40px;
    margin-left: -20px;
    z-index: 100;
  `;

  export const Header = styled.div<{
    backgroundColor?: string;
    expanded?: boolean;
  }>`
    background-color: ${(p) =>
      p.backgroundColor ?? (p.expanded ? 'rgb(225, 225, 225)' : 'inherit')};
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 4px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `;
}

export type ExpandableContainerProps = {
  collapseOnClickOutside?: boolean; // If true, after expanded, click outside of the component will collpase it
  backgroundColor?: string, 
  header?: React.JSX.Element; // There's one button on top left to expand/collapse. Other components can be put in the hdeader
  startAsExpanded?: boolean, // If true, the component will start as expanded state, otherwise in collapsed state
  expandedOpacity?: number, // opacity after expanded, value between 0 and 1. 0 is transparent, 1 is opaque.
  expandedPosition?: string;
  expandedWidth?: string; // it can be number of pixels, or percentage of screen, e.g: '600px', '90%' etc
  expandedHeight?: string;
  expanded?: (_expanded: boolean) => void;
  headerClassName?: string;
};

/**
 * Wrapper component for React components that can be expanded and collapse.
 * @param props 
 * @returns 
 */
export default function ExpandableContainer(props: React.PropsWithChildren<ExpandableContainerProps>) {
  const {
    backgroundColor, 
    header, 
    collapseOnClickOutside, 
    startAsExpanded, 
    expandedOpacity, 
    expandedPosition, 
    expandedHeight, 
    expandedWidth, 
    expanded: expandedCallback,
    headerClassName,
  } = props;
  const [expanded, setExpanded] = useState<boolean>(startAsExpanded ?? false);
  const componentExpanded = useCallback((exp: boolean) => {
    setExpanded(exp);
    expandedCallback && expandedCallback(exp);
  }, [expandedCallback]);
  const tinyColor = backgroundColor ? tinycolor(backgroundColor) : undefined;
  const headerBackground = tinyColor ? (
      tinyColor.isLight() ? 
        tinyColor.darken(3).toRgbString() 
        : 
        tinyColor.lighten(3).toRgbString()
    ) 
    : undefined;
  const headerComponent = (
    <Styled.Header className={headerClassName} expanded={expanded} backgroundColor={headerBackground}>
      {expanded ? (
        <Styled.Button onClick={() => componentExpanded(!expanded)}>
          &#9196;
          <Styled.Tooltip>Collapse</Styled.Tooltip>
        </Styled.Button>
      ) : (
        <Styled.Button
          onClick={() => componentExpanded(!expanded)}>
          &#9195;
          <Styled.Tooltip>Expand</Styled.Tooltip>
        </Styled.Button>
      )}
      {header}
    </Styled.Header>
  );
  const depth = useContext(DepthContext);  

  return <DepthContext.Provider value={depth + 1}>
    <OutsideClickObserver
      onClickOutside={(outside: boolean) => outside && componentExpanded(!collapseOnClickOutside) }>
      <Styled.Container 
        backgroundColor={backgroundColor}
        expanded={expanded} 
        expandedOpacity={expandedOpacity} 
        expandedPosition={expandedPosition} 
        expandedHeight={expandedHeight} 
        expandedWidth={expandedWidth}
        depth={depth}>
        {headerComponent}
        {props.children}  
      </Styled.Container>
    </OutsideClickObserver>
  </DepthContext.Provider>;
}