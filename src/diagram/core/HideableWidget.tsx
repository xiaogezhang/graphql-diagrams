import * as React from 'react';
import {Hideable} from './Hideable';
import DiagramContext from '../DiagramContext';
import {DiagramElement} from './DiagramElement';

export interface HideableWidgetProps {
  // Use Hideable as input to avoid wrap any other object
  component?: Hideable & DiagramElement;
}

/**
 * Wrap a widget so it can be hidden
 * Currently the hideable objects include nodes and links. 
 *
 * @param props model that is hideable
 */
export function HideableWidget(
  props: React.PropsWithChildren<HideableWidgetProps>,
) {
  const {component, children} = props;
  const {isVisible} = React.useContext(DiagramContext);
  return component && component.isVisible(isVisible)
    ? <>{children}</>
    : null;
}
