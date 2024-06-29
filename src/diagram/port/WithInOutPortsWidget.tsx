import * as React from 'react';
import _map from 'lodash/map';
import {DiagramEngine, PortWidget} from '@projectstorm/react-diagrams-core';
import styled from '@emotion/styled';
import { WithInOutPorts } from './WithInOutPorts';

namespace Styled {
  export const Port = styled.div`
    width: 8px;
    height: 16px;
    background: rgba(255, 255, 255, 0.2);

    &:hover {
      background: rgb(192, 255, 0);
      cursor: pointer;
    }
  `;

  export const DisabledPort = styled.div`
    width: 8px;
    height: 100%;
  `;
}

export interface WithInOutPortsWidgetProps {
  model: WithInOutPorts;
  engine: DiagramEngine;
}

/**
 * Wrap a widget with input(left) or/and output(right) ports
 * 
 * @param props model that has in/out ports
 * @returns 
 */
export function WithInOutPortsWidget (props: React.PropsWithChildren<WithInOutPortsWidgetProps>) {
  const {model, engine, children} = props;
  const inPort = model.getInPort();
  const leftPort =
    model.isInPortEnabled() && inPort ? (
      <PortWidget engine={engine} port={inPort} key="left">
        <Styled.Port>&#10547;</Styled.Port>
      </PortWidget>
    ) : (
      <Styled.DisabledPort key="left"/>
    );
  const outPort = model.getOutPort();
  const rightPort =
    model.isOutPortEnabled() && outPort ? (
      <PortWidget engine={engine} port={outPort} key="right">
        <Styled.Port>&#10555;</Styled.Port>
      </PortWidget>
    ) : (
      <Styled.DisabledPort key="right"/>
    );
  return (
    <>
        {leftPort}
        {children}
        {rightPort}
    </>
  );
}
