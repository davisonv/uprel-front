import React from 'react';
import styled from 'styled-components'

const FormGroup = styled.div`
    display: flex;
    flex-direction: column;
    margin: 10px 0;
    width: 100%;
`

const InputStyled = styled.input`

  padding: 12px;
  border: none;
  border-radius: 5px;
  outline: ${props => props.error ? '1px solid rgb(255, 72, 72);' : '1px solid rgb(179, 179, 179);'};
  background-color: #ececec;
  color: #2c2c2c;
  outline: 1px solid 444;

  ::placeholder {
    color: #999;
  }
`

const Error = styled.p`
  color: rgb(255, 72, 72);
  font-size: 0.75rem;
  margin-top: 8px;
`

function Input (props) {

    return (
        <FormGroup>
            <label>{props.label}</label>
            <InputStyled
                error={!!props.error}
                type={props.type}
                placeholder={props.placeHolder || null}
                {...props.register}
            />
            
            {!!props.error && (
                <Error>
                    {props.error.message}
                </Error>
            )}
        </FormGroup>
    )

}

export {Input}
export default Input