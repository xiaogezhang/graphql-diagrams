import * as React from 'react';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';
import {ClickableText, TargetType} from './ClickableText';
import CanvasContext from '../CanvasContext';
import { getTextColor } from '../utils/color';
import { ListNodeModel } from '../node/ListNodeModel';
import DiagramContext from '../DiagramContext';

namespace Styled {
  export const Text = styled.div<{color?: string}>`
    flex-grow: 1;
    display: flex;
    margin-top: 1px;
    color: ${(p) => p.color ?? 'White'};
  `;

  export const ClickableText = styled.div<{color: string; hoverColor: string}>`
    flex-grow: 1;
    display: flex;
    margin-top: 1px;
    &:hover {
      cursor: pointer;
      color: ${(p) => p.hoverColor};
    }
    color: ${(p) => p.color};
  `;
}

export function scrollToElement(id: string): void {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center',
    });
  }
}

export interface ClickableTextProps {
  content: ClickableText;
  onClick?: () => void;
}

export function ClickableTextWidget(props: ClickableTextProps) {
  const {content, onClick} = props;
  const label = content?.label;
  const target = content?.target;
  const color = content?.color;
  const backgroundColor = content?.backgroundColor;
  const colorToUse = getTextColor(!!target, color, backgroundColor);
  const {isVisible} = React.useContext(DiagramContext);
  const canvas = React.useContext(CanvasContext);
  if (!label || !target) {
    return <Styled.Text color={colorToUse}>{label}</Styled.Text>;
  }
  const onClickEvent = target
    ? (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
        if (target.type === TargetType.NODE) {
          // The following scrollToElement() method is messing up the internal offset of the canvas, 
          // so choose different approach
          // scrollToElement(target.value);            
          const targetNode = canvas?.canvasModel.getNode(target.value);
          if (targetNode) {
            if (targetNode instanceof ListNodeModel) {
              // target node is not visible
              if (!targetNode.isVisible(isVisible)){
                return;
              }
            }
            targetNode.setSelected();
            const x = targetNode.getX();
            const y = targetNode.getY();
            if (canvas) {
              canvas?.scrollCanvas(x, y);
            }
          }
        }
      }
    : undefined;
  const tinyColor = backgroundColor ? tinycolor(backgroundColor) : null;
  const hoverColor =
    tinyColor && tinyColor.isLight() ? 'RoyalBlue' : 'LightSkyBlue';
  return (
    <Styled.ClickableText
      color={colorToUse}
      hoverColor={hoverColor}
      onClick={onClickEvent}>
      {label}
    </Styled.ClickableText>
  );
}
