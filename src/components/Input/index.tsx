import React, { memo, useMemo, forwardRef } from "react";
import "./style.scss";
import * as Icon from "react-feather";

type InputType = {
  name?: string;
  type?: "number" | "text" | "password";
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string | number | undefined;
  maxLength?: number;
  error?: string;
  isValid?: boolean;
  className?: string;
};
const Input = forwardRef<HTMLInputElement, InputType>((props, ref) => {
  const {
    name,
    type = "text",
    placeholder,
    onChange,
    onKeyUp,
    value,
    error,
    className,
    isValid,
    ...rest
  } = props;

  const classes = useMemo(() => {
    let cls = "field";
    if (error) cls = cls.concat(" ", "error");
    if (className) cls = cls.concat(" ", className);
    if (isValid) cls = cls.concat(" ", "isValid");
    return cls;
  }, [error, className, isValid]);
  return (
    <div className={classes}>
      <div className="input">
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          onChange={onChange}
          onKeyUp={onKeyUp}
          value={value}
          ref={ref}
        />
        {(error && (
          <span className="icon">
            <Icon.AlertTriangle size={16} />
          </span>
        )) || <></>}
        {(isValid && (
          <span className="icon">
            <Icon.CheckCircle size={16} />
          </span>
        )) || <></>}
      </div>
      {(error && <p className="error-message">{error}</p>) || <></>}
    </div>
  );
});
export default memo(Input);
