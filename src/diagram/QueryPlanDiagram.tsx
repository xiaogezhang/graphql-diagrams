import React, {useCallback} from 'react';
import styled from '@emotion/styled';
import {Alert, Button, CircularProgress, Tooltip} from '@mui/material';

import Canvas from './Canvas';
import {useQueryPlanGraph} from './graphql/queryPlan/QueryPlanGraph';
import GraphQLContext from './graphql/GraphQLContext';
import Viewport from './Viewport';
import DiagramContext, {DiagramContextType} from './DiagramContext';
import {ClickableTarget} from './list/ClickableText';
import DepthContext from './DepthContext';
import OutsideClickObserver from './core/hooks';
import SchemaDiagram from './SchemaDiagram';
import ExpandableContainer from './core/ExpndableContainer';
import Draggable from 'react-draggable';

namespace Styled {
  export const Loading = styled.div`
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 16px;
    flex-direction: row;
    align-items: center;
    column-gap: 20px;
  `;

  export const Header = styled.div`
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 16px;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  `;

  export const Title = styled.div`
    display: flex;
    flex-direction: row;
    font-size: 16px;
    width: max-content;
    padding: 4px;
    margin-right: 24px;
    column-gap: 16px;
  `;

  export const Name = styled.div`
    color: red;
  `;

  export const Button = styled.div`
    font-size: 16px;
    width: max-content;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
      background-color: Lime;
      span {
        visibility: visible;
      }
    }
  `;

  export const Tooltip = styled.span`
    visibility: hidden;
    background-color: white;
    color: #333;
    text-align: center;
    border-radius: 5px;
    padding: 4px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 14px;
    box-shadow: 2px 2px 1px silver;

    /* Position the tooltip */
    position: absolute;
    margin-top: 40px;
    margin-left: -20px;
    z-index: 100;
  `;
}

function LoadingComponent(props: {close?: () => void}) {
  const {close} = props;
  return (
    <Styled.Loading>
      <CircularProgress />
      {close ? (
        <Tooltip title="close">
          <Button size="medium" title="close" onClick={close}>
            X
          </Button>
        </Tooltip>
      ) : null}
    </Styled.Loading>
  );
}

type SubgraphProps = {
  schema?: string;
  error?: string;
  subgraph?: string;
  showSchema: boolean;
  sourceRect?: DOMRect;
};

export default function QueryPlanDiagram(props: {
  queryPlan?: string;
  queryStr?: string;
}) {
  const {queryPlan, queryStr} = props;
  const {engine, nodeCount} = useQueryPlanGraph(queryPlan, queryStr);
  const [subgraphProps, setSubgraphProps] = React.useState<SubgraphProps>({
    showSchema: false,
  });
  const graphqlActions = React.useContext(GraphQLContext);
  const clickAction = async (
    _: DiagramContextType,
    target?: ClickableTarget,
    elem?: HTMLElement | null,
  ) => {
    const subgraph = target?.value;
    if (subgraph) {
      const rect = elem?.getBoundingClientRect();
      setSubgraphProps({
        showSchema: true,
        sourceRect: rect,
        subgraph: subgraph,
      });
      await graphqlActions
        .fetchSchema(subgraph)
        .then((sdl) => {
          setSubgraphProps((prev) => ({
            ...prev,
            schema: sdl,
          }));
        })
        .catch((error) => {
          setSubgraphProps((prev) => ({
            ...prev,
            error: error.toString(),
          }));
        });
    }
  };
  const diagramOptions = React.useContext(DiagramContext);
  const diagramContext: DiagramContextType = {
    ...diagramOptions,
    click: clickAction,
    engine: engine,
  };
  return nodeCount ? (
    <DiagramContext.Provider value={diagramContext}>
      <QueryPlanDiagramIntern
        nodeCount={nodeCount}
        subgraphProps={subgraphProps}
        close={() =>
          setSubgraphProps((prev) => ({
            ...prev,
            showSchema: false,
          }))
        }
      />
    </DiagramContext.Provider>
  ) : null;
}

function QueryPlanDiagramIntern(props: {
  subgraphProps: SubgraphProps;
  nodeCount: number;
  sourceRect?: DOMRect;
  close: () => void;
}) {
  const {nodeCount, subgraphProps, close} = props;
  const {schema, error, subgraph, showSchema, sourceRect} = subgraphProps;
  const {engine} = React.useContext(DiagramContext);
  const depth = React.useContext(DepthContext);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const left = (sourceRect?.right ?? 0) + 4;
  const top =
    (sourceRect?.top ?? 0) - 100 > 0 ? (sourceRect?.top ?? 0) - (schema ? 125 : 0) : 0;
  const closeAction = useCallback(() => {
    setExpanded(false);
    close && close();
  }, [close]);
  return engine ? (
    <>
      <Canvas
        engine={engine}
        columns={nodeCount}
        nodeWidth={150}
        rows={nodeCount}
        nodeHeight={150}
      />
      {showSchema ? (
        <DepthContext.Provider value={depth + 1}>
          <Viewport
            backgroundColor="rgb(220, 230, 220)"
            border="3px solid rgb(200,210,200)"
            left={left + 'px'}
            top={top + 'px'}
            width={schema ? '400px' : 'fit-content'}
            height={schema ? '400px' : 'fit-content'}
            opacity={0.9}
            draggable={true}
            draggableHandle='.handle'
            resizable={schema ? true : false}
            depth={depth}>
            {error ? (
              <OutsideClickObserver
                onClickOutside={(outside: boolean) => outside && closeAction()}>
                <Alert severity="error" onClose={closeAction}>
                  {error}
                </Alert>
              </OutsideClickObserver>
            ) : schema ? (
                <ExpandableContainer
                  backgroundColor="rgb(220, 230, 220)"
                  collapseOnClickOutside={true}
                  header={
                    <Styled.Header>
                      <Styled.Title>
                        Subgraph: <Styled.Name>{subgraph}</Styled.Name>
                      </Styled.Title>
                      <Styled.Button onClick={closeAction}>
                        X<Styled.Tooltip>Close</Styled.Tooltip>
                      </Styled.Button>
                    </Styled.Header>
                  }
                  startAsExpanded={false}
                  expandedOpacity={0.9}
                  expandedPosition="fixed"
                  expandedHeight="90%"
                  expandedWidth="90%"
                  expanded={setExpanded}>
                  <SchemaDiagram sdl={schema} showOptions={expanded} />
                </ExpandableContainer>
            ) : (
              <LoadingComponent close={closeAction} />
            )}
          </Viewport>
        </DepthContext.Provider>
      ) : null}
    </>
  ) : (
    <LoadingComponent />
  );
}
