export enum GraphQLNodeType {
  SUBGRAPH,
  SCHEMA,
  DIRECTIVE,
  SCALAR_TYPE,
  OBJECT_TYPE,
  UNION_TYPE,
  INPUT_OBJECT_TYPE,
  INTERFACE, 
  SUBSCRIPTION,
  QUERY,
  MUTATION,
  META,
}

export const ColorMap = new Map<GraphQLNodeType, string>([
  [GraphQLNodeType.SCHEMA, 'white']
]);

