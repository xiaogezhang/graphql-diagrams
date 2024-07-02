import React, {useCallback, useEffect, useState} from 'react';

import {createTypeGraph} from './graphql/GraphQLTypeGraph';
import {sdlToSchema} from './graphql/sdlToSchema';
import Canvas from './Canvas';
import createDefaultEngine from './core/createDefaultEngine';
import { DiagramEngine } from '@projectstorm/react-diagrams';

export default function SchemaDiagram(props: {sdl?: string}) {
  const {sdl} = props;
  const [currentModel, setCurrentModel] = useState<{
    engine?: DiagramEngine;
    nodeCount?: number; 
  }>({});
  useEffect(() => {
    if (sdl) {
      const engine = createDefaultEngine();
      const {schema, errors} = sdlToSchema(sdl);
      const model = createTypeGraph(errors, schema);
      const nodeCount = (Object.values(schema?.getTypeMap() ?? {}).length ?? 10) + (errors ? errors.length : 0);
      if (model) {
        engine.setModel(model);
      }
      setCurrentModel(prev => ({
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
