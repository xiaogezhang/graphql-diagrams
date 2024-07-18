import * as React from 'react';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';
import {ClickableText} from './ClickableText';
import {getTextColor} from '../utils/color';
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
  const context = React.useContext(DiagramContext);
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
        context.click(context, target);
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
