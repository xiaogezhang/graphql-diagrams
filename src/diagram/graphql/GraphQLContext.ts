import {createContext} from 'react';

export type GraphQLContextType = {
  fetchSchema: (subgraph: string) => Promise<string>;
  generateQueryPlan: (query: string) => Promise<string>;
};

/**
 * Context for GraphQL actions, including fetch schema, generate query plan etc.
 */
const GraphQLContext = createContext<GraphQLContextType>({
  fetchSchema: async (subgraph: string) => {throw new Error('Schema for ' + subgraph + ' not available.'); },
  generateQueryPlan: async (query: string) => {throw new Error('Unable to generate query plan for query: ' + query); },
});

export default GraphQLContext;
