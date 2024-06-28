import * as React from 'react';
import {BaseEntity, DeserializeEvent} from '@projectstorm/react-diagrams';
import styled from '@emotion/styled';
import {ListItemModel} from './ListItemModel';
import {ClickableText } from './ClickableText';
import {ClickableTextWidget} from './ClickableTextWidget';

namespace S {
  export const Row = styled.div`
    display: flex;
    margin-top: 1px;
    margin-bottom: 1px;
    padding: 0 5px;
    align-items: flex-start;
    width: 100%;
    flex-direction: row;
  `;

  export const Left = styled.div`
    padding: 0 0;
    flex-grow: 1;
    display: flex;
    margin-top: 1px;
    align-self: flex-start;
  `;

  export const Right = styled.div`
    padding: 0 5px;
    flex-grow: 1;
    display: flex;
    margin-left: 8px;
    margin-top: 1px;
    align-self: flex-end;
  `;
}

export const LeftAndRightListItemType: string = 'LeftAndRightListItem';

export type LeftAndRight = {
  left?: ClickableText;
  right?: ClickableText;
};

export class LeftAndRightListItem extends ListItemModel<LeftAndRight> {
  private backgroundColor?: string;

  constructor(content?: LeftAndRight, backgroundColor?: string) {
    super(LeftAndRightListItemType);
    this.content = content;
    this.backgroundColor = backgroundColor;
  }

  serializeContent(): any {
    return this.content;
  }

  deserializeContent(
    event: DeserializeEvent<BaseEntity>,
    data: any,
  ): LeftAndRight {
    return data as LeftAndRight;
  }

  renderContent(): JSX.Element {
    const left = this.content?.left;
    const right = this.content?.right;
    const onClick = () => this.unselectNode();
    return (
      <S.Row>
        {left && (
          <S.Left>
            <ClickableTextWidget content={left} onClick={onClick} />
          </S.Left>
        )}
        {right && (
          <S.Right>
            <ClickableTextWidget content={right} onClick={onClick} />
          </S.Right>
        )}
      </S.Row>
    );
  }

  doClone(lookupTable: {}, clone: any): void {
    super.doClone(lookupTable, clone);
    clone.backgroundColor = this.backgroundColor;
  }

  serialize() {
    return {
      ...super.serialize(),
      backgroundColor: this.backgroundColor,
    };
  }

  deserialize(event: DeserializeEvent<this>) {
    super.deserialize(event);
    this.backgroundColor = event.data.backgroundColor;
  }

  getBackgroundColor(): string | undefined {
    return this.backgroundColor;
  }
}
