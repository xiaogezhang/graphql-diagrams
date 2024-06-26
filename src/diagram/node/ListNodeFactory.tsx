import * as React from 'react';
import {AbstractReactFactory} from '@projectstorm/react-canvas-core';
import {DiagramEngine} from '@projectstorm/react-diagrams-core';
import {ListNodeModel, ListNodeModelType} from './ListNodeModel';
import ListNodeWidget from './ListNodeWidget';

export class ListNodeFactory extends AbstractReactFactory<
  ListNodeModel,
  DiagramEngine
> {
  constructor() {
    super(ListNodeModelType);
  }

  generateReactWidget(event): JSX.Element {
    return <ListNodeWidget key={event.model?.getID()} engine={this.engine} node={event.model} />;
  }

  generateModel(event): ListNodeModel {
    return new ListNodeModel();
  }
}
