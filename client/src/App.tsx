import React, { ReactNode } from 'react';
import NavBar from './components/NavBar';

export default function App({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-600 ">
        <NavBar links={["test", "otherTest"]}/>
        {children}
    </div>
  );
}
