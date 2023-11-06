import React from "react";
import styled from 'styled-components'

const ButtonStyled = styled.button`
  all: unset;
  background-color: #45a2fa;
  color: #fefefe;
  padding: 6px 24px;
  border-radius: 8px;
  transition: 200ms;
  ${props => props.css}

  :hover {
    background-color: #0058aa;
  }
  
`

function Button ({children, type, onClick, css}) {

  return (
    <ButtonStyled
      css={css}
      type={type || 'button'}
      onClick={onClick}
    >
      {children}
    </ButtonStyled>
  )

}

export {Button}
export default Button