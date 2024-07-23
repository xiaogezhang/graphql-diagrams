import React from 'react';
import styled from '@emotion/styled';
import {Alert, CircularProgress} from '@mui/material';

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

namespace Styled {
  export const Loading = styled.div`
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 16px;
    padding-right: 16px;
    flex-direction: row;
    align-items: center;
    column-gap: 24px;
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
    color: blue;
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
        <Styled.Button onClick={close}>
          X<Styled.Tooltip>Close</Styled.Tooltip>
        </Styled.Button>
      ) : null}
    </Styled.Loading>
  );
}

type SubgraphDimension = {
  left: number;
  top: number;
  width?: number;
  height?: number;
};

function domRectToDimension(hasSchema: boolean, useSize: boolean, rect?: DOMRect): SubgraphDimension | undefined {
  if (rect) {
    const left = hasSchema && useSize ? rect.left : rect.right + 4;
    const top = hasSchema && useSize ? rect.top : (rect.top - 100 > 0? rect.top - (hasSchema ? 125 : 0) : 0);
    return {
      left: left,
      top: top,
      width: useSize? (rect.right - rect.left) : undefined,
      height: useSize? (rect.bottom - rect.top) : undefined,
    };
  } else {
    return undefined;
  }
}

type SubgraphProps = {
  schema?: string;
  error?: string;
  subgraph?: string;
  showSchema: boolean;
  //sourceRect?: DOMRect;
  dimension?: SubgraphDimension; 
};

const ViewportComponent = React.forwardRef(function ViewportComponent(
  props: React.PropsWithChildren<{
    schema?: string;
    expanded: boolean;
    top: number;
    left: number;
    width?: number;
    height?: number;
    depth: number;
  }>,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const {schema, expanded, top, left, width, height, depth} = props;
  const widthToUse = width ? (width + 'px') : (schema ? '400px' : 'fit-content');
  const heightToUse = height ? (height + 'px') : (schema ? '400px' : 'fit-content');
  return (
    <Viewport
      ref={ref}
      backgroundColor="rgb(220, 230, 220)"
      border="3px solid rgb(200,210,200)"
      left={left}
      top={top}
      width={widthToUse}
      height={heightToUse}
      opacity={0.9}
      draggable={!expanded}
      draggableHandle=".handle"
      resizable={schema ? true : false}
      depth={depth}>
      {props.children}
    </Viewport>
  );
});

/**
 * React component for query plan. Create diagram model from Apollo query plan 
 * and create React component on the diagram model.
 */
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
        dimension: domRectToDimension(false, false, rect),
        subgraph: subgraph,
      });
      await graphqlActions
        .fetchSchema(subgraph)
        .then((sdl) => {
          setSubgraphProps((prev) => ({
            ...prev,
            schema: sdl,
            dimension: domRectToDimension(true, false, rect),
          }));
        })
        .catch((error) => {
          setSubgraphProps((prev) => ({
            ...prev,
            error: error.toString(),
            dimension: domRectToDimension(false, false, rect),
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
        updateSubgraph={setSubgraphProps}
      />
    </DiagramContext.Provider>
  ) : null;
}

function QueryPlanDiagramIntern(props: {
  subgraphProps: SubgraphProps;
  nodeCount: number;
  close: () => void;
  updateSubgraph: (props: SubgraphProps) => void;
}) {
  const {nodeCount, subgraphProps, close, updateSubgraph} = props;
  const {schema, error, subgraph, showSchema, dimension} = subgraphProps;
  const {engine} = React.useContext(DiagramContext);
  const depth = React.useContext(DepthContext);
  const [expanded, setExpanded] = React.useState<boolean>(false);
  
  const closeAction = React.useCallback(() => {
    setExpanded(false);
    close && close();
  }, [close]);
  const ref = React.useRef<HTMLDivElement | null>(null);
  const expandAction = React.useCallback(
    (e: boolean) => {
      if (ref.current) {
        const rect = ref.current.getBoundingClientRect();
        if (e) {
          updateSubgraph({
            ...subgraphProps,
            dimension: domRectToDimension(true, true, rect),
          });
        }
      }
      setExpanded(e);
    },
    [ref, subgraphProps, updateSubgraph, setExpanded],
  );

  return engine ? (
    <>
      <Canvas
        engine={engine}
        columns={nodeCount}
        nodeWidth={150}
        rows={nodeCount}
        nodeHeight={150}
      />
      {showSchema && dimension ? (
        <DepthContext.Provider value={depth + 1}>
          <ViewportComponent
            schema={schema}
            expanded={expanded}
            top={dimension.top}
            left={dimension.left}
            width={dimension.width}
            height={dimension.height}
            depth={depth}
            ref={ref}>
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
                startAsExpanded={expanded}
                expandedOpacity={0.98}
                expanded={expandAction}
                headerClassName="handle">
                <SchemaDiagram sdl={schema} showOptions={expanded} />
              </ExpandableContainer>
            ) : (
              <LoadingComponent close={closeAction} />
            )}
          </ViewportComponent>
        </DepthContext.Provider>
      ) : null}
    </>
  ) : (
    <LoadingComponent />
  );
}
