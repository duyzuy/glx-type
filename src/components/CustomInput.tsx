import React from "react";

interface InputProps {
  name?: string;
  type?: string;
  placeholder?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  value?: string;
  maxLength?: number;
  error?: string;
}

const CustomInput: React.FC<InputProps> = (props) => {
  const { name, type, placeholder, onChange, onKeyUp, value, ...rest } = props;
  return (
    <input
      name={name}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      onKeyUp={onKeyUp}
      value={value}
    />
  );
};
export default CustomInput;
