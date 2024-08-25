import styled from 'styled-components';

export const Form = styled.form`
  background-color: #f4f4f4;
  padding: 1.2rem;
  border-radius: 0.6rem;
`;

export const FormHeader = styled.div`
  background-color: #115E59;
  color: #fff;
  font-weight: bold;
  border-bottom: 2px solid #000;
  border-radius: 0.25rem 0.25rem 0 0;
  padding: 1rem;
  font-size: 1.5rem;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover {
    background-color: #e2e8f0;
    color: #115E59;
    cursor: pointer;
  }
`;

export const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.4rem;
  font-weight: bold;
  color: ${props => props.onInvalid ? 'red' : 'black'};
`;

export const FormInput = styled.input`
  width: 100%;
  padding: 0.8rem;
  border: 0.2rem solid #ccc;
  border-radius: 0.2rem;
  margin-bottom: 0.4rem;
`;

export const FormButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px;
  margin-top: 10px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    opacity: 0.5;
  }
  &:enabled {
    opacity: 1.0;
  }
  opacity: ${props => !props.disabled ? 1 : 0.5};
`;

export const FormAlert = styled.div`
  padding: 10px;
  background-color: #f44336;
  color: white;
  margin-top: 10px;
  border-radius: 5px;
`;

export const FormDateInput = styled.input.attrs({ type: 'date' })`
  padding: 10px;
  font-size: 1.4em;
  border: 2px solid #156458;
  border-radius: 5px;
  color: #156458;
  background-color: #f9f9f9;
  cursor: pointer;

  // Custom styles for date picker
  &::-webkit-calendar-picker-indicator {
    color: #156458;
    cursor: pointer;
  }

  &:focus {
    outline: none;
    border-color: #0e423b;
  }

  &:hover {
    background-color: #e0f2f1;
  }
`;

export const FormContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;

  // Media query for small screens
  @media (max-width: 768px) {
    flex-direction: column;
  }
`
