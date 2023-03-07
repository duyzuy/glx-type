import React from "react";
type PropsType = {
  children?: JSX.Element;
  value?: string;
  type?: string;
  isDanger?: boolean;
};
const DateTimeDisplay: React.FC<PropsType> = ({ type, value, isDanger }) => {
  return (
    <div className={isDanger ? "countdown danger" : "countdown"}>
      <p className="value">{value}</p>
      {(type && <span className="type">{type}</span>) || <></>}
    </div>
  );
};

export default DateTimeDisplay;
