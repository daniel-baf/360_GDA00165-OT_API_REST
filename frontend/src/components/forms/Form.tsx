const InputField: React.FC<{
  id: string;
  name: string;
  label: string;
  type: string;
  placeholder: string;
  required?: boolean;
}> = ({ id, label, type, placeholder, required }) => (
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
      name={id}
      placeholder={placeholder}
      required={required}
      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-600 focus:border-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
    />
  </div>
);

const Checkbox: React.FC<{
  id: string;
  label: string;
  required?: boolean;
  checked?: false;
}> = ({ id, label, required, checked }) => (
  <div className="flex items-start">
    <div className="flex items-center h-5">
      <input
        id={id}
        type="checkbox"
        required={required}
      checked={checked}
        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-600 dark:ring-offset-gray-800"
      />
    </div>
    <div className="ml-3 text-sm">
      <label htmlFor={id} className="text-gray-500 dark:text-gray-300">
        {label}
      </label>
    </div>
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
