import * as Icon from "react-feather";
import { useEffect, useMemo } from "react";
import Button from "../Button";
import "./style.scss";
const Modal = ({
  title,
  isOpen,
  render,
  onCancel,
  onSubmit,
  onClose,
  width = 550,
  isCenter,
  isShowCloseIcon = true,
  className,
  isShowFooter = true,
  isShowHeader = true,
}: {
  title?: string;
  isOpen?: boolean;
  render: Function;
  onCancel?: () => void;
  onSubmit?: () => void;
  onClose?: () => void;
  width?: number;
  isCenter?: boolean;
  isShowCloseIcon?: boolean;
  className?: string;
  isShowFooter?: boolean;
  isShowHeader?: boolean;
}) => {
  const classes = useMemo(() => {
    let clss = "glx__modal";
    if (isCenter) {
      clss = clss.concat(" ", "center");
    }
    if (className && className !== "") {
      clss = clss.concat(" ", className);
    }
    return clss;
  }, [isCenter]);
  useEffect(() => {
    isOpen
      ? document.body.classList.add("fixed")
      : document.body.classList.remove("fixed");
  }, [isOpen]);

  if (render && typeof render !== "function")
    throw new Error("render must function");

  if (!isOpen) return <></>;
  return (
    <div className={classes}>
      <div className="glx__modal--overlay" onClick={onClose}></div>
      <div className="glx__modal--container">
        <div className="glx__modal--inner" style={{ maxWidth: width }}>
          {(isShowHeader && (
            <div className="glx__modal--header">
              {(title && <h4 className="title">{title}</h4>) || <></>}
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
