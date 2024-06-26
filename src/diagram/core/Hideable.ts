export interface Hideable {
  isVisible(): boolean;

  hide(): void;

  show(): void;
}
