import styled from 'styled-components';

export const AddNewButton = styled.button`
  margin-left: 1rem; /* mx-4 */
  margin-right: 1rem; /* mx-4 */
  margin-top: 0.5rem; /* mt-2 */
  border-radius: 0.5rem; /* rounded-lg */
  background-color: #0b3733;
  color: white; /* text-white */
  font-weight: bold; /* font-bold */
  padding: 0.5rem 1rem; /* py-2 px-4 */
  
  transition: background-color 0.3s ease-in-out; /* transition ease-in-out duration-300 */

  &:hover {
    background-color: #80cbc4;
  }
`;

export const AddNewLockedButton = styled.button`
  margin-left: 1rem; /* mx-4 */
  margin-right: 1rem; /* mx-4 */
  margin-top: 0.5rem; /* mt-2 */
  border-radius: 0.5rem; /* rounded-lg */
  background-color: #D3D3D3;
  color: gray;
  font-weight: bold; /* font-bold */
  padding: 0.5rem 1rem; /* py-2 px-4 */
  
  transition: background-color 0.3s ease-in-out; /* transition ease-in-out duration-300 */

  &:hover {
    background-color: #80cbc4;
  }
`;
