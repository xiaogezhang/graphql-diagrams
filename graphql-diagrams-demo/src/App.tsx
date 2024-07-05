import React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { CircularProgress } from '@mui/material';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { SchemaDiagram } from 'graphql-diagrams/dist/index';
//import { SchemaDiagram } from 'graphql-diagrams';

export default function App() {
  const [schema, setSchema] = React.useState<string>();
  const [queryPlan, setQueryPlan] = React.useState<string>();
  const [activeTab, setActiveTab] = React.useState<number>(0);

  const schemaUrl: string = './schemas/sample_schema_1.graphqls'; 
  const queryPlanUrl: string = './queryPlans/query_plan_1.json'; 

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
      }
    }
    fetchData();
  }, [activeTab, queryPlan, schema]);

  return (
    <Box width="100%" height="100%" gap={4} sx={{flexGrow: 1, display: 'flex'}}>
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
      <div className="content" role="tabpanel">
        <div hidden={activeTab !== 0} id="vertical-tabpanel-0">
          <a href="https://vitejs.dev" target="_blank">
            <img src={viteLogo} className="logo" alt="Vite logo" />
          </a>
          <a href="https://react.dev" target="_blank">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
         <h2>GraphQL Diagrams Demo (Vite + React)</h2>
       </div>
       <div hidden={activeTab !== 1} id="vertical-tabpanel-1">
         {
          schema ? <SchemaDiagram sdl={schema}/> : <CircularProgress />
         }
       </div> 
       <div hidden={activeTab !== 2} id="vertical-tabpanel-2">
         <h2>Query Plan</h2>
       </div>
      </div>
    </Box>
  )
}

