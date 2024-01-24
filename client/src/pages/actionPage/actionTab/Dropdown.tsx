import React, { useState } from 'react';

interface Props {
  options: Array<String>;
  onSelect: (selected: string) => void;
}

const Dropdown: React.FC<Props> = ({ options, onSelect }) => {
  const [selected, setSelected] = useState("");
  return (
    <div className="relative w-full lg:max-w-sm">
      <select
        value={selected}
        className="w-full p-2.5 text-gray-500 bg-white border rounded-md shadow-sm outline-none appearance-none focus:border-indigo-600"
        onChange={(e) => {
          onSelect(e.target.value);
          setSelected(e.target.value);
        }}
      >
          <option>ReactJS Dropdown</option>
          <option>Laravel 9 with React</option>
          <option>React with Tailwind CSS</option>
          <option selected>React With Headless UI</option>
      </select>
    </div>
  );
};

export default Dropdown;
