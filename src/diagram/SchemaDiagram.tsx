import React, {useCallback, useEffect, useState} from 'react';
import styled from '@emotion/styled';

import {DiagramModel} from '@projectstorm/react-diagrams';
import {createTypeGraph} from './graphql/GraphQLTypeGraph';
import {sdlToSchema} from './graphql/sdlToSchema';
import Canvas from './Canvas';

namespace S {
  export const Files = styled.div`
    top: 12px;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-direction: row;
    flow-wrap: nowrap;
    background: Silver;
    opacity: 0.9;
    border-radius: 8px;
    width: fit-content;
  `;

  export const Checkbox = styled.input`
    margin-right: 4px;
  `;

  export const Label = styled.label`
    padding: 12px;
  `;
}

export default function SchemaDiagram(props: {sdl?: string}) {
  const {sdl} = props;
  const [currentModel, setCurrentModel] = useState<{
    model?: DiagramModel;
    nodeCount?: number;
  }>({});
  const generateModel = useCallback((schemaText) => {
    const {schema, errors} = schemaText
      ? sdlToSchema(schemaText)
      : {schema: null, errors: []};
    const model = schema? createTypeGraph(schema, errors) : undefined;
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
