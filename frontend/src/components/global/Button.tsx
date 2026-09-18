import type React from "react";

type ButtonProps = {
  type: "button" | "submit" | "reset";
  className?: string;
  label: string;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

function Button({ type, className, label, onClick }: ButtonProps) {
  return (
    <button type={type} onClick={onClick} className={className}>
      {label}
    </button>
  );
}
export default Button;
