import {PortModel} from '@projectstorm/react-diagrams';

/**
 * Models with input or/and output ports. Such as an item, a node etc
 */
export interface WithInOutPorts {
  isInPortEnabled(): boolean;

  isOutPortEnabled(): boolean;

  setInPortEnabled(enabled: boolean): void;

  setOutPortEnabled(enabled: boolean): void;

  getInPort(): PortModel | undefined;

  setInPort(inPort?: PortModel): void;

  getOutPort(): PortModel | undefined;

  setOutPort(outPort?: PortModel): void;
}
