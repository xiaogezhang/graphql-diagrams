import React, {useContext, useEffect} from 'react';

import {useGraphQLTypeGraph} from './graphql/GraphQLTypeGraph';
import Canvas from './Canvas';
import styled from '@emotion/styled';
import DiagramContext, {
  DiagramContextType,
  HiddenDisplayOptions,
  createDiagramContext,
  toggleDisplayOption,
} from './DiagramContext';
import {PluralDisplayLabelsMap} from './graphql/GraphQLNodeTypes';
import {click} from './core/clicks';

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
  showOptions?: boolean;
}) {
  const {sdl, displayOptions, showOptions} = props;
  const {engine, nodeCount} = useGraphQLTypeGraph(sdl);
  const diagramContext = useContext(DiagramContext);
  const [diagramOptions, setDiagramOptions] = React.useState<DiagramContextType | undefined>();
  useEffect(() => {
    const context = createDiagramContext(displayOptions ?? diagramContext.hiddenDisplayOptions, {click: click}, engine);
    setDiagramOptions(_ => context);
  }, [diagramContext, displayOptions, engine]);
  return diagramOptions && nodeCount ? 
    <DiagramContext.Provider value={diagramOptions}>
      <SchemaDiagramIntern 
        nodeCount={nodeCount} 
        changeDiagramContext={setDiagramOptions}
        showOptions={showOptions}
      />
    </DiagramContext.Provider> 
  : null;
}

function SchemaDiagramIntern(props: {
  nodeCount: number;
  showOptions?: boolean;
  changeDiagramContext: (context: DiagramContextType,) => void,
}) {
  const {nodeCount, showOptions, changeDiagramContext} = props;
  const context = useContext(DiagramContext);
  if (context == null) {
    return null;
  }
  const {engine, hiddenDisplayOptions} = context;
  const optionKeys = hiddenDisplayOptions
    ? Object.keys(hiddenDisplayOptions)
    : null;
  const options =
    showOptions && optionKeys && optionKeys.length > 0 ? (
      <Styled.Float>
        {optionKeys.map((t, index) => (
          <Styled.Label key={index}>
            <Styled.Checkbox
              id={t}
              type="checkbox"
              color="primary"
              checked={context.isVisible(t)}
              onChange={() => {
                changeDiagramContext(toggleDisplayOption(context, t));
              }}
            />
            Show {PluralDisplayLabelsMap.get(t)}
          </Styled.Label>
        ))}
      </Styled.Float>
    ) : null;
  return engine ? (
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
  ) : null;
}
