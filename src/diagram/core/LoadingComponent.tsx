import React from 'react';
import styled from '@emotion/styled';
import { CircularProgress } from '@mui/material';
import CloseIcon from '../../icons/close.svg';
import WithTooltip from './WithTooltip';

namespace Styled {
  export const Loading = styled.div`
    display: flex;
    padding-top: 4px;
    padding-bottom: 4px;
    padding-left: 16px;
    padding-right: 16px;
    flex-direction: row;
    align-items: center;
    column-gap: 24px;
  `;

  export const Button = styled.div`
    font-size: 16px;
    color: blue;
    width: max-content;
    padding: 4px;
    border-radius: 4px;
    &:hover {
      cursor: pointer;
      background-color: LightGray;
    }
  `;

}

export default function LoadingComponent(props: {
  close?: () => void;
}) {
  const {close} = props;
  return <Styled.Loading>
    <CircularProgress size={24} />
      {
        close ? (
          <WithTooltip title="Close">
            <Styled.Button onClick={close}>
              <img width="28" height="28" src={CloseIcon} alt="Close" />
            </Styled.Button>
          </WithTooltip>
        ) : null
      }
  </Styled.Loading>;
}