import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import _values from 'lodash/values';
import {ListItemModel} from './ListItemModel';

export interface List {
  getItem(id: string): ListItemModel<any>;

  getItems(): ListItemModel<any>[];

  addItem(item: ListItemModel<any>): void;

  removeItem(item: ListItemModel<any> | string): void;

  size(): number;
}
