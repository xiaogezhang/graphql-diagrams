import React, { useState } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { ExpandableContainer, QueryPlanDiagram, SchemaDiagram } from 'graphql-diagrams';

function TwoTabs(props: {
  left: React.JSX.Element;
  right: React.JSX.Element;
}) {
  const [activeTab, setActiveTab] = useState<number>(0);
  return <>  
      <Tabs
        value={activeTab}
        onChange={(_, newTab) => setActiveTab(newTab)}
        sx={{marginTop: '50px', borderRight: 1, borderColor: 'divider' }}
      >
        <Tab label="Diagram"/>
        <Tab label="Text"/>
      </Tabs>
      {activeTab === 0 && props.left}
      {activeTab === 1 && props.right}
    </>;
}

function ExpandableDiagram(props: React.PropsWithChildren<{
  header?: React.JSX.Element;
}>) {
  return <ExpandableContainer 
    backgroundColor="rgb(240, 240, 240)"
    collapseOnClickOutside={true}
    header={props.header}
    startAsExpanded={false} 
    expandedOpacity={0.9} 
    expandedPosition="fixed" 
    expandedHeight="95%" 
    expandedWidth="95%">{props.children}
  </ExpandableContainer>;
}

export default function App() {
  const [schema, setSchema] = React.useState<string>();
  const [queryPlan, setQueryPlan] = React.useState<string>();
  const [queryStr, setQueryStr] = React.useState<string>();
  const [activeTab, setActiveTab] = React.useState<number>(0);

  const schemaUrl: string = './schemas/sample_schema_1.graphqls'; 
  const queryPlanUrl: string = './queryPlans/sample_query_plan_1.json'; 
  const queryStrUrl: string = './queryPlans/sample_query_1.graphql';

  React.useEffect(() => {
    async function fetchData() {
      if (activeTab === 1) {
        if (!schema) {
          await fetch(schemaUrl)
            .then(result => result.text())
            .then(sdl => setSchema(sdl));        
        }
      } else if (activeTab === 2) {
        if (!queryPlan) {
          await fetch(queryPlanUrl)
          .then(result => result.text())
          .then(plan => setQueryPlan(plan)); 
        }
        if (!queryStr) {
          await fetch(queryStrUrl)
          .then(result => result.text())
          .then(query => setQueryStr(query)); 
        }
      }
    }
    fetchData();
  }, [activeTab, queryPlan, queryStr, schema]);

  return (
    <Box width={window.innerWidth - 100} height={window.innerHeight - 20} gap={2} overflow='hidden' 
      sx={{justifyContent: 'flex-start', flexGrow: 1, display: 'flex'}}>
      <div className="tabs">
        <Tabs
          orientation="vertical"
          value={activeTab}
          onChange={(_, newTab) => setActiveTab(newTab)}
          sx={{marginTop: '50px', borderRight: 1, borderColor: 'divider' }}
        >
          <Tab label="Home"/>
          <Tab label="Schema"/>
          <Tab label="Query Plan"/>
        </Tabs>
      </div>
      <Box width="100%" overflow='hidden' sx={{justifyContent: 'space-between', flexGrow: 1, display: 'flex'}}>
        <div hidden={activeTab !== 0} id="vertical-tabpanel-0">
          <div className="home">
            <div>
              <a href="https://vitejs.dev" target="_blank">
                <img src={viteLogo} className="logo" alt="Vite logo" />
              </a>
              <a href="https://react.dev" target="_blank">
                <img src={reactLogo} className="logo react" alt="React logo" />
              </a>
           </div>
            <h2>GraphQL Diagrams Demo (Vite + React)</h2><br></br>
           <div className="intro">
           <div>This is a demo created with GraphQL Diagrams library using <a href="https://vitejs.dev" target="_blank">Vite</a>.</div>
           <div>Sample schema file, sample query file and sample query plan file are loaded from server. </div>
           <div>GitHub: <a href="https://github.com/xiaogezhang/graphql-diagrams" target="_blank">https://github.com/xiaogezhang/graphql-diagrams</a></div>
           <div>To Install: "yarn add graphql-diagrams" or "npm i graphql-diagrams" </div>
           <div>To run the demo, enter folder graphql-diagrams-demo, run: "yarn && yarn build && yarn dev", 
                and open url: <a href="http://localhost:5173" target="_blank"> http://localhost:5173 </a></div>
           </div>
         </div>
       </div>
       <div hidden={activeTab !== 1} id="vertical-tabpanel-1">
         {
          schema? 
            <TwoTabs 
              left={
                <ExpandableDiagram 
                  header={<a href="https://graphql.org/learn/schema/" rel="noopener" target="_blank">
                    Doc: GraphQL Schema
                  </a>}>
                  <SchemaDiagram sdl={schema} showOptions={true}/>
                </ExpandableDiagram>} 
              right={<div className="code">{schema}</div>}/> : <CircularProgress />
         }
       </div> 
       <div hidden={activeTab !== 2} id="vertical-tabpanel-2">
         {
          queryPlan? 
            <TwoTabs 
              left={
                <ExpandableDiagram 
                  header={<a href="https://www.apollographql.com/docs/federation/query-plans/" rel="noopener" target="_blank">
                    Doc: Apollo Query Plan
                  </a>}>
                  <QueryPlanDiagram queryPlan={queryPlan} queryStr={queryStr}/>
                </ExpandableDiagram>} 
              right={<div className="code">{queryPlan}</div>}/>
          : 
          <CircularProgress />
         }
       </div>
       </Box>
    </Box>
  )
}

