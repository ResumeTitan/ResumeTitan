import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';
import 'styles/index.css';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function VerticalList({ items, icons, onSave }) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [sectionToDelete, setSectionToDelete] = useState(null);

  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
  
    const newItems = reorder(items, source.index, destination.index);
    onSave(newItems);
  };

  const handleDeleteClick = (section, event) => {
    event.stopPropagation();
    setSectionToDelete(section);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (sectionToDelete) {
      const newItems = items.filter(item => item !== sectionToDelete);
      onSave(newItems);
    }
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setSectionToDelete(null);
  };

  return (
    <div className="w-full px-4">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              className={`${snapshot.isDraggingOver ? "bg-gray-200" : "bg-white"} w-full`}
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {items.map((item, index) => (
                <Draggable key={item} draggableId={item} index={index}>
                  {(provided, snapshot) => (
                    <div
                      className={`form-style ${snapshot.isDragging ? "bg-white" : "bg-gray-200"} flex flex-row items-center justify-between`}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="flex items-center">
                        <div className="p-1">
                          {icons[item]}
                        </div>
                        <div className="p-1 text-2xl">
                          {item}
                        </div>
                      </div>
                      <div 
                        className="p-2 cursor-pointer hover:text-red-500 transition-colors"
                        onClick={(e) => handleDeleteClick(item, e)}
                      >
                        <DeleteIcon />
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          className: "bg-white rounded-lg shadow-lg"
        }}
      >
        <DialogTitle className="text-xl font-bold text-gray-800">
          Delete Section
        </DialogTitle>
        <DialogContent>
          <DialogContentText className="text-gray-600">
            Are you sure you want to delete the "{sectionToDelete}" section? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-4 gap-2">
          <button
            className="secondary-action-button"
            onClick={handleDeleteCancel}
          >
            Cancel
          </button>
          <button
            className="save-button"
            onClick={handleDeleteConfirm}
          >
            Delete
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
