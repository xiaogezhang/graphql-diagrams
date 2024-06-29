import {createContext} from 'react';

export interface TypeGraphOptions {
  createMetaLinks?: boolean;
  createInheritanceLinks?: boolean;
  createInputObjectTypes?: boolean;
}

export const defaultTypeGraphOptions: TypeGraphOptions = {
  createMetaLinks: true,
  createInheritanceLinks: true,
  createInputObjectTypes: true,
};

/**
 * Context for schema diagram to use within the canvas. Such as display options etc. 
 */
const GraphQLDiagramContext = createContext(defaultTypeGraphOptions);

export default GraphQLDiagramContext;
