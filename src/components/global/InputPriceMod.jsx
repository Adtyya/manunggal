import { NumericFormat } from "react-number-format";

export default function InputPriceMod(props) {
  const noMargin = props.noMargin ? props.noMargin : false;
  const disabled_css = props.disabled
    ? " !bg-gray-200 dark:!bg-gray-900 dark:bg-opacity-50 cursor-not-allowed"
    : "";
  const defaultStyles = props.customStyle
    ? props.customStyle
    : `py-2 px-4 w-full leading-5 relative text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 rounded ${disabled_css}`;

  return (
    <div className={noMargin ? "mb-0" : "mb-4"}>
      <p className="mb-2 capitalize">
        {props.label}{" "}
        {props.required ? <small className="text-red-500">*</small> : null}
      </p>
      <NumericFormat
        displayType="input"
        value={props.value}
        prefix=""
        allowLeadingZeros={false}
        thousandSeparator="."
        decimalSeparator=","
        disabled={props.disabled}
        className={defaultStyles}
        max={100}
        {...props}
      />
    </div>
  );
}
