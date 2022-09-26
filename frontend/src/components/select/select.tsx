import { InputHTMLAttributes } from "react";

interface ISelectOption {
  value: string;
  label: string;
}

interface ISelect extends InputHTMLAttributes<HTMLSelectElement> {
  label: string;
  name: string;
  options: ISelectOption[];
}

const Select = ({ name, label, options, ...rest }: ISelect) => {
  return (
    <div className="flex gap-2 items-center">
      <label htmlFor={name} className="w-16">
        {label}
      </label>
      <select
        id={name}
        name={name}
        className="p-1 border border-gray-300 rounded w-60"
        {...rest}
      >
        <option value="">-</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
