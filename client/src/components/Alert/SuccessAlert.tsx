import React from 'react'
import './Alert.css'

const SuccessAlert = ({
  message,
  onClose,
}: {
  message: string
  onClose: () => void
}) => {

  return (
  <div className={`alert success-alert`} role="alert">
    <div className={`ml-3 text-sm font-medium`}>
      {message}
    </div>
    <button onClick={onClose} type="button" className={`close-button success-button`}>
    <span className="sr-only">Close</span>
      <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
      </svg>
    </button>
  </div>
  )
}

export default SuccessAlert;
