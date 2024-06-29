import React, {useCallback, useEffect, useState} from 'react';

import {DiagramModel} from '@projectstorm/react-diagrams';
import {createTypeGraph} from './graphql/GraphQLTypeGraph';
import {sdlToSchema} from './graphql/sdlToSchema';
import Canvas from './Canvas';

export default function SchemaDiagram(props: {sdl?: string}) {
  const {sdl} = props;
  const [currentModel, setCurrentModel] = useState<{
    model?: DiagramModel;
    nodeCount?: number;
  }>({});
  const generateModel = useCallback((schemaText) => {
    const {schema, errors} = schemaText
      ? sdlToSchema(schemaText)
      : {schema: undefined, errors: []};
    const model = createTypeGraph(errors, schema);
    const nodeCount =
      (Object.values(schema?.getTypeMap() ?? {}).length ?? 10) +
      (errors ? errors.length : 0);
    setCurrentModel((prevModel) => ({
      model: model,
      nodeCount: nodeCount < 10 ? 10 : nodeCount,
    }));
  }, []);
  useEffect(() => {
    generateModel(sdl);
  }, [generateModel, sdl]);

  return (
    <>
      {currentModel.model ? (
        <Canvas
          model={currentModel.model}
          columns={currentModel.nodeCount ?? 4}
          nodeWidth={150}
          rows={currentModel.nodeCount ?? 4}
          nodeHeight={150}
        />
      ) : null}
    </>
  );
}
