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

export interface ClickableTarget {
  type: TargetType;
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
