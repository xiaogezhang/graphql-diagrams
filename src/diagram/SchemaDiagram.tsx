import React from 'react';

import {createTypeGraph} from './graphql/GraphQLTypeGraph';
import {sdlToSchema} from './graphql/sdlToSchema';
import Canvas from './Canvas';
import { DefaultDiagramEngine } from './DefaultDiagramEngine';
import styled from '@emotion/styled';
import { TypeGraphOptions, defaultTypeGraphOptions } from './graphql/GraphQLDiagramContext';

namespace Styled {
  export const Float = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-direction: row;
    flow-wrap: nowrap;
    background: Silver;
    opacity: 0.9;
    border-radius: 8px;
  `;

  export const Checkbox = styled.input`
    margin-right: 4px;
  `;

  export const Label = styled.label`
    padding: 12px;
  `;
}

export default function SchemaDiagram(props: {sdl?: string, showOptions?: boolean;}) {
  const {sdl, showOptions} = props;
  const [options, setOptions] = React.useState<TypeGraphOptions>(
    defaultTypeGraphOptions,
  );
  const [currentModel, setCurrentModel] = React.useState<{
    engine?: DefaultDiagramEngine;
    nodeCount?: number; 
  }>({});
  React.useEffect(() => {
    if (sdl) {
      const engine = new DefaultDiagramEngine();
      const {schema, errors} = sdlToSchema(sdl);
      const model = createTypeGraph(errors, schema, options);
      const nodeCount = (Object.values(schema?.getTypeMap() ?? {}).length ?? 10) + (errors ? (errors.length + 4)  : 10);
      if (model) {
        engine.setModel(model);
      }
      setCurrentModel(_ => ({
        engine: engine,
        nodeCount: nodeCount,
      }));
    }
  }, [sdl, options]);

  return (
    currentModel.engine ? 
      <>
        <Canvas
          engine={currentModel.engine}
          columns={currentModel.nodeCount ?? 4}
          nodeWidth={150}
          rows={currentModel.nodeCount ?? 4}
          nodeHeight={150}
        />
      
      {!showOptions ? null : (
        <Styled.Float>
          <Styled.Label>
            <Styled.Checkbox
              id="meta-links"
              type="checkbox"
              color="primary"
              checked={options.showMetaLinks}
              onChange={() =>
                setOptions({
                  showMetaLinks: !options.showMetaLinks,
                  showInheritanceLinks: options.showInheritanceLinks,
                  showInputObjectTypes: options.showInputObjectTypes,
                })
              }
            />
            Show Meta Links
          </Styled.Label>
          <Styled.Label>
            <Styled.Checkbox
              id="inheritance"
              type="checkbox"
              color="primary"
              checked={options.showInheritanceLinks}
              onChange={() =>
                setOptions({
                  showMetaLinks: options.showMetaLinks,
                  showInheritanceLinks: !options.showInheritanceLinks,
                  showInputObjectTypes: options.showInputObjectTypes,
                })
              }
            />
            Show Inheritance
          </Styled.Label>
          <Styled.Label>
            <Styled.Checkbox
              id="input-object-types"
              type="checkbox"
              color="primary"
              checked={options.showInputObjectTypes}
              onChange={() =>
                setOptions({
                  showMetaLinks: options.showMetaLinks,
                  showInheritanceLinks: options.showInheritanceLinks,
                  showInputObjectTypes: !options.showInputObjectTypes,
                })
              }
            />
            Show Input Object Types
          </Styled.Label>
        </Styled.Float>
      )}
    </> 
   : null);
}
