import * as React from 'react';
import {BaseEntity, DeserializeEvent} from '@projectstorm/react-diagrams';
import {ListItemModel} from './ListItemModel';
import {ClickableText} from './ClickableText';
import {ClickableTextWidget} from './ClickableTextWidget';

export const SimpleTextListItemType: string = 'SimpleTextListItem';

export class SimpleTextListItem extends ListItemModel<ClickableText> {

  constructor(content?: ClickableText) {
    super(SimpleTextListItemType);
    this.content = content;
  }

  serializeContent(): ClickableText | undefined {
    return this.content;
  }

  deserializeContent(
    _: DeserializeEvent<BaseEntity>,
    data: any,
  ): ClickableText {
    return data as ClickableText;
  }

  renderContent(): React.JSX.Element {
    const onClick = () => this.unselectNode();
    return this.content ? (
      <ClickableTextWidget content={this.content} onClick={onClick} />
    ) : (
      <div />
    );
  }

  getBackgroundColor(): string | undefined {
    return this.content?.backgroundColor;
  }
}
