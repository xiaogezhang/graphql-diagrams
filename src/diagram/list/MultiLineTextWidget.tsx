import * as React from 'react';
import _map from 'lodash/map';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';
import CanvasContext from '../graphql/CanvasContext';
import { MultiLineText } from './MultiLineTextListItem';

namespace S {
  export const Lines = styled.div`
    flex-direction: column;
    flex-grow: 1;
    display: flex;
  `;

  export const Text = styled.div<{color?: string}>`
    padding: 0 5px;
    flex-grow: 1;
    display: flex;
    margin-top: 1px;
    white-space: pre;
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
    justify-content: flex-end;
  `;
}

export interface MultiLineTextProps {
  content: MultiLineText;
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

export function MultiLineTextWidget(props: MultiLineTextProps) {
  const {content} = props;
  const rowLimit = content.initNumberOfRows ?? 20;
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const needExpandLink = rowLimit < content.content.length;
  const lines = expanded ? content.content: content.content.slice(0, rowLimit);
  const color = content.color;
  const backgroundColor = content.backgroundColor;
  const colorToUse = getColor(false, color, backgroundColor);
  const colorToUseForLink = getColor(true, color, backgroundColor);
  const canvas = React.useContext(CanvasContext);
  const tinyColor = backgroundColor ? tinycolor(backgroundColor) : null;
  const hoverColor =
    tinyColor && tinyColor.isLight() ? 'RoyalBlue' : 'LightSkyBlue';
  const linesWidget = _map(lines, (line, index) => (
    <S.Text key={index} color={colorToUse}>{line}</S.Text>
  ));
  return (
    <S.Lines>
      {linesWidget}
      {needExpandLink && <S.ClickableText
        color={colorToUseForLink}
        hoverColor={hoverColor}
        onClick={() => setExpanded(!expanded)}>
          {expanded? 'Collapse' : 'Expand'}
        </S.ClickableText>
      }
    </S.Lines>
  );
}
