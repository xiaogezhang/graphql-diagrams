
export interface Hideable {
  isVisible(isTypeVisible: (elementType: string) => boolean): boolean;

  hide(): void;

  show(): void;
}
