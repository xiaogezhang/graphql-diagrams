import createEngine, {DiagramEngine} from "@projectstorm/react-diagrams";
import { ListNodeFactory } from "../node/ListNodeFactory";

export default function createDefaultEngine(): DiagramEngine {
  const engine = createEngine();
  engine.getNodeFactories().registerFactory(new ListNodeFactory());
  return engine;
}
