import React, { memo, useMemo } from "react";
import "./style.scss";

const Input: React.FC<{
  name?: string;
  type?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string | number | undefined;
  maxLength?: number;
  error?: string;
  className?: string;
}> = (props) => {
  const {
    name,
    type,
    placeholder,
    onChange,
    onKeyUp,
    value,
    error,
    className,
    ...rest
  } = props;

  const classes = useMemo(() => {
    let cls = "field";
    if (error) cls = cls.concat(" ", "error");
    if (className) cls = cls.concat(" ", className);

    return cls;
  }, [error, className]);
  return (
    <div className={classes}>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        onChange={onChange}
        onKeyUp={onKeyUp}
        value={value}
      />
      {(error && <p className="error-message">{error}</p>) || <></>}
    </div>
  );
};
export default memo(Input);
