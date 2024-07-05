import React, {useState} from 'react';

import styled from '@emotion/styled';
import OutsideClickObserver from './hooks';

namespace Styled {
  export const Container = styled.div<{
    expanded?: boolean, 
    backgroundColor?: string,
    expandedOpacity?: number,
    expandedPosition?: string;
    expandedWidth?: string;
    expandedHeight?: string;
  }>`
    position: ${(p) => (p.expanded ? (p.expandedPosition ?? 'fixed') : 'inherit')};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 8px;
    opacity: ${(p) => (p.expanded ? (p.expandedOpacity ?? '0.9') : 'inherit')};
    overflow: hidden;
    background-color: ${(p) => (p.expanded ? (p.backgroundColor ?? 'rgb(225, 225, 225)') : 'inherit')};
    border-radius: 8px;
    height: ${(p) => (p.expanded ? (p.expandedHeight ?? '90%') : 'auto')};
    width: ${(p) => (p.expanded ? (p.expandedWidth ?? '90%') : 'auto')};
    transition: top 1s, left 1s;
    max-width: 100%;
    max-height: 100%;
    z-index: ${(p) => (p.expanded ? 100 : 0)}; 
    resize: both;
  `;

  export const Button = styled.div`
    font-size: 24px;
    width: max-content;
    padding: 4px;
    margin-right: 8px;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
      background-color: Lime;
    }
  `;

  export const Header = styled.div`
    padding-left: 16px;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  `;

  export const Link = styled.div`
    padding-left: 24px;
  `;
}

export type ExpandableContainerProps = {
  collapseOnClickOutside?: boolean;
  backgroundColor?: string,
  header?: React.JSX.Element;
  startAsExpanded?: boolean,
  expandedOpacity?: number,
  expandedPosition?: string;
  expandedWidth?: string;
  expandedHeight?: string;
};

export default function ExpandableContainer(props: React.PropsWithChildren<ExpandableContainerProps>) {
  const {backgroundColor, header, collapseOnClickOutside, startAsExpanded, expandedOpacity, expandedPosition, expandedHeight, expandedWidth} = props;
  const [expanded, setExpanded] = useState<boolean>(startAsExpanded ?? false);
  const headerComponent = <Styled.Header>
      {expanded ? (
        <Styled.Button onClick={() => setExpanded(!expanded)}>&#9196;</Styled.Button>
        ) : (
        <Styled.Button onClick={() => setExpanded(!expanded)}>&#9195;</Styled.Button>
      )}
      {header}
    </Styled.Header>;

  return <OutsideClickObserver
      onClickOutside={(outside: boolean) => outside && setExpanded(!collapseOnClickOutside) }>
      <Styled.Container 
        backgroundColor={backgroundColor}
        expanded={expanded} 
        expandedOpacity={expandedOpacity} 
        expandedPosition={expandedPosition} 
        expandedHeight={expandedHeight} 
        expandedWidth={expandedWidth}>
        {headerComponent}
        {props.children}  
      </Styled.Container>
    </OutsideClickObserver>;
}