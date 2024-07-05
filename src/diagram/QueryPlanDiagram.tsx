import {useEffect, useState} from 'react';

import styled from '@emotion/styled';
import Canvas from './Canvas';
import {createQueryPlanGraph} from './graphql/queryPlan/QueryPlanGraph';
import OutsideClickObserver from './core/hooks';
import { DefaultDiagramEngine } from './DefaultDiagramEngine';

namespace Styled {
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
  const [currentModel, setCurrentModel] = useState<{
    engine?: DefaultDiagramEngine;
    expanded?: boolean;
    nodeCount?: number;
    error?: Error,
  }>({expanded: true});
  useEffect(() => {
    try {
      const engine = new DefaultDiagramEngine();
      const model = queryPlan ? createQueryPlanGraph(queryPlan, queryStr) : null;
      if (model) {
        engine.setModel(model);
      }
      const nodes = model?.getNodes();
      const nodeCount = (nodes?.length ?? 0) / 4 < 50 ? 50 : (nodes?.length ?? 0) / 4; 
      setCurrentModel(prev => ({
        engine: engine,
        nodeCount: nodeCount,
        expanded: prev.expanded,
      }));
    } catch (e) {
      setCurrentModel(prev => ({
        expanded: prev.expanded,
        error: e instanceof Error? e : undefined,
      }));
    }
  }, [queryPlan, queryStr]);

  return currentModel.engine ? (
    <OutsideClickObserver
      onClickOutside={(outside) => outside && setCurrentModel({
        engine: currentModel.engine, 
        nodeCount: currentModel.nodeCount, 
        expanded: false})}>
      <Styled.Container expanded={currentModel.expanded}>
          <Styled.Header>
            {currentModel.expanded ? (
              <Styled.Button onClick={() => setCurrentModel({
                engine: currentModel.engine, 
                nodeCount: currentModel.nodeCount,
                expanded: !currentModel.expanded})}>&#9196;</Styled.Button>
             ) : (
              <Styled.Button onClick={() => setCurrentModel({
                engine: currentModel.engine, 
                nodeCount: currentModel.nodeCount,
                expanded: !currentModel.expanded})}>&#9195;</Styled.Button>
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
            engine={currentModel.engine}
            columns={currentModel.nodeCount}
            nodeWidth={150}
            rows={currentModel.nodeCount}
            nodeHeight={150}
          />
        </Styled.Container>
      </OutsideClickObserver>
    ) : ( 
      currentModel.error? <div color="red">{currentModel.error.message}</div>: <div color="green">loading</div> 
    );
}
