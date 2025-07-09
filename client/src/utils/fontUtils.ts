export const getFontFamily = (fontId: string): string => {
  const fontMap: { [key: string]: string } = {
    'times-new-roman': '"Times New Roman", Times, serif',
    'arial': 'Arial, Helvetica, sans-serif',
    'georgia': 'Georgia, serif',
    'calibri': 'Calibri, sans-serif',
    'cambria': 'Cambria, serif',
    'verdana': 'Verdana, Geneva, sans-serif',
  };
  
  return fontMap[fontId] || fontMap['times-new-roman'];
}; 