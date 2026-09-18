type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  id: string;
  value: string;
  options: SelectOption[];
  onChange: React.ChangeEventHandler<HTMLSelectElement>;
  required?: boolean;
  className?: string;
  placeholder?: string;
};

function Select({
  label,
  id,
  value,
  options,
  onChange,
  required = false,
  className = "",
  placeholder,
}: SelectProps) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-sm text-[#A5A5A5]">
        {label}
      </label>

      <select
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className={`h-10 rounded-[10px] text-[16px] border border-[#ADADAD] bg-transparent text-[#A5A5A5] outline-none ${className}`}
      >
        <option value="">Izaberi opciju</option>

        {options &&
          options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="text-black "
            >
              {option.label}
            </option>
          ))}
      </select>
    </div>
  );
}

export default Select;
