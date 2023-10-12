import React, { useEffect } from 'react';

export const PrintToPdf = () => {
  useEffect(() => {
    globalThis.addEventListener('beforeprint', () => {
      globalThis.document.title = `ResumeTitan_${Date.now()}`;
    });

    globalThis.addEventListener('afterprint', () => {
      globalThis.document.title = 'ResumeTitan';
    });
  }, []);

  const handlePrint = () => {    
      const contentToPrint = document.getElementById('print-resume');

      if (contentToPrint) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write('<html><head><title>Print</title></head><body>');
          printWindow.document.write(contentToPrint.innerHTML);
          printWindow.document.write('</body></html>');
          printWindow.document.close();
          printWindow.print();
          printWindow.close();
        }
      } else {
        alert('Element with ID "print-resume" not found.');
      }
  }

  return (
    <div>
      <button onClick={handlePrint} className="submitButton">
        {"Print to PDF"}
      </button>
    </div>
  )
}
