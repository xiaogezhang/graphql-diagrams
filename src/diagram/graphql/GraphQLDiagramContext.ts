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

const GraphQLDiagramContext = createContext(defaultTypeGraphOptions);

export default GraphQLDiagramContext;
