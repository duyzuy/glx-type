import React, { useMemo } from "react";
import "./style.scss";
type PropsType = {
  width?: number;
  height?: number;
  count?: number;
  circle?: boolean;
  borderRadius?: number;
  inline?: boolean;
  padding?: number;
};
const Skeleton: React.FC<PropsType> = ({
  width = 100,
  height = 30,
  count = 1,
  circle = false,
  borderRadius = 5,
  inline = false,
  padding = 5,
}) => {
  const styles = useMemo(() => {
    let styles = {};
    if (padding) {
      styles = {
        ...styles,
        marginBottom: padding,
      };
    }
    return styles;
  }, [padding, count]);
  return (
    <>
      {Array.from({ length: count }, (value, index) => index).map((item) => (
        <div
          className="skeleton"
          key={`skeleton-${item}`}
          style={{
            ...styles,
            height: height,
            width: width,
            borderRadius: borderRadius,
          }}
        ></div>
      ))}
    </>
  );
};
export default Skeleton;
