import {createContext} from 'react';

export interface TypeGraphOptions {
  showMetaLinks?: boolean;
  showInheritanceLinks?: boolean;
  showInputObjectTypes?: boolean;
}

export const defaultTypeGraphOptions: TypeGraphOptions = {
  showMetaLinks: false,
  showInheritanceLinks: false,
  showInputObjectTypes: false,
};

/**
 * Context for schema diagram to use within the canvas. Such as display options etc. 
 */
const GraphQLDiagramContext = createContext(defaultTypeGraphOptions);

export default GraphQLDiagramContext;
