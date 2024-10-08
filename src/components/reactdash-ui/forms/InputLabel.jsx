import React from "react";

export default function InputLabel(props) {
  const shapes = {
    rounded: "rounded",
    square: "rounded-none",
    pill: "rounded-3xl",
    circle: "rounded-full !p-2.5",
  };
  const sizes = {
    small: "py-1 px-2.5 text-sm",
    medium: "py-2 px-4",
    large: "py-3 px-6",
  };
  const addSize = props.size ? sizes[props.size] : "py-2 px-4";
  const addShape = props.shape ? shapes[props.shape] : "rounded";
  const addClass = props.className ? `${props.className} ` : "";
  const addType = props.type ? `${props.type}` : "text";
  const disabled_css = props.disabled
    ? " !bg-gray-200 dark:!bg-gray-900 dark:bg-opacity-50 cursor-not-allowed"
    : "";

  return (
    <div className="mb-4">
      <label htmlFor={props.id} className="inline-block mb-2 capitalize">
        {props.label}{" "}
        {props.required ? <span className="text-red-500">*</span> : null}
      </label>
      <input
        type={addType}
        aria-label={props.label}
        id={props.id}
        name={props.name}
        placeholder={props.placeholder}
        value={props.value}
        className={`${addClass}w-full leading-5 relative ${addSize} ${addShape} text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600${disabled_css}`}
        disabled={props.disabled}
        readOnly={props.readOnly}
        onKeyPress={props.onKeyPress}
        required={props.required}
        form={props.form}
        defaultValue={props.defaultValue}
        min={props.min}
        max={props.max}
        {...(props.register && { ...props?.register(props.name) })}
      />
      <small className="text-red-500">{props.error}</small>
    </div>
  );
}
