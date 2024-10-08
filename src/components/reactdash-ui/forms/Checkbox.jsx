import React, { useState } from "react";

export default function Checkbox({ checked, ...props }) {
  const defaultChecked = checked ? checked : false;
  const [isChecked, setIsChecked] = useState(defaultChecked);
  const onChange = props.onChange;
  const onChecked = checked ? checked : isChecked;
  const addClass = props.className ? `${props.className} ` : "";
  const margin_bottom = props.label ? "mb-4" : "";
  const disabled_css = props.disabled
    ? "!bg-gray-200 dark:!bg-gray-900 dark:bg-opacity-50 cursor-not-allowed"
    : "";

  return (
    <label className={`${addClass}flex items-center ${margin_bottom}`}>
      {onChange ? (
        <input
          type="checkbox"
          name={props.name}
          id={props.id}
          value={props.value}
          checked={onChecked}
          onChange={onChange}
          disabled={props.disabled}
          className={`form-checkbox ltr:mr-2 rtl:ml-2 h-5 w-5 text-primary-color  dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded focus:outline-none ${disabled_css}`}
        />
      ) : (
        <input
          type="checkbox"
          name={props.name}
          id={props.id}
          value={props.value}
          checked={isChecked}
          onChange={() => setIsChecked((prev) => !prev)}
          disabled={props.disabled}
          className={`form-checkbox ltr:mr-2 rtl:ml-2 h-5 w-5 text-primary-color  dark:bg-gray-700 border border-gray-300 dark:border-gray-700 rounded focus:outline-none ${disabled_css}`}
        />
      )}
      <span>{props.label}</span>
    </label>
  );
}
