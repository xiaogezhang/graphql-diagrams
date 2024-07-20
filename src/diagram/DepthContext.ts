import {createContext} from 'react';

/**
 * Context for the depth of stacked ExpandableContainers.
 * 
 * Starting from 100 to make sure the containers can stay above other 
 * components.
 */
const DepthContext = createContext<number>(100);

export default DepthContext;
