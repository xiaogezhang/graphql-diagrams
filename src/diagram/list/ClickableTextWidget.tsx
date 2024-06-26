import * as React from 'react';
import _map from 'lodash/map';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';
import {DiagramModel} from '@projectstorm/react-diagrams';
import {ClickableTarget, ClickableText, TargetType} from './ClickableText';
import CanvasContext from '../graphql/CanvasContext';

namespace S {
  export const Text = styled.div<{color?: string}>`
    padding: 0 5px;
    flex-grow: 1;
    display: flex;
    margin-top: 1px;
    color: ${(p) => p.color ?? 'White'};
  `;

  export const ClickableText = styled.div<{color: string; hoverColor: string}>`
    padding: 0 5px;
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

export function gotoTarget(model: DiagramModel, target: ClickableTarget): void {
  if (!model || !target) {
    return;
  }
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

function getColor(
  isLink: boolean,
  color?: string,
  backgroundColor?: string,
): string {
  if (color) {
    return color;
  }
  const defaultColor = isLink ? 'RoyalBlue' : 'White';
  if (!backgroundColor) {
    return defaultColor;
  }
  const tinyColor = tinycolor(backgroundColor);
  if (tinyColor.isLight()) {
    return isLink ? 'Blue' : 'Black';
  } else {
    return isLink ? 'DeepSkyBlue' : 'White';
  }
}

export function ClickableTextWidget(props: ClickableTextProps) {
  const {content, onClick} = props;
  const label = content?.label;
  const target = content?.target;
  const color = content?.color;
  const backgroundColor = content?.backgroundColor;
  const colorToUse = getColor(!!target, color, backgroundColor);
  const canvas = React.useContext(CanvasContext);
  if (!label || !target) {
    return <S.Text color={colorToUse}>{label}</S.Text>;
  }
  const onClickEvent = target
    ? (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (onClick) {
          onClick();
        }
        if (target.type === TargetType.NODE) {
          // scrollToElement(target.value);            
          const targetNode = canvas?.canvasModel.getNode(target.value);
          if (targetNode) {
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
    <S.ClickableText
      color={colorToUse}
      hoverColor={hoverColor}
      onClick={onClickEvent}>
      {label}
    </S.ClickableText>
  );
}
