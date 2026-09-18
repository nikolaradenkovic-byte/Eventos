import type { ChangeEventHandler } from "react";

type InputProps = {
  label?: string;
  id: string;
  type: React.HTMLInputTypeAttribute;
  value?: string | number;
  onChange: ChangeEventHandler<HTMLInputElement>;
  className?: string;
  accept?: string;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  inputClassName?: string;
  placeholder?: string;
};

function Input({
  label,
  id,
  type,
  value,
  onChange,
  className = "",
  autoComplete,
  inputClassName = "",
  placeholder,
  accept,
}: InputProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      {label && <label htmlFor={id}>{label}</label>}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        placeholder={placeholder}
        className={inputClassName}
        accept={accept}
      />
    </div>
  );
}
export default Input;
