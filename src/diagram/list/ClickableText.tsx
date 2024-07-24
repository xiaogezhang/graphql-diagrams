/**
 * Currently only support these kinds of target. NODE is the id of a node model in the canvas. 
 * Each model in the diagram has one unique ID.
 */
export enum TargetType {
  URI = 'uri',
  NODE = 'node',
  HTML_ID = 'html_id',
  SCHEMA = 'schema',
}

/* enum GraphQLDiagramElementType
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
*/

export interface ClickableTarget {
  type: TargetType | string;
  value: string;
}

/**
 * The background color is actually by its parent due to margin, padding etc. 
 */
export interface ClickableText {
  label?: string;
  color?: string,
  backgroundColor?: string,
  target?: ClickableTarget;
}
