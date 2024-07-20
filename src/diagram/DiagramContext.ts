import {createContext} from 'react';
import {ClickableTarget} from './list/ClickableText';
import {DiagramEngine} from '@projectstorm/react-diagrams';
import { GraphQLDiagramElementType } from './graphql/GraphQLNodeTypes';

export interface HiddenDisplayOptions {
  [index: string]: boolean;
}

export type DisplayOptions = {
  hiddenDisplayOptions: HiddenDisplayOptions;
  isVisible: (elementType: string) => boolean;
};

export type ActionOptions = {
  click: (
    context: DiagramContextType,
    target: ClickableTarget,
    element?: HTMLElement | null,
  ) => Promise<void>;
};

export type DiagramContextType = ActionOptions &
  DisplayOptions & {
    engine?: DiagramEngine;
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
  const actions: ActionOptions = actionOptions ?? {
    click: async (_c: DiagramContextType, _t: ClickableTarget, _e?: HTMLElement | null) => void {},
  };
  return {
    hiddenDisplayOptions: elementVisibilities,
    isVisible: isVisible,
    ...actions,
    engine: engine,
  };
}

function createDefaultDiagramContext(): DiagramContextType {
  const displayOptions: HiddenDisplayOptions = {};
  displayOptions[GraphQLDiagramElementType.META_LINK] = true;
  displayOptions[GraphQLDiagramElementType.INHERITANCE_LINK] = true;
  displayOptions[GraphQLDiagramElementType.INPUT_OBJECT_TYPE] = true;
  displayOptions[GraphQLDiagramElementType.INTERFACE] = false;
  displayOptions[GraphQLDiagramElementType.ENUM_TYPE] = false;
  displayOptions[GraphQLDiagramElementType.OBJECT_TYPE] = false;
  return createDiagramContext(displayOptions);
}

export function setDisplayOption(
  context: DiagramContextType,
  option: string,
  hidden: boolean,
): DiagramContextType {
  const {hiddenDisplayOptions} = context;
  hiddenDisplayOptions[option] = hidden;
  return {
    ...context,
    hiddenDisplayOptions: hiddenDisplayOptions,
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
  return {
    ...context,
    hiddenDisplayOptions: hiddenDisplayOptions,
  };
}

/**
 * Context for diagram to use within the canvas. Includes:
 * 1. display options: the types of diagram elements to show/hide
 * 2. action options: the actions for different type of targets
 * 3. engine: the engine for the diagram, which contains the model.
 */
const DiagramContext = createContext<DiagramContextType>(
  createDefaultDiagramContext(),
);

export default DiagramContext;
