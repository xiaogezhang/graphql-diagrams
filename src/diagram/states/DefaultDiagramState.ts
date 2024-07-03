import {MouseEvent, TouchEvent} from 'react';
import {
  SelectingState,
  State,
  Action,
  InputType,
  ActionEvent,
} from '@projectstorm/react-canvas-core';
import { DiagramEngine, DragDiagramItemsState, DragNewLinkState, PortModel } from '@projectstorm/react-diagrams';
import { DragCanvasState } from './DragCanvasState';

export class DefaultDiagramState extends State<DiagramEngine> {
  dragCanvas: DragCanvasState;
  dragNewLink: DragNewLinkState;
  dragItems: DragDiagramItemsState;

  constructor() {
    super({
      name: 'default-diagrams',
    });
    this.childStates = [new SelectingState()];
    this.dragCanvas = new DragCanvasState();
    this.dragNewLink = new DragNewLinkState();
    this.dragItems = new DragDiagramItemsState();

    // determine what was clicked on
    this.registerAction(
      new Action({
        type: InputType.MOUSE_DOWN,
        //@ts-ignore
        fire: (event: ActionEvent<MouseEvent>) => {
          const element = this.engine
            .getActionEventBus()
            .getModelForEvent(event);

          // the canvas was clicked on, transition to the dragging canvas state
          if (!element) {
            this.transitionWithEvent(this.dragCanvas, event);
          }
          // initiate dragging a new link
          else if (element instanceof PortModel) {
            this.transitionWithEvent(this.dragNewLink, event);
          }
          // move the items (and potentially link points)
          else {
            this.transitionWithEvent(this.dragItems, event);
          }
        },
      }),
    );

    // touch drags the canvas
    this.registerAction(
      new Action({
        type: InputType.TOUCH_START,
        // @ts-ignore
        fire: (event: ActionEvent<TouchEvent>) => {
          this.transitionWithEvent(this.dragCanvas, event);
        },
      }),
    );
  }
}
