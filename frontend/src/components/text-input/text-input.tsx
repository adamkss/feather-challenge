import React, { InputHTMLAttributes } from "react";

export interface ITextInput extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const TextInput = ({ name, label, ...rest }: ITextInput) => {
  return (
    <div className="flex gap-2 items-center">
      <label htmlFor={name} className="w-16">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        className="p-1 border border-gray-300 rounded w-60"
        {...rest}
      />
    </div>
  );
};

export default TextInput;
