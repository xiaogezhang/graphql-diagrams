import {
  DefaultLinkModel,
  DefaultLinkModelOptions,
  DeserializeEvent,
  PortModel,
} from '@projectstorm/react-diagrams';
import {Hideable} from '../core/Hideable';
import {DiagramElement} from '../core/DiagramElement';
import {ListNodeModel} from '../node/ListNodeModel';

export const HideableLinkModelType: string = 'HideableLinkModel';

/**
 * Simple extension to the default link model to make it hideable.
 */
export class HideableLinkModel
  extends DefaultLinkModel
  implements DiagramElement, Hideable
{
  elementType: string = 'UNKNOWN';
  protected isHidden?: boolean;

  constructor(options: DefaultLinkModelOptions = {}) {
    super(options);
    this.options.type = HideableLinkModelType;
  }

  hide(): void {
    this.isHidden = true;
  }

  show(): void {
    this.isHidden = false;
  }

  _isNodeVisible(
    port: PortModel,
    isTypeVisible: (elementType: string) => boolean,
  ) {
    if (port === null) {
      return true;
    }
    const node = port.getNode();
    if (node instanceof ListNodeModel) {
      return node.isVisible(isTypeVisible);
    }
    return true;
  }

  isVisible(isTypeVisible: (elementType: string) => boolean): boolean {
    if (this.isHidden) {
      return false;
    }
    if (!isTypeVisible(this.elementType)) {
      return false;
    }
    // any of source node or target node is not visible, this link is also not visible
    const sourceVisible = this._isNodeVisible(this.getSourcePort(), isTypeVisible);
    if (!sourceVisible) {
      return false;
    }
    const targetVisible = this._isNodeVisible(this.getTargetPort(), isTypeVisible);
    return targetVisible;
  }

  doClone(lookupTable: {}, clone: any): void {
    super.doClone(lookupTable, clone);
    clone.isHidden = this.isHidden;
    clone.elementType = this.elementType;
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.isHidden = event.data.isHidden;
    this.elementType = event.data.elementType;
  }

  serialize() {
    return {
      ...super.serialize(),
      isHidden: this.isHidden,
      elementType: this.elementType,
    };
  }
}
