import React, { memo, useMemo } from "react";
import "./style.scss";

type Buttontype = {
  onClick?: (args: any) => void;
  size?: "large" | "medium" | "small";
  color?: "primary" | "secondary" | "default" | "warning" | "info";
  children?: JSX.Element | string;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: "text" | "filled" | "outlined";
};
const Button: React.FC<Buttontype> = (props) => {
  const {
    onClick,
    size = "medium",
    color = "default",
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
      if (typeof color as Buttontype["color"]) {
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
