import {useEffect, useState} from 'react';

import {createTypeGraph} from './graphql/GraphQLTypeGraph';
import {sdlToSchema} from './graphql/sdlToSchema';
import Canvas from './Canvas';
import { DefaultDiagramEngine } from './DefaultDiagramEngine';

export default function SchemaDiagram(props: {sdl?: string}) {
  const {sdl} = props;
  const [currentModel, setCurrentModel] = useState<{
    engine?: DefaultDiagramEngine;
    nodeCount?: number; 
  }>({});
  useEffect(() => {
    if (sdl) {
      const engine = new DefaultDiagramEngine();
      const {schema, errors} = sdlToSchema(sdl);
      const model = createTypeGraph(errors, schema);
      const nodeCount = (Object.values(schema?.getTypeMap() ?? {}).length ?? 10) + (errors ? (errors.length + 4)  : 10);
      if (model) {
        engine.setModel(model);
      }
      setCurrentModel(_ => ({
        engine: engine,
        nodeCount: nodeCount,
      }));
    }
  }, [sdl]);

  return (
    <>
      {currentModel.engine ? (
        <Canvas
          engine={currentModel.engine}
          columns={currentModel.nodeCount ?? 4}
          nodeWidth={150}
          rows={currentModel.nodeCount ?? 4}
          nodeHeight={150}
        />
      ) : null}
    </>
  );
}
