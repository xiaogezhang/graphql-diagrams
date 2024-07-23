import { AbstractModelFactory, GenerateModelEvent } from '@projectstorm/react-canvas-core';
import {
  LeftAndRight,
  LeftAndRightListItem,
  LeftAndRightListItemType,
} from './LeftAndRightListItem';
import {ListItemModel, ListItemModelGenerics} from './ListItemModel';
import {SimpleTextListItem, SimpleTextListItemType} from './SimpleTextListItem';
import { DiagramEngine } from '@projectstorm/react-diagrams';
import { MultiLineText, MultiLineTextListItem, MultiLineTextListItemType } from './MultiLineTextListItem';

export abstract class ItemFactory<T> extends AbstractModelFactory<
  ListItemModel<T, ListItemModelGenerics>,
  DiagramEngine
> {
  generateModel(_: GenerateModelEvent): ListItemModel<T> {
    return createListItem(this.getType());
  }
}

export class SimpleTextListItemFactory extends ItemFactory<string> {
  constructor() {
    super(SimpleTextListItemType);
  }
}

/**
 * Factory to create different kinds of items and their React component
 */
export class LeftAndRightListItemFactory extends ItemFactory<LeftAndRight> {
  constructor() {
    super(LeftAndRightListItemType);
  }
}

export class MultiLineTextListItemFactory extends ItemFactory<MultiLineText> {
  constructor() {
    super(MultiLineTextListItemType);
  }
}

export function createListItem(type: string): ListItemModel<any> {
  if (type === SimpleTextListItemType) {
    return new SimpleTextListItem();
  } 
  if (type === LeftAndRightListItemType) {
    return new LeftAndRightListItem();
  }
  if (type === MultiLineTextListItemType) {
    return new MultiLineTextListItem();
  } 
  throw new Error('Unknown type ' + type);
}