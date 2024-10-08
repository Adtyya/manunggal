import React from "react";

export default function Select(props) {
  const options = props.options;
  const initialValue = props.showInitialValue ? props.showInitialValue : false;
  const addClass = props.className ? `${props.className} ` : "";
  const disabled_css = props.disabled
    ? " !bg-gray-200 dark:!bg-gray-900 dark:bg-opacity-50 cursor-not-allowed"
    : "";

  return (
    <div className={`${addClass}mb-4`}>
      <label htmlFor={props.id} className="inline-block mb-2">
        {props.label}{" "}
        {props.required ? <span className="text-red-500">*</span> : null}
      </label>
      <select
        name={props.name}
        id={props.id}
        disabled={props.disabled}
        required={props.required}
        form={props.form}
        {...(props.register && { ...props?.register(props.name) })}
        className={`inline-block w-full leading-5 relative py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 select-caret appearance-none${disabled_css} capitalize`}
      >
        {initialValue ? <option value="">Select One</option> : null}
        {options?.map((option, index) => {
          return (
            <option key={index} value={option.value}>
              {option.title}
            </option>
          );
        })}
      </select>
    </div>
  );
}
