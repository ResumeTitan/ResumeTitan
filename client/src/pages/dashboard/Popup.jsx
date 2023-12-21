import React from 'react';

const Popup = ({ message, handleDelete, handleCancel }) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center bg-black bg-opacity-50 z-10 p-4">
      <div className="text-black bg-white p-6 rounded shadow-lg">
        <p className="mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="bg-red-500 text-white px-4 py-2 mr-2"
            onClick={handleDelete}
          >
            Delete
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2"
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
