import React from 'react';

import {useGraphQLTypeGraph} from './graphql/GraphQLTypeGraph';
import Canvas from './Canvas';
import styled from '@emotion/styled';
import DiagramContext, {DiagramOptions, HiddenDisplayOptions, createDiagramOptions} from './DiagramContext';
import {
  PluralDisplayLabelsMap,
} from './graphql/GraphQLNodeTypes';

namespace Styled {
  export const Float = styled.div`
    position: absolute;
    bottom: 20px;
    left: 20px;
    padding-top: 8px;
    padding-bottom: 8px;
    flex-direction: row;
    background: Silver;
    opacity: 0.9;
    border-radius: 8px;
    max-width: 40%;
  `;

  export const Checkbox = styled.input`
    margin-right: 4px;
  `;

  export const Label = styled.label`
    padding: 12px;
    display: flex;
    flex-direction: row;
    white-space: nowrap;
  `;
}

export default function SchemaDiagram(props: {
  sdl?: string;
  displayOptions?: HiddenDisplayOptions;
}) {
  const {sdl, displayOptions} = props;
  const [diagramOptions, setDiagramOptions] = React.useState<DiagramOptions>(
    createDiagramOptions(displayOptions),
  );
  const {engine, nodeCount} = useGraphQLTypeGraph(sdl);
  const optionKeys = displayOptions ? Object.keys(displayOptions) : null;
  const options = optionKeys && optionKeys.length > 0? 
    <Styled.Float>
    {
      optionKeys.map((t, index) => (
        <Styled.Label key={index}>
          <Styled.Checkbox
            id={t}
            type="checkbox"
            color="primary"
            checked={diagramOptions.isVisible(t)}
            onChange={() => {
              const newDisplayOptions: HiddenDisplayOptions = {};
              optionKeys.forEach(k => {
                if (k === t) {
                  newDisplayOptions[k] = diagramOptions.isVisible(k);
                } else {
                  newDisplayOptions[k] = !diagramOptions.isVisible(k);
                }
              });
              setDiagramOptions(createDiagramOptions(newDisplayOptions)); 
            }}
          />
          Show {PluralDisplayLabelsMap.get(t)}
        </Styled.Label>
      ))
    }
    </Styled.Float>
    : null;
  return (
    <DiagramContext.Provider value={diagramOptions}>
    {
      engine ? (
      <>
        <Canvas
          engine={engine}
          columns={nodeCount ?? 4}
          nodeWidth={150}
          rows={nodeCount ?? 4}
          nodeHeight={150}
        />
        {options}
      </>
    ) : null}
    </DiagramContext.Provider>
  );
}
