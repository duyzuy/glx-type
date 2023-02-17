import React, { memo, useMemo } from "react";
import "./style.scss";

const Button: React.FC<{
  onClick?: () => void;
  size?: string;
  color?: string;
  children?: JSX.Element | string;
  className?: string;
  type?: string;
}> = (props) => {
  const { onClick, size, color, children, className, ...rest } = props;
  const classes = useMemo(() => {
    let clss = "btn";
    if (className) {
      clss = clss.concat(" ", clss);
    }
    if (color) {
      if (color === "primary" || color === "secondary") {
        clss = clss.concat(" ", color);
      }
    }

    return clss;
  }, [className, color]);

  return (
    <button className={classes} onClick={onClick}>
      {props.children}
    </button>
  );
};
export default memo(Button);
