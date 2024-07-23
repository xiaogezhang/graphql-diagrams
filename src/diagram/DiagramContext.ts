import {createContext} from 'react';
import {ClickableTarget} from './list/ClickableText';
import {DiagramEngine} from '@projectstorm/react-diagrams';
import { GraphQLDiagramElementType } from './graphql/GraphQLNodeTypes';

/**
 * The type of elements to hide in the diagram. 
 * True means hide, so default is not to hide.
 */
export interface HiddenDisplayOptions {
  [index: string]: boolean;
}

/**
 * Contains a list of element types to hide, and a function
 * to check if an element type is visible.
 */
export type DisplayOptions = {
  hiddenDisplayOptions: HiddenDisplayOptions;
  isVisible: (elementType: string) => boolean;
};

/**
 * Actions for clickable texts. This is passed in to diagram elements
 * in context, so the diagram elements don't have to worry about how to 
 * handle it.
 */
export type ActionOptions = {
  click: (
    context: DiagramContextType,
    target: ClickableTarget,
    element?: HTMLElement | null,
  ) => Promise<void>;
};

/**
 * The data type passed in through diagram context
 */
export type DiagramContextType = ActionOptions & DisplayOptions & {
  engine?: DiagramEngine;
};

/**
 * Create a context data value with given options.
 * 
 * @param displayOptions element types to hide
 * @param actionOptions action callbacks
 * @param engine diagram engine
 * @returns 
 */
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

/**
 * Set the given element type to show or hide
 * 
 * @param context 
 * @param option 
 * @param hidden 
 * @returns 
 */
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

/**
 * To show the given type.
 * 
 * @param context 
 * @param option 
 * @returns 
 */
export function showDisplayOption(
  context: DiagramContextType,
  option: string,
): DiagramContextType {
  return setDisplayOption(context, option, false);
}

/**
 * To hide the given type.
 * @param context 
 * @param option 
 * @returns 
 */
export function hideDisplayOption(
  context: DiagramContextType,
  option: string,
): DiagramContextType {
  return setDisplayOption(context, option, true);
}

/**
 * Toggle the visibility of a given type. If it visible, hide it; 
 * if it's hidden, make it show.
 * 
 * @param context 
 * @param option 
 * @returns 
 */
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
