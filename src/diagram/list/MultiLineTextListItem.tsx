import * as React from 'react';
import {BaseEntity, DeserializeEvent} from '@projectstorm/react-diagrams';
import {ListItemModel} from './ListItemModel';
import { MultiLineTextWidget } from './MultiLineTextWidget';
import { ClickableText } from './ClickableText';

export const MultiLineTextListItemType: string = 'MultiLineTextListItem';

export interface ClickableTextDict {
  [index: string]: ClickableText,
};

export type MultiLineText = {
  content: string[];
  color?: string;
  backgroundColor?: string;
  initNumberOfRows?: number;
  clickableTexts?: ClickableTextDict;
};

/**
 * Model for a list item that has multiple lines of text
 */
export class MultiLineTextListItem extends ListItemModel<MultiLineText> {
  constructor(content?: MultiLineText) {
    super(MultiLineTextListItemType);
    this.content = content;
  }

  serializeContent(): MultiLineText | undefined {
    return this.content;
  }

  deserializeContent(
    event: DeserializeEvent<BaseEntity>,
    data: any,
  ): MultiLineText {
    return data as MultiLineText;
  }

  renderContent(): JSX.Element {
    return this.content ? (
      <MultiLineTextWidget key={this.getID()} content={this.content} />
    ) : (
      <div />
    );
  }

  getBackgroundColor(): string | undefined {
    return this.content?.backgroundColor;
  }
}
