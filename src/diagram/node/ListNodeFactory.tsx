import * as React from 'react';
import {AbstractReactFactory, GenerateModelEvent, GenerateWidgetEvent} from '@projectstorm/react-canvas-core';
import {DiagramEngine} from '@projectstorm/react-diagrams-core';
import {ListNodeModel, ListNodeModelType} from './ListNodeModel';
import ListNodeWidget from './ListNodeWidget';

/**
 * Factory to create the type of nodes used in GraphQL diagram. Mainly ListNodeModel
 */
export class ListNodeFactory extends AbstractReactFactory<
  ListNodeModel,
  DiagramEngine
> {
  constructor() {
    super(ListNodeModelType);
  }

  generateReactWidget(event: GenerateWidgetEvent<ListNodeModel>): React.JSX.Element {
    return <ListNodeWidget key={event.model?.getID()} engine={this.engine} node={event.model} />;
  }

  generateModel(_: GenerateModelEvent): ListNodeModel {
    return new ListNodeModel();
  }
}
