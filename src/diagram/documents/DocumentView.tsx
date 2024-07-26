import React from 'react';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';

import ChevronRightIcon from '../../icons/chevron_right.svg';
import FullscreenIcon from '../../icons/fullscreen.svg';
import ShrinkIcon from '../../icons/shrink.svg';
import WithTooltip from '../core/WithTooltip';

namespace Styled {
  export const DocView = styled.div<{backgroundColor?: string}>`
    display: flex;
    flex-direction: column;
    background-color: ${(p) => p.backgroundColor ?? 'inherit'};
  `;

  export const Body = styled.div`
    border-radius: 4px;
    height: 100%;
  `;

  export const Header = styled.div<{backgroundColor?: string}>`
    flex-grow: 1;
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 4px
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background-color: ${(p) => p.backgroundColor ?? 'inherit'};
  `;

  export const HeaderContent = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    flex-grow: 10;
    font-size: 16px;
    width: max-content;
    padding: 4px;
    margin-right: 24px;
    column-gap: 16px;
  `;

  export const Button = styled.div`
    flex-grow: 1;
    font-size: 16px;
    color: blue;
    max-width: fit-content;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
      background-color: rgba(0,0,0,0.1);
    }
  `;
}

export default function DocumentView(
  props: React.PropsWithChildren<{
    header?: React.JSX.Element;
    backgroundColor?: string;
    fullscreen?: boolean;
    close?: () => void;
    setFullscreen?: (_f: boolean) => void;
  }>,
) {
  const {header, backgroundColor, fullscreen, close, setFullscreen, children} = props;
  const tc = backgroundColor ? tinycolor(backgroundColor) : undefined;
  const hb = tc ? tc.darken(25).toRgbString() : undefined;
  return (
    <Styled.DocView backgroundColor={backgroundColor}>
      <DocViewHeader backgroundColor={hb} fullscreen={fullscreen} close={close} setFullscreen={setFullscreen}>
        {header}
      </DocViewHeader>
      <Styled.Body>{children}</Styled.Body>
    </Styled.DocView>
  );
}

function DocViewHeader(
  props: React.PropsWithChildren<{
    backgroundColor?: string;
    fullscreen?: boolean;
    close?: () => void;
    setFullscreen?: (_f: boolean) => void;
  }>,
) {
  const {backgroundColor, fullscreen, children, close, setFullscreen} = props;
  const fullscreenButton = setFullscreen ? (
    <WithTooltip title={fullscreen ? 'Restore' : 'Fullscreen'}>
      <Styled.Button onClick={() => setFullscreen(!fullscreen)}>
        <img width="28" height="28" src={fullscreen ? ShrinkIcon : FullscreenIcon} alt="Close" />
      </Styled.Button>
    </WithTooltip>
  ) : null;
  return (
    <Styled.Header backgroundColor={backgroundColor}>
      {fullscreenButton}
      <WithTooltip title="Close">
        <Styled.Button onClick={close}>
          <img width="28" height="28" src={ChevronRightIcon} alt="Close" />
        </Styled.Button>
      </WithTooltip>
      <Styled.HeaderContent>{children}</Styled.HeaderContent>
    </Styled.Header>
  );
}
  