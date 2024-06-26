import {PortModel} from '@projectstorm/react-diagrams';

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
