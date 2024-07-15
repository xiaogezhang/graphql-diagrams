import { DiagramModel, DiagramModelGenerics } from '@projectstorm/react-diagrams';
import {createContext} from 'react';

// Context to hold diagram model object and some other things for use within the canvas
const CanvasContext = createContext<{ 
    scrollCanvas: (x: number, y: number) => void; 
    canvasModel: DiagramModel<DiagramModelGenerics>; 
} | null>(null);

export default CanvasContext;
