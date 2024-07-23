import * as React from 'react';
import _map from 'lodash/map';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';
import {ClickableTextDict, MultiLineText} from './MultiLineTextListItem';
import {getTextColor} from '../utils/color';
import {ClickableTextWidget} from './ClickableTextWidget';

namespace Styled {
  export const Lines = styled.div`
    flex-direction: column;
    flex-grow: 1;
    display: flex;
    max-width: 350px;
    overflow: hidden;
  `;

  export const Line = styled.div`
    flex-direction: row;
    width: fit-content;
    display: flex;
  `;

  export const Text = styled.div<{color?: string}>`
    flex-grow: 1;
    display: flex;
    margin-top: 1px;
    white-space: pre;
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
    justify-content: flex-end;
  `;
}

export interface MultiLineTextProps {
  content: MultiLineText;
}

/**
 * React component to render multiple lines of text. The text may contain clickable targets
 * which are marked by place holders in the format ${var_name}. They are replaced with real 
 * values at rendering time.
 * 
 * @param props 
 * @returns 
 */
function LineComponent(props: {
  color?: string;
  line: string;
  clickabeTexts?: ClickableTextDict;
}) {
  const {color, line, clickabeTexts} = props;
  const varRe = /\${[\w]+}/g;
  let myArray;
  const segs: React.JSX.Element[] = [];
  let lastIndex = 0;
  while ((myArray = varRe.exec(line)) !== null) {
    const varName = myArray[0];
    const curIndex = varRe.lastIndex;
    if (curIndex - varName.length > lastIndex) {
      const curText = line.substring(lastIndex, curIndex - varName.length);
      segs.push(<Styled.Text key={curIndex} color={color}>{curText}</Styled.Text>);
    }
    const clickableText = clickabeTexts && clickabeTexts[varName.substring(2, varName.length - 1)];
    if (clickableText) {
      segs.push(<ClickableTextWidget key={curIndex + '_c'} content={clickableText}/>);
    }
    lastIndex = curIndex;
  }
  if (lastIndex < line.length) {
    segs.push(<Styled.Text key={lastIndex + 1} color={color}>{line.substring(lastIndex)}</Styled.Text>);
  }
  return <Styled.Line>{segs}</Styled.Line>;
}

export function MultiLineTextWidget(props: MultiLineTextProps) {
  const {content} = props;
  const rowLimit = content.initNumberOfRows ?? 20;
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const needExpandLink = rowLimit < content.content.length;
  const lines = expanded ? content.content : content.content.slice(0, rowLimit);
  const color = content.color;
  const backgroundColor = content.backgroundColor;
  const colorToUse = getTextColor(false, color, backgroundColor);
  const colorToUseForLink = getTextColor(true, color, backgroundColor);
  const tinyColor = backgroundColor ? tinycolor(backgroundColor) : null;
  const hoverColor =
    tinyColor && tinyColor.isLight() ? 'RoyalBlue' : 'LightSkyBlue';
  const linesWidget = _map(lines, (line, index) => (
    <LineComponent
      color={colorToUse}
      line={line}
      key={index}
      clickabeTexts={content.clickableTexts}
    />
  ));
  return (
    <Styled.Lines>
      {linesWidget}
      {needExpandLink && (
        <Styled.ClickableText
          color={colorToUseForLink}
          hoverColor={hoverColor}
          onClick={() => setExpanded(!expanded)}>
          {expanded ? 'Collapse' : 'Expand'}
        </Styled.ClickableText>
      )}
    </Styled.Lines>
  );
}
