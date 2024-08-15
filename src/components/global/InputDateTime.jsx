import DateTimePicker from "react-datetime-picker";

export default function InputDateTime(props) {
  const noMargin = props.noMargin ? props.noMargin : false;
  const defaultStyles = props.customStyle
    ? props.customStyle
    : "py-2 px-4 w-full leading-5 relative text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 rounded";

  return (
    <div className={noMargin ? "mb-0" : "mb-4"}>
      <p className="mb-2 capitalize">
        {props.label}{" "}
        {props.required ? <small className="text-red-500">*</small> : null}
      </p>
      <DateTimePicker
        value={props.value}
        onChange={props.onChange}
        disabled={props.disabled}
        className="w-full"
      />
    </div>
  );
}
