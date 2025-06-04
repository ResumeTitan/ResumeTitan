import React from 'react';

const Popup = ({ message, handleDelete, handleCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-10 p-4">
      <div className="text-black bg-white p-6 rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="secondary-action-button"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="primary-action-button text-black"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

export default Popup;
