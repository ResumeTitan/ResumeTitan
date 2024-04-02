import React from "react";
import './index.css';

// Write new props for the tab
interface Props {
  openTab: number,
  setOpenTab: (tab: number) => void,
}

const Tabs = ({ openTab, setOpenTab }: Props) => {
  return (
    <div className="flex flex-wrap">
      <div className="w-full">
        <ul
          className="tab-ul"
          role="tablist"
        >
          <li className="tab-li">
            <a
              className={`tab-text-base ${openTab === 1 ? "tab-active" : "tab-inactive"}`}
              onClick={e => {
                e.preventDefault();
                setOpenTab(1);
              }}
              data-toggle="tab"
              href="#link1"
              role="tablist"
            >
              Basics
            </a>
          </li>
          <li className="tab-li">
            <a
              className={`tab-text-base ${openTab === 2 ? "tab-active" : "tab-inactive"}`}
              onClick={e => {
                e.preventDefault();
                setOpenTab(2);
              }}
              data-toggle="tab"
              href="#link2"
              role="tablist"
            >
              Advanced
            </a>
          </li>
          {/* <li className="tab-li">
            <a
              className={
                "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                (openTab === 3
                  ? "text-white bg-teal-600"
                  : "text-teal-600 bg-white")
              }
              onClick={e => {
                e.preventDefault();
                setOpenTab(3);
              }}
              data-toggle="tab"
              href="#link3"
              role="tablist"
            >
              Enhance
            </a>
          </li> */}
        </ul>
      </div>
    </div>
  );
};

export default Tabs;
