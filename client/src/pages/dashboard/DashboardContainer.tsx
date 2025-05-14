import React from 'react';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { CoverLetterType } from 'types/types';
import { UserResource } from '@clerk/types';
import { isUserPremium } from '../../utils/index';
import LockIcon from '@mui/icons-material/Lock';
import { AddNewButton, AddNewLockedButton } from 'components/Styled';

interface DashboardContainerProps {
  title?: string;
  items: CoverLetterType[];
  onAdd: (locked: boolean) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  children?: React.ReactNode;
  user?: UserResource;
}

const Container = styled.div`
  margin: 1rem; /* m-4 */
  padding-bottom: 0.5rem; /* pb-2 */
  border: 4px solid black; /* border border-4 border-black */
  border-radius: 0.5rem; /* rounded-lg */
  background-color: white; /* bg-white */
`;

const Header = styled.div`
  font-size: 1.875rem; /* equivalent to text-3xl */
  font-weight: bold;
  background-color: #115E59; /* replace with your main green color */
  padding: 0.5rem; /* equivalent to p-2 */
`;

const ItemCard = styled.div`
  border: 4px solid black; /* border border-4 border-black */
  margin: 0.5rem; /* m-2 */
  border-radius: 0.5rem; /* rounded-lg */
  position: relative;
  transition: background-color 0.3s ease; /* Add transition for hover effect */

  &:hover {
    background-color: #e0f2f1; /* hover:bg-lightest-green (replace with your actual color) */
  }
`;

const ItemDetails = styled.div`
  color: black; /* text-black */
  width: 10rem; /* w-40 */
  height: 10rem; /* h-40 */
  padding: 0.5rem; /* p-2 */
  margin: 0.5rem; /* m-2 */
  border-radius: 0.5rem; /* rounded-lg */
`;

const EditButton = styled.button`
  position: absolute;
  background-color: green; /* Dynamic background color */
  color: white; /* text-white */
  border-radius: 9999px;
  display: flex; /* flex */
  align-items: center; /* items-center */
  justify-content: center; /* justify-center */
  width: 4rem;
  height: 4rem;
  top: 0.75rem;
  left: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out; /* transition ease-in-out duration-300 */

  /* Show button on group hover */
  &:hover {
    cursor: pointer;
  }

  ${ItemCard}:hover & {
    opacity: 1;
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  background-color: red; /* Dynamic background color */
  color: white;
  border-radius: 9999px;
  display: flex;
  align-items: center; /* items-center */
  justify-content: center; /* justify-center */
  width: 4rem;
  height: 4rem;
  top: 0.75rem;
  right: 0.75rem;
  opacity: 0;
  transition: opacity 0.3s ease-in-out; /* transition ease-in-out duration-300 */

  /* Show button on group hover */
  &:hover {
    cursor: pointer;
  }

  ${ItemCard}:hover & {
    opacity: 1;
  }
`;

const ScrollContainer = styled.div`
  display: flex;
  padding: 0.5rem; /* p-2 */
  transform-origin: top left;
  overflow-x: scroll;
  &::-webkit-scrollbar {
    display: none; /* Hide scrollbar */
  }
`;

const DashboardContainer: React.FC<DashboardContainerProps> = ({ title, items, user, onEdit, onDelete, onAdd, onChange, children }) => {
  return (
    <Container>
      <Header>
        {title && (
          <div>
            {title}
          </div>
        )}
      </Header>
      {/* {isUserPremium(user) ? (
        <AddNewButton onClick={() => onAdd(false)}>Add New</AddNewButton>
      ) : (
        <AddNewLockedButton onClick={() => onAdd(true)}>
          <span className="pr-2">Add New</span><LockIcon /></AddNewLockedButton>
      )} */}

      <AddNewButton onClick={() => onAdd(false)}>Add New</AddNewButton>
      
      <ScrollContainer>
        {items && items.map((item) => (
          <ItemCard>
            <ItemDetails>
              <div className="text-xl font-bold">{item.jobTitle}</div>
            </ItemDetails>

            <EditButton
              onClick={() => onEdit(item._id)}
            >
              <EditIcon style={{ fontSize: 48 }} />
            </EditButton>

            <DeleteButton
              onClick={() => onDelete(item._id)}
            >
              <CloseIcon style={{ fontSize: 48 }} />
            </DeleteButton>
          </ItemCard>
        ))}
        {children}
      </ScrollContainer>
    </Container>
  );
};

export default DashboardContainer;
