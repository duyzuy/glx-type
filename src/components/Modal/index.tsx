import * as Icon from "react-feather";
import { useEffect, useMemo } from "react";
import Button from "../Button";
import "./style.scss";
const Modal = ({
  title,
  isShow,
  render,
  onCancel,
  onSubmit,
  onClose,
  width = 550,
  center,
  isShowCloseIcon = true,
  className,
  isShowFooter = true,
}: {
  title?: string;
  isShow?: boolean;
  render: Function;
  onCancel?: () => void;
  onSubmit?: () => void;
  onClose?: () => void;
  width?: number;
  center?: boolean;
  isShowCloseIcon?: boolean;
  className?: string;
  isShowFooter?: boolean;
}) => {
  const classes = useMemo(() => {
    let clss = "glx__modal";
    if (center) {
      clss = clss.concat(" ", "center");
    }
    if (className && className !== "") {
      clss = clss.concat(" ", className);
    }
    return clss;
  }, [center]);
  useEffect(() => {
    if (isShow) {
      document.body.classList.add("fixed");
    } else {
      document.body.classList.remove("fixed");
    }
  }, [isShow]);

  if (!isShow) return null;

  if (render && typeof render !== "function")
    throw new Error("render must function");

  return (
    <div className={classes}>
      <div className="glx__modal--overlay" onClick={onClose}></div>
      <div className="glx__modal--container">
        <div className="glx__modal--inner" style={{ maxWidth: width }}>
          {(title && (
            <div className="glx__modal--header">
              <h4>{title}</h4>
              {(isShowCloseIcon && (
                <div className="glx__modal--close" onClick={onClose}>
                  <Icon.X size={16} />
                </div>
              )) || <></>}
            </div>
          )) || <></>}
          <div className="glx__modal--body">{render()}</div>
          {(isShowFooter && (
            <div className="glx__modal--footer">
              {(onCancel && <Button onClick={onCancel}>Quay lại</Button>) || (
                <></>
              )}
              {(onSubmit && <Button onClick={onSubmit}>Thử lại</Button>) || (
                <></>
              )}
            </div>
          )) || <></>}
        </div>
      </div>
    </div>
  );
};

export default Modal;
