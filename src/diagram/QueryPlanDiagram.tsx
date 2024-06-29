import React, {useCallback, useEffect, useState} from 'react';

import styled from '@emotion/styled';
import {
  CanvasWidget,
  DiagramEngine,
  DiagramModel,
} from '@projectstorm/react-diagrams';
import Canvas from './Canvas';
import {createQueryPlanGraph} from './graphql/queryPlan/QueryPlanGraph';
import OutsideClickObserver from './core/hooks';

namespace Styled {
  export const Canvas = styled(CanvasWidget)<{
    engine: DiagramEngine;
    rows?: number;
    columns?: number;
    nodeWidth?: number;
    nodeHeight?: number;
  }>`
    id: digram-canvas;
  `;

  export const Container = styled.div<{expanded?: boolean}>`
    position: ${(p) => (p.expanded ? 'fixed' : 'static')};
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    padding: 8px;
    opacity: 0.9;
    overflow: hidden;
    background-color: rgb(225, 225, 225);
    border-radius: 8px;
    height: ${(p) => (p.expanded ? '90%' : '800px')};
    width: ${(p) => (p.expanded ? '90%' : '800px')};
    transition: top 1s, left 1s;
    max-width: 100%;
    max-height: 100%;
    z-index: ${(p) => (p.expanded ? 100 : 0)}; 
    resize: both;
  `;

  export const Button = styled.div`
    font-size: 24px;
    width: max-content;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
      background-color: Lime;
    }
  `;

  export const Header = styled.div`
    padding-left: 16px;
    padding-top: 10px;
    display: flex;
    flex-direction: row;
    align-items: center;
  `;

  export const Link = styled.div`
    padding-left: 24px;
  `;
}

export default function QueryPlanDiagram(props: {
  queryPlan?: string;
  queryStr?: string,
}) {
  const {queryPlan, queryStr} = props;
  const [expanded, setExpanded] = useState<boolean>(true);
  const [currentModel, setCurrentModel] = useState<{
    model?: DiagramModel;
    nodeCount?: number;
  }>({});
  const [error, setError] = useState<Error | null>(null);
  const generateModel = useCallback((plan) => {
    try {
      const model = createQueryPlanGraph(plan, queryStr);
      const nodes = model.getNodes();
      const nodeCount = nodes.length / 4; 
      setCurrentModel((prevModel) => ({
        model: model,
        nodeCount: nodeCount < 50 ? 50 : nodeCount,
      }));
    } catch (e) {
      if (e instanceof Error) {
        setError(e);
      }
    }
  }, [queryStr]);
  useEffect(() => {
    generateModel(queryPlan);
  }, [generateModel, queryPlan]);
  const errorComponent = error? <div color="red">{error.message}</div> : null;
  const loadingComponent = <div color="green">loading</div>;

  return currentModel.model ? (
    <OutsideClickObserver
      onClickOutside={(outside) => outside && setExpanded(false)}>
      <Styled.Container expanded={expanded}>
        <Styled.Header>
          {expanded ? (
            <Styled.Button onClick={() => setExpanded(!expanded)}>&#9196;</Styled.Button>
          ) : (
            <Styled.Button onClick={() => setExpanded(!expanded)}>&#9195;</Styled.Button>
          )}
          <Styled.Link>
            <a
              href="https://www.apollographql.com/docs/federation/query-plans/"
              rel="noopener"
              target="_blank">
              Doc: Apollo Query Plan
            </a>
          </Styled.Link>
        </Styled.Header>
        <Canvas
          model={currentModel.model}
          columns={currentModel.nodeCount}
          nodeWidth={150}
          rows={currentModel.nodeCount}
          nodeHeight={150}
        />
      </Styled.Container>
    </OutsideClickObserver>
  ) : (
    error? errorComponent : loadingComponent
  );
}
