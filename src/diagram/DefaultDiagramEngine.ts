// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  AbstractModelFactory,
  CanvasEngineOptions,
  DefaultLabelFactory,
  DefaultLinkFactory,
  DefaultNodeFactory,
  DefaultPortFactory,
  DiagramEngine,
  FactoryBank,
  LinkLayerFactory,
  NodeLayerFactory,
  PathFindingLinkFactory,
  SelectionBoxLayerFactory,
} from '@projectstorm/react-diagrams';
import {ListItemModel, ListItemModelGenerics} from './list/ListItemModel';
import { ListNodeFactory } from './node/ListNodeFactory';
import { LeftAndRightListItemFactory, SimpleTextListItemFactory } from './list/ItemFactory';
import { DefaultDiagramState } from './states/DefaultDiagramState';

export class DefaultDiagramEngine extends DiagramEngine {
  protected itemFactories: FactoryBank<
    AbstractModelFactory<
      ListItemModel<any, ListItemModelGenerics>,
      DiagramEngine
    >
  >;

  constructor(options: CanvasEngineOptions = {}) {
    super(options);
    this.itemFactories = new FactoryBank();
    this.itemFactories.registerListener({
      factoryAdded: (event) => {
        event.factory.setDiagramEngine(this);
      },
      factoryRemoved: (event) => {
        event.factory.setDiagramEngine(null);
      },
    });
    // register model factories
    this.getLayerFactories().registerFactory(new NodeLayerFactory());
    this.getLayerFactories().registerFactory(new LinkLayerFactory());
    this.getLayerFactories().registerFactory(new SelectionBoxLayerFactory());

    this.getLabelFactories().registerFactory(new DefaultLabelFactory());
    this.getNodeFactories().registerFactory(new DefaultNodeFactory()); // i cant figure out why
    this.getLinkFactories().registerFactory(new DefaultLinkFactory());
    this.getLinkFactories().registerFactory(new PathFindingLinkFactory());
    this.getPortFactories().registerFactory(new DefaultPortFactory());

    // register the default interaction behaviours
    this.getStateMachine().pushState(new DefaultDiagramState());
    this.getNodeFactories().registerFactory(new ListNodeFactory());
    this.getItemFactories().registerFactory(new SimpleTextListItemFactory());
    this.getItemFactories().registerFactory(new LeftAndRightListItemFactory());
  }

  getItemFactories() {
    return this.itemFactories;
  }

  getFactoryForItem<
    F extends AbstractModelFactory<
      ListItemModel<any, ListItemModelGenerics>,
      DiagramEngine
    >,
  >(item: ListItemModel<any, ListItemModelGenerics>) {
    if (typeof item === 'string') {
      return this.itemFactories.getFactory<F>(item);
    }
    return this.itemFactories.getFactory<F>(item.getType());
  }
}
