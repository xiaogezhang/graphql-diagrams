import {createContext} from 'react';
import {ClickableTarget} from './list/ClickableText';
import { DiagramEngine } from '@projectstorm/react-diagrams';

export interface HiddenDisplayOptions {
  [index: string]: boolean;
}

export type DisplayOptions = {
  hiddenDisplayOptions: HiddenDisplayOptions;
  isVisible: (elementType: string) => boolean;
};

export type ActionOptions = {
  click: (context: DiagramContextType, target: ClickableTarget) => void;
};

export type DiagramContextType = ActionOptions & DisplayOptions & {
  engine?: DiagramEngine;
  start: number;
};

export function createDiagramContext(
  displayOptions?: HiddenDisplayOptions,
  actionOptions?: ActionOptions,
  engine?: DiagramEngine,
): DiagramContextType {
  const elementVisibilities: HiddenDisplayOptions = displayOptions ?? {};
  function isVisible(elementType: string): boolean {
    return !elementVisibilities[elementType];
  }
  const actions: ActionOptions = actionOptions || {
    click: (_c: DiagramContextType, _t: ClickableTarget) => void {},
  };
  const start = Date.now();
  return {
    hiddenDisplayOptions: elementVisibilities,
    isVisible: isVisible,
    ...actions,
    engine: engine,
    start: start,
  };
}

export function setDisplayOption(
  context: DiagramContextType,
  option: string,
  hidden: boolean,
): DiagramContextType {
  const {hiddenDisplayOptions} = context;
  hiddenDisplayOptions[option] = hidden;
  const start = Date.now();
  return {
    ...context,
    hiddenDisplayOptions: hiddenDisplayOptions,
    start: start,
  };
}

export function showDisplayOption(
  context: DiagramContextType,
  option: string,
): DiagramContextType {
  return setDisplayOption(context, option, false);
}

export function hideDisplayOption(
  context: DiagramContextType,
  option: string,
): DiagramContextType {
  return setDisplayOption(context, option, true);
}

export function toggleDisplayOption(
  context: DiagramContextType,
  option: string,
): DiagramContextType {
  const {hiddenDisplayOptions} = context;
  hiddenDisplayOptions[option] = !hiddenDisplayOptions[option];
  const start = Date.now();
  return {
    ...context,
    hiddenDisplayOptions: hiddenDisplayOptions,
    start: start,
  };
}

/**
 * Context for schema diagram to use within the canvas. Includes:
 * 1. display options: the types of diagram elements to show/hide
 * 2. action options: the actions for different type of targets
 * 3. engine: the engine for the diagram, which contains the model.
 */
const DiagramContext = createContext<DiagramContextType>(createDiagramContext());

export default DiagramContext;
