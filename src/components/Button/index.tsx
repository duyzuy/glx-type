import React, { memo, useMemo } from "react";
import "./style.scss";

const Button: React.FC<{
  onClick?: () => void;
  size?: "large" | "medium" | "small";
  color?: string;
  children?: JSX.Element | string;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "text" | "filled" | "outlined";
}> = (props) => {
  const {
    onClick,
    size = "medium",
    color,
    children,
    className,
    variant = "filled",
    type = "button",
    ...rest
  } = props;
  const classes = useMemo(() => {
    let clss = "btn";
    if (className) {
      clss = clss.concat(" ", className);
    }

    if (color) {
      if (color === "primary" || color === "secondary") {
        clss = clss.concat(" ", color);
      }
    }
    if (variant) {
      clss = clss.concat(" ", variant);
    }
    if (size) {
      clss = clss.concat(" ", size);
    }

    return clss;
  }, [className, color, variant, size]);

  return (
    <button type={type} className={classes} onClick={onClick}>
      {props.children}
    </button>
  );
};
export default memo(Button);
