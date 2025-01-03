import React from "react";
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface InputFieldProps {
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  registration: UseFormRegisterReturn; // Objeto de registro de React Hook Form
  error?: FieldError; // Error proporcionado por React Hook Form
}

const InputField: React.FC<InputFieldProps> = ({
  id,
  label,
  type,
  placeholder,
  registration,
  error,
}) => (
  <div>
    <label
      htmlFor={id}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
    >
      {label}
    </label>
    <input
      type={type}
      id={id}
      placeholder={placeholder}
      {...registration} // Conecta el input con React Hook Form
      className={`bg-gray-50 border ${
        error ? "border-red-500" : "border-gray-300"
      } text-gray-900 rounded-lg focus:ring-600 focus:border-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
    />
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

interface CheckboxProps {
  id: string;
  label: string;
  registration: UseFormRegisterReturn; // Objeto de registro de React Hook Form
  error?: FieldError; // Error proporcionado por React Hook Form
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  label,
  registration,
  error,
}) => (
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        id={id}
        type="checkbox"
        {...registration} // Conecta el checkbox con React Hook Form
        className={`w-4 h-4 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded bg-gray-50 focus:ring-3 focus:ring-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-600 dark:ring-offset-gray-800`}
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor={id} className="text-gray-500 dark:text-gray-300">
        {label}
      </label>
    </div>
    {error && <p className="mt-1 text-sm text-red-500">{error.message}</p>}
  </div>
);

const Button: React.FC<{
  type: "button" | "submit" | "reset";
  label: string;
  className?: string;
}> = ({ type, label, className }) => (
  <button
    type={type}
    className={`w-full text-white bg-sky-700 hover:bg-sky-800 focus:ring-4 focus:outline-none focus:ring-sky-400 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-700 dark:hover:bg-800 dark:focus:ring-900 ${className}`}
  >
    {label}
  </button>
);

export { InputField, Checkbox, Button };
