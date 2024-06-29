import {
  BaseEntity,
  BaseModel,
  BaseModelGenerics,
  BaseModelOptions,
  DeserializeEvent,
  NodeModel,
  PortModel,
} from '@projectstorm/react-diagrams';
import {Hideable} from '../core/Hideable';
import {WithInOutPorts} from '../port/WithInOutPorts';

export interface ListItemModelOptions extends BaseModelOptions {
  hidden: boolean;
  inPortEnabled: boolean;
  outPortEnabled: boolean;
}

export interface ListItemModelGenerics extends BaseModelGenerics {
  OPTIONS: ListItemModelOptions;
  PARENT: BaseModel;
}

/**
 * Model to represent an item in a list. 
 */
export abstract class ListItemModel<
    T,
    G extends ListItemModelGenerics = ListItemModelGenerics,
  >
  extends BaseModel<G>
  implements Hideable, WithInOutPorts
{
  protected content?: T;

  protected inPort?: PortModel;
  protected outPort?: PortModel;

  constructor(type: string);
  constructor(options: ListItemModelOptions | string) {
    if (typeof options === 'string') {
      options = {
        hidden: false,
        inPortEnabled: false,
        outPortEnabled: false,
        type: options,
      };
    }
    super(options);
  }

  isInPortEnabled(): boolean {
    return !!this.options.inPortEnabled;
  }

  isOutPortEnabled(): boolean {
    return !!this.options.outPortEnabled;
  }

  setInPortEnabled(enabled: boolean): void {
    this.options.inPortEnabled = enabled;
  }

  setOutPortEnabled(enabled: boolean): void {
    this.options.outPortEnabled = enabled;
  }

  getInPort(): PortModel | undefined {
    return this.inPort;
  }

  setInPort(inPort?: PortModel): void {
    this.inPort = inPort;
    this.options.inPortEnabled = true;
  }

  getOutPort(): PortModel | undefined{
    return this.outPort;
  }

  setOutPort(outPort?: PortModel): void {
    this.outPort = outPort;
    this.options.outPortEnabled = true;
  }

  isVisible(): boolean {
    return !this.options.hidden;
  }

  hide(): void {
    this.options.hidden = true;
  }

  show(): void {
    this.options.hidden = false;
  }

  getType(): string {
    return this.options.type || '';
  }

  getContent(): T | undefined {
    return this.content;
  }

  setContent(content: T): void {
    this.content = content;
  }

  getId(): string {
    return this.getID();
  }

  abstract getBackgroundColor(): string | undefined;

  abstract serializeContent(): any;
  abstract deserializeContent(
    event: DeserializeEvent<BaseEntity>,
    data: any,
  ): T;
  abstract renderContent(): JSX.Element;

  doClone(lookupTable: {}, clone: any): void {
    clone.content = this.content;
    clone.inPort = this.inPort;
    clone.outPort = this.outPort;

    super.doClone(lookupTable, clone);
  }

  serialize(): any {
    const contSer = this.serializeContent();
    const ser = {
      content: contSer,
      inPortID: this.inPort?.getID(),
      outPortID: this.outPort?.getID(),
    };
    return ser;
  }

  deserialize(event: DeserializeEvent<this>) {
    const contentData = event.data.content;
    const contDeser =
      contentData == null ? undefined : this.deserializeContent(event, contentData);
    this.content = contDeser;
    if (event.data.inPortID) {
      event.getModel(event.data.inPortID).then((model) => {
        this.inPort = model as PortModel;
      });
    }
    if (event.data.outPortID) {
      event.getModel(event.data.outPortID).then((model) => {
        this.outPort = model as PortModel;
      });
    }
  }

  unselectNode(): void {
    let curM: BaseModel = this;
    while (curM !== null && !(curM instanceof NodeModel)) {
      const cur = curM.getParent();
      if (cur instanceof NodeModel) {
        cur.setSelected(false);
        return;
      }
      if (cur === null) {
        return;
      }
      curM = cur as BaseModel;
    }
  }
}
