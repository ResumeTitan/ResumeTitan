import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export function VerticalList({ items, onSave }) {
  const onDragEnd = (result) => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
  
    const newItems = reorder(items, source.index, destination.index);
    onSave(newItems);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="droppable">
        {(provided, snapshot) => (
          <div
            className={`${snapshot.isDraggingOver ? "bg-white" : "bg-gray-200"}`}
            {...provided.droppableProps}
            ref={provided.innerRef}
          >
            {items.map((item, index) => (
              <Draggable key={item} draggableId={item} index={index}>
                {(provided, snapshot) => (
                  <div
                    className={`form-style ${snapshot.isDragging ? "bg-white" : "bg-gray-200"}`}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    {item}
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
