import React from 'react';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';
import ExpandableContainer, { ExpandableContainerProps } from './core/ExpndableContainer';
import SchemaDiagram, { SchemaDiagramProps } from './SchemaDiagram';
import SidePane from './side/SidePane';
import DocumentView from './documents/DocumentView';
import MenuIcon from '../icons/menu.svg';
import CloseIcon from '../icons/close.svg';
import LoadingComponent from './core/LoadingComponent';
import WithTooltip from './core/WithTooltip';

namespace Styled {
  export const Header = styled.div`
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `;

  export const Buttons = styled.div`
    display: flex;
    flex-direction: row;
    max-width: 100px;
  `;

  export const Title = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 16px;
    width: max-content;
    padding: 4px;
    margin-right: 24px;
    column-gap: 16px;
  `;

  export const Name = styled.div`
    color: red;
  `;

  export const Button = styled.div`
    color: blue;
    width: max-content;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
      background-color: LightGray;
    }
  `;
}

export type SchemaDiagramComponentProps = ExpandableContainerProps & SchemaDiagramProps & {
  schemaName?: string;
  showDocExplorer?: boolean;
  close?: () => void;
};

export default function SchemaDiagramComponent(props: SchemaDiagramComponentProps) {
  const {
    startAsExpanded,
    expanded,
    sdl,
    schemaName,
    displayOptions,
    showOptions,
    showDocExplorer,
    close,
    collapseOnClickOutside,
    backgroundColor,
    header,
    expandedOpacity,
    expandedPosition,
    expandedWidth,
    expandedHeight,
    headerClassName,
  } = props;
  const [docExplorerOpen, setDocExplorerOpen] = React.useState<boolean>(
    showDocExplorer ?? false,
  );

  return sdl ? (
    <ExpandableContainer
      backgroundColor={backgroundColor}
      collapseOnClickOutside={collapseOnClickOutside}
      expandedPosition={expandedPosition}
      expandedWidth={expandedWidth}
      expandedHeight={expandedHeight}
      header={
        <Styled.Header>
          {header ?? (
            <Styled.Title>
              Schema <Styled.Name>{schemaName}</Styled.Name>
            </Styled.Title>
          )}
          <Styled.Buttons>
            <WithTooltip title="Document Explorer">
              <Styled.Button onClick={() => setDocExplorerOpen(!docExplorerOpen)}>
                <img width="28" height="28" src={MenuIcon} alt="Document Explorer"/>
              </Styled.Button>
            </WithTooltip>
            <WithTooltip title="Close">
              <Styled.Button onClick={close}>
                <img width="28" height="28" src={CloseIcon} alt="Close" />
              </Styled.Button>
            </WithTooltip>
          </Styled.Buttons>
        </Styled.Header>
      }
      startAsExpanded={startAsExpanded}
      expandedOpacity={expandedOpacity}
      expanded={expanded}
      headerClassName={headerClassName}>
      <SchemaDiagram
        sdl={sdl}
        displayOptions={displayOptions}
        showOptions={showOptions}
      />
      {docExplorerOpen ? (
        <SidePane size={400} minSize={40} backgroundColor="white" anchor="right">
          <DocumentView 
            close={() => setDocExplorerOpen(false)} 
            backgroundColor={tinycolor('LightBlue').lighten(15).toRgbString()}
          /> 
        </SidePane>
      ) : null}
    </ExpandableContainer>
  ) : (
    <LoadingComponent close={close}/>
  );
}
