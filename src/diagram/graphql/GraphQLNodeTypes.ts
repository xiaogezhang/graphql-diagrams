export enum GraphQLDiagramElementType {
  SUBGRAPH = 'SUBGRAPH',
  SCHEMA = 'SCHEMA',
  DIRECTIVE = 'DIRECTIVE',
  SCALAR_TYPE = 'SCALAR_TYPE',
  OBJECT_TYPE = 'OBJECT_TYPE',
  UNION_TYPE = 'UNION_TYPE',
  ENUM_TYPE = 'ENUM_TYPE',
  INPUT_OBJECT_TYPE = 'INPUT_OBJECT_TYPE',
  INTERFACE = 'INTERFACE',
  SUBSCRIPTION = 'SUBSCRIPTION',
  QUERY = 'QUERY',
  MUTATION = 'MUTATION',
  META = 'META',

  SCHEMA_LINK = 'SCHEMA_LINK',
  META_LINK = 'META_LINK',
  INHERITANCE_LINK = 'INHERITANCE_LINK',
  FIELD_TYPE_LINK = 'FIELD_TYPE_LINK',
  TYPE_REFERENCE_LINK = 'TYPE_REFERENCE_LINK',

  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
}

export const ColorMap = new Map<GraphQLDiagramElementType, string>([
  [GraphQLDiagramElementType.SCHEMA, 'white']
]);

export const PluralDisplayLabelsMap = new Map<string, string>([
  [GraphQLDiagramElementType.SUBGRAPH, 'Subgraphs'],
  [GraphQLDiagramElementType.SCHEMA, 'Schemas'],
  [GraphQLDiagramElementType.DIRECTIVE, 'Directives'],
  [GraphQLDiagramElementType.SCALAR_TYPE, 'Scalar Types'],
  [GraphQLDiagramElementType.OBJECT_TYPE, 'Object Types'],
  [GraphQLDiagramElementType.UNION_TYPE, 'Union Types'],
  [GraphQLDiagramElementType.ENUM_TYPE, 'Enums'],
  [GraphQLDiagramElementType.INPUT_OBJECT_TYPE, 'Input Object Types'],
  [GraphQLDiagramElementType.INTERFACE, 'Interfaces'],
  [GraphQLDiagramElementType.SUBSCRIPTION, 'Subscriptions'],
  [GraphQLDiagramElementType.QUERY, 'Queries'],
  [GraphQLDiagramElementType.MUTATION, 'Mutations'],
  [GraphQLDiagramElementType.META, 'Meta Nodes'],
  [GraphQLDiagramElementType.SCHEMA_LINK, 'Schema Links'],
  [GraphQLDiagramElementType.META_LINK, 'Meta Links'],
  [GraphQLDiagramElementType.INHERITANCE_LINK, 'Inheritances'],
  [GraphQLDiagramElementType.FIELD_TYPE_LINK, 'Field Type Links'],
  [GraphQLDiagramElementType.TYPE_REFERENCE_LINK, 'Type Reference Links'],
  [GraphQLDiagramElementType.ERROR, 'Errors'],
  [GraphQLDiagramElementType.UNKNOWN, 'Unknown'],
]);

export const DisplayLabelsMap = new Map<string, string>([
  [GraphQLDiagramElementType.SUBGRAPH, 'Subgraph'],
  [GraphQLDiagramElementType.SCHEMA, 'Schema'],
  [GraphQLDiagramElementType.DIRECTIVE, 'Directive'],
  [GraphQLDiagramElementType.SCALAR_TYPE, 'Scalar Type'],
  [GraphQLDiagramElementType.OBJECT_TYPE, 'Object Type'],
  [GraphQLDiagramElementType.UNION_TYPE, 'Union Type'],
  [GraphQLDiagramElementType.ENUM_TYPE, 'Enum'],
  [GraphQLDiagramElementType.INPUT_OBJECT_TYPE, 'Input Object Type'],
  [GraphQLDiagramElementType.INTERFACE, 'Interface'],
  [GraphQLDiagramElementType.SUBSCRIPTION, 'Subscription'],
  [GraphQLDiagramElementType.QUERY, 'Query'],
  [GraphQLDiagramElementType.MUTATION, 'Mutation'],
  [GraphQLDiagramElementType.META, 'Meta Node'],
  [GraphQLDiagramElementType.SCHEMA_LINK, 'Schema Link'],
  [GraphQLDiagramElementType.META_LINK, 'Meta Link'],
  [GraphQLDiagramElementType.INHERITANCE_LINK, 'Inheritance'],
  [GraphQLDiagramElementType.FIELD_TYPE_LINK, 'Field Type Link'],
  [GraphQLDiagramElementType.TYPE_REFERENCE_LINK, 'Type Reference Link'],
  [GraphQLDiagramElementType.ERROR, 'Error'],
  [GraphQLDiagramElementType.UNKNOWN, 'Unknown'],
]);

