import _forEach from 'lodash/forEach';
import _map from 'lodash/map';

import {
  DefaultNodeModel,
  DefaultNodeModelGenerics,
  DefaultNodeModelOptions,
  DefaultPortModel,
  DeserializeEvent,
  PortModel,
} from '@projectstorm/react-diagrams';
import {ListItemModel} from '../list/ListItemModel';
import {WithInOutPorts} from '../port/WithInOutPorts';
import {createListItem} from '../list/ItemFactory';

export interface ListNodeModelOptions extends DefaultNodeModelOptions {
  name?: string;
  color?: string;
}

export interface ListNodeModelGenerics extends DefaultNodeModelGenerics {
  OPTIONS: ListNodeModelOptions;
}

export const ListNodeModelType: string = 'ListNodeModel';

export class ListNodeModel extends DefaultNodeModel implements WithInOutPorts {
  protected inPortEnabled: boolean = false;
  protected outPortEnabled: boolean = false;
  protected inPort?: PortModel;
  protected outPort?: PortModel;
  protected items: ListItemModel<any>[];

  constructor(name: string, color: string);
  constructor(options?: ListNodeModelOptions);
  constructor(options: any = {}, color?: string) {
    if (typeof options === 'string') {
      options = {
        name: options,
        color: color,
      };
    }
    super({
      type: ListNodeModelType,
      name: 'Untitled',
      color: 'rgb(0,192,255)',
      ...options,
    });
    this.items = [];
  }

  removePort(port: DefaultPortModel): void {
    const items = this.getItems();
    items.forEach((item) => {
      if (port.getOptions().in) {
        const inPort = item.getInPort();
        if (inPort && inPort.getID() === port.getID()) {
          item.setInPort(undefined);
        }
      } else {
        const outPort = item.getOutPort();
        if (outPort && outPort.getID() === port.getID()) {
          item.setOutPort(undefined);
        }
      }
    });
    super.removePort(port);
  }

  getItem(id: string): ListItemModel<any> | undefined {
    return this.items.find((item) => item.getId() === id);
  }

  getItems(): ListItemModel<any>[] {
    return this.items;
  }

  addItem(item: ListItemModel<any>): void {
    const found = this.items.find((i) => item.getId() === i.getId());
    if (found === null) {
      this.items.push(item);
    }
  }

  createItem(type: string): ListItemModel<any> {
    const item = createListItem(type);
    item.setParent(this);
    this.items.push(item);
    return item;
  }

  removeItem(item: ListItemModel<any> | string): void {
    const newItems: ListItemModel<any>[] = [];
    const id =
      typeof item === 'string'
        ? (item as string)
        : (item as ListItemModel<any>).getId();
    this.items.forEach((e) => {
      if (e.getId() !== id) {
        newItems.push(e);
      }
    });
    this.items = newItems;
  }

  size(): number {
    return this.items.length;
  }

  isInPortEnabled(): boolean {
    return this.inPortEnabled;
  }

  isOutPortEnabled(): boolean {
    return this.outPortEnabled;
  }

  setInPortEnabled(enabled: boolean): void {
    this.inPortEnabled = enabled;
  }

  setOutPortEnabled(enabled: boolean): void {
    this.outPortEnabled = enabled;
  }

  getInPort(): PortModel | undefined {
    return this.inPort;
  }

  setInPort(inPort?: PortModel): void {
    this.inPort = inPort;
    this.inPortEnabled = true;
  }

  getOutPort(): PortModel | undefined {
    return this.outPort;
  }

  setOutPort(outPort?: PortModel): void {
    this.outPort = outPort;
    this.outPortEnabled = true;
  }

  doClone(lookupTable: {}, clone: any): void {
    super.doClone(lookupTable, clone);
    clone.inPortEnabled = this.inPortEnabled;
    clone.outPortEnabled = this.outPortEnabled;
    clone.items = [];

    _forEach(this.items, (item) => {
      clone.addItem(item.clone(lookupTable));
    });
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.inPortEnabled = event.data.inPortEnabled;
    this.outPortEnabled = event.data.outPortEnabled;
    if (event.data.inPort) {
      this.inPort = this.getPortFromID(event.data.inPortID) || undefined;
    }
    if (event.data.outPort) {
      this.outPort = this.getPortFromID(event.data.outPortID) || undefined;
    }
    
    _forEach(event.data.items, (item: any) => {
      let newItem = createListItem(item.type);
      const itemEvent: DeserializeEvent<ListItemModel<any>> = {
         engine: event.engine,
         registerModel: event.registerModel,
         getModel: event.getModel,
         data: item,
      };
      newItem.deserialize(itemEvent);
      this.addItem(newItem);
    });
  }

  serialize() {
    return {
      ...super.serialize(),
      inPortEnabled: this.inPortEnabled,
      outPortEnabled: this.outPortEnabled,
      inPortID: this.inPort?.getID(),
      outPortID: this.outPort?.getID(),
      items: _map(this.items, (item) => {
        return item.serialize();
      }),
    };
  }
}
