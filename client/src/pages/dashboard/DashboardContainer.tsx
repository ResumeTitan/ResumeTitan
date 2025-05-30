import React from 'react';
import styled from 'styled-components';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { CoverLetterType } from 'types/types';
import { UserResource } from '@clerk/types';
// import { isUserPremium } from '../../utils/index';
// import LockIcon from '@mui/icons-material/Lock';
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
  margin: 1rem;
  border: 4px solid black;
  border-radius: 1rem;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const Header = styled.div`
  font-size: 2rem;
  font-weight: bold;
  background-color: #115E59;
  padding: 1rem 1.5rem;
  color: white;
  border-radius: 0.5rem 0.5rem 0 0;
`;

const ItemCard = styled.div`
  border: 4px solid black;
  margin: 0.75rem;
  border-radius: 0.75rem;
  position: relative;
  transition: all 0.3s ease;
  min-width: 250px;
  max-width: 350px;
  flex: 1;

  &:hover {
    background-color: #e0f2f1;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const ItemDetails = styled.div`
  color: black;
  padding: 1.5rem;
  margin: 0.5rem;
  border-radius: 0.5rem;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  justify-content: center;
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
  padding: 1rem;
  gap: 1rem;
  overflow-x: auto;
  overflow-y: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
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
          <ItemCard key={item._id}>
            <ItemDetails>
              <div className="text-xl font-bold mb-2">{item.jobTitle}</div>
              <div className="text-lg text-gray-700">at {item.company}</div>
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
