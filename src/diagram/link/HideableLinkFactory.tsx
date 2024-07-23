import * as React from 'react';

import {
  DefaultLinkFactory,
  DefaultLinkWidget,
  GenerateModelEvent,
  GenerateWidgetEvent,
} from '@projectstorm/react-diagrams';
import {HideableLinkModel, HideableLinkModelType} from './HideableLinkModel';
import {HideableWidget} from '../core/HideableWidget';

/**
 * Factory to create the type of links used in GraphQL diagrams. It's registered in 
 * the engine for our diagram
 */
export class HideableLinkFactory<
  Link extends HideableLinkModel = HideableLinkModel,
> extends DefaultLinkFactory<Link> {
  constructor(type = HideableLinkModelType) {
    super(type);
  }

  generateReactWidget(
    event: GenerateWidgetEvent<HideableLinkModel>,
  ): React.JSX.Element {
    return (
      <HideableWidget component={event.model}>
        <DefaultLinkWidget link={event.model} diagramEngine={this.engine} />
      </HideableWidget>
    );
  }

  generateModel(_: GenerateModelEvent): Link {
    return new HideableLinkModel() as Link;
  }
}
