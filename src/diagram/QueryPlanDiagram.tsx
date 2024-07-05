import {useEffect, useState} from 'react';

import Canvas from './Canvas';
import {createQueryPlanGraph} from './graphql/queryPlan/QueryPlanGraph';
import { DefaultDiagramEngine } from './DefaultDiagramEngine';

export default function QueryPlanDiagram(props: {
  queryPlan?: string;
  queryStr?: string;
}) {
  const {queryPlan, queryStr} = props;
  const [currentModel, setCurrentModel] = useState<{
    engine?: DefaultDiagramEngine;
    nodeCount?: number;
    error?: Error,
  }>({});
  useEffect(() => {
    try {
      const engine = new DefaultDiagramEngine();
      const model = queryPlan ? createQueryPlanGraph(queryPlan, queryStr) : null;
      if (model) {
        engine.setModel(model);
      }
      const nodes = model?.getNodes();
      const nodeCount = (nodes?.length ?? 0) / 4 < 50 ? 50 : (nodes?.length ?? 0) / 4; 
      setCurrentModel(_ => ({
        engine: engine,
        nodeCount: nodeCount,
      }));
    } catch (e) {
      setCurrentModel(_ => ({
        error: e instanceof Error? e : undefined,
      }));
    }
  }, [queryPlan, queryStr]);

  return currentModel.engine ? (
      <Canvas
        engine={currentModel.engine}
        columns={currentModel.nodeCount}
        nodeWidth={150}
        rows={currentModel.nodeCount}
        nodeHeight={150}
      />
    ) : ( 
      currentModel.error? <div color="red">{currentModel.error.message}</div>: <div color="green">loading</div> 
    );
}
