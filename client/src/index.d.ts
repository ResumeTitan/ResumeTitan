declare module '*.gif';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.png';
declare module '*.svg';
declare module '*.webp';
declare module '*.ico';
declare module '*.mp4';
declare module '*.webm';
declare module '*.md' {
  const content: string;
  export default content;
}
declare module 'html2pdf.js';
declare namespace JSX {
  interface IntrinsicElements {
    'stripe-buy-button': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
      'buy-button-id': string;
      'publishable-key': string;
    };
  }
}
