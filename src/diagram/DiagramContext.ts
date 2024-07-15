import {createContext} from 'react';

export interface HiddenDisplayOptions {
  [index: string]: boolean;
}

export interface DisplayOptions {
  isVisible: (elementType: string) => boolean;
  hide: (elementType: string) => void;
  show: (elementType: string) => void;
}

export function createDiagramOptions(
  displayOptions?: HiddenDisplayOptions,
): DisplayOptions {
  const elementVisibilities: HiddenDisplayOptions = displayOptions ?? {};
  function isVisible(elementType: string): boolean {
    return !elementVisibilities[elementType];
  }
  function hide(elementType: string): void {
    elementVisibilities[elementType] = true;
  }
  function show(elementType: string): void {
    elementVisibilities[elementType] = false;
  }
  return {
    isVisible: isVisible,
    hide: hide,
    show: show,
  };
}

export const defaultDiagramOptions: DisplayOptions = createDiagramOptions();

/**
 * Context for schema diagram to use within the canvas. Such as display options etc.
 */
const DiagramContext = createContext(defaultDiagramOptions);

export default DiagramContext;
