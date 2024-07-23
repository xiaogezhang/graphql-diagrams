import createEngine, {DiagramEngine} from "@projectstorm/react-diagrams";
import { ListNodeFactory } from "../node/ListNodeFactory";

/**
 * Create the default engine used for graphql diagrams. Contains factories to create 
 * type of nodes and links etc specific for the diagram.
 * 
 * @returns 
 */
export default function createDefaultEngine(): DiagramEngine {
  const engine = createEngine();
  engine.getNodeFactories().registerFactory(new ListNodeFactory());
  return engine;
}
