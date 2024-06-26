import { DiagramModel, DiagramModelGenerics } from '@projectstorm/react-diagrams';
import {createContext} from 'react';

const CanvasContext = createContext<{ 
    scrollCanvas: (x: number, y: number) => void; 
    canvasModel: DiagramModel<DiagramModelGenerics>; 
} | null>(null);

export default CanvasContext;
