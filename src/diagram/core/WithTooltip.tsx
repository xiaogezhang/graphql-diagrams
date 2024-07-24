import React from 'react';
import styled from '@emotion/styled';

namespace Styled {
  export const Component = styled.div`
    width: fit-content;
    &:hover {
      span {
        visibility: visible;
      }
    }
  `;

  export const Tooltip = styled.span<{
    backgroundColor?: string;
  }>`
    visibility: hidden;
    font-size: 16px;
    background-color: ${(p) => p.backgroundColor ?? 'white'};
    color: #333;
    text-align: center;
    border-radius: 6px;
    padding: 4px;
    padding-left: 8px;
    padding-right: 8px;
    font-size: 14px;
    box-shadow: 2px 2px 1px silver;

    /* Position the tooltip */
    position: absolute;
    margin-top: 8px;
    margin-left: 0px;
    z-index: 100;
  `;
}

export default function WithTooltip(
  props: React.PropsWithChildren<{
    title: string;
    backgroundColor?: string;
  }>,
) {
  const {title, backgroundColor, children} = props;
  return (
    <Styled.Component>
      {children}
      <Styled.Tooltip backgroundColor={backgroundColor}>{title}</Styled.Tooltip>
    </Styled.Component>
  );
}
