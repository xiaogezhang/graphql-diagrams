import React from 'react';
import styled from '@emotion/styled';
import tinycolor from 'tinycolor2';

import MenuIcon from '../../icons/menu.svg';
import ChevronLeftIcon from '../../icons/chevron_left.svg';
import ChevronRightIcon from '../../icons/chevron_right.svg';
import WithTooltip from '../core/WithTooltip';

namespace Styled {
  export const DocView = styled.div<{backgroundColor?: string}>`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    background-color: ${(p) => p.backgroundColor ?? 'inherit'};
  `;

  export const Body = styled.div`
    width: 100%;
    border-radius: 4px;
  `;

  export const Header = styled.div<{backgroundColor?: string}>`
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    border-radius: 4px
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    background-color: ${(p) => p.backgroundColor ?? 'inherit'};
  `;

  export const Title = styled.div`
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

  export const Name = styled.div`
    color: red;
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
      background-color: LightGray;
    }
  `;
}

export default function DocumentView(
  props: React.PropsWithChildren<{
    backgroundColor?: string;
    close?: () => void;
  }>,
) {
  const {backgroundColor, close, children} = props;
  const tc = backgroundColor ? tinycolor(backgroundColor) : undefined;
  const hb = tc ? tc.darken(25).toRgbString() : undefined;
  return (
    <Styled.DocView backgroundColor={backgroundColor}>
      <DocViewHeader backgroundColor={hb} type="Object Type" title="ListingV2" close={close} />
      <Styled.Body>Test body{children}</Styled.Body>
    </Styled.DocView>
  );
}

function DocViewHeader(props: {
  type?: string;
  title?: string;
  backgroundColor?: string;
  close?: () => void;
}) {
  const {backgroundColor, type, title, close} = props;
  return (
    <Styled.Header backgroundColor={backgroundColor}>
      <WithTooltip title="Close">
        <Styled.Button onClick={close}>
          <img width="28" height="28" src={ChevronRightIcon} alt="Close" />
        </Styled.Button>
      </WithTooltip>
      <Styled.Title>
        {type} <Styled.Name>{title}</Styled.Name>
      </Styled.Title>
    </Styled.Header>
  );
}
  