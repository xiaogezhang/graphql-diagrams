import * as React from 'react';
import _map from 'lodash/map';
import {DiagramEngine} from '@projectstorm/react-diagrams-core';
import styled from '@emotion/styled';
import {ListNodeModel} from './ListNodeModel';
import {ListItemModel} from '../list/ListItemModel';
import {WithInOutPortsWidget} from '../port/WithInOutPortsWidget';

namespace Styled {
  export const Node = styled.div<{
    background: string | undefined;
    selected: boolean;
    grabbing: boolean;
  }>`
    background-color: ${(p) => p.background};
    border-radius: 5px;
    font-family: sans-serif;
    color: white;
    position: absolute;
    overflow: visible;
    font-size: 11px;
    width: max-content;
    z-index: ${(p) => (p.selected ? 1 : 0)};
    border: ${(p) => (p.selected ? 'solid 4px OrangeRed' : 'solid 2px black')};
    &:hover {
      cursor: ${(p) => (p.grabbing ? 'grabbing' : 'grab')};
    }
  `;

  export const Title = styled.div`
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding: 5px 0px;
    overflow: hidden;
  `;

  export const TitleName = styled.div`
    flex-grow: 1;
  `;

  export const HorizontalLine = styled.div`
    width: 100%;
    height: 1px;
    background-color: rgb(168, 168, 168);
    opacity: 0.3;
  `;

  export const Items = styled.div`
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    margin-bottom: 1px;
    background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.2));
  `;

  export const Item = styled.div<{background: string | undefined}>`
    background-color: ${(p) =>
      p.background ? p.background : 'rgba(0, 0, 0, 0)'};
    display: flex;
    margin-top: 1px;
    align-items: center;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-content: stretch;
  `;

  export const Label = styled.div`
    padding: 0 5px;
    flex-grow: 1;
  `;
}

export interface ListNodeProps {
  node: ListNodeModel;
  engine: DiagramEngine;
}

/**
 * List node that models the ListNodeModel. It's rendered on the list items it owns.
 * For each list item, it may or may not have in port and out port. In port is on the
 * left side and out port is on the right side. Item content is in the middle.
 * Ports not associated with list items will not be rendered.
 */
export default function ListNodeWidget(props: ListNodeProps) {
  const {node, engine} = props;
  const [grabbing, setGrabbing] = React.useState<boolean>(false);
  const createItem = (item: ListItemModel<any>, index: number) => {
    return (
      <React.Fragment key={index}>
        <Styled.Item key={index} background={item.getBackgroundColor()}>
          <WithInOutPortsWidget model={item} engine={engine}>
            {item.renderContent()}
          </WithInOutPortsWidget>
        </Styled.Item>
        <Styled.HorizontalLine></Styled.HorizontalLine>
      </React.Fragment>
    );
  };
  const header = node.getHeader();

  return (
    <Styled.Node
      data-default-node-name={node.getOptions().name}
      selected={node.isSelected()}
      grabbing={grabbing}
      id={node.getID()}
      key={node.getID()}
      onMouseDown={() => setGrabbing(true)}
      onMouseUp={() => setGrabbing(false)}
      background={node.getOptions().color}>
      <Styled.Title key="title">
        <WithInOutPortsWidget model={node} engine={engine} key="title">
          {header ? 
              header.renderContent() :
            <Styled.TitleName key="titleName">{node.getOptions().name}</Styled.TitleName>
          }
        </WithInOutPortsWidget>
      </Styled.Title>
      <Styled.Items key="items">{_map(node.getItems(), createItem)}</Styled.Items>
    </Styled.Node>
  );
}
