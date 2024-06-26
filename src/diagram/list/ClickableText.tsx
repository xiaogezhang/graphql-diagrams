import * as React from 'react';

export enum TargetType {
  URI = 'uri',
  NODE = 'node',
  HTML_ID = 'html_id',
}

export interface ClickableTarget {
  type: TargetType;
  value: string;
}

export interface ClickableText {
  label?: string;
  color?: string,
  backgroundColor?: string,
  target?: ClickableTarget;
}
