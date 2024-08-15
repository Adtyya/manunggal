import React, { useEffect, useState } from "react";
import { Search } from "react-bootstrap-icons";
import { useDebounce } from "@uidotdev/usehooks";

export default function SearchForm(props) {
  const [search, setSearch] = useState("");
  const debounceValue = useDebounce(search, 500);

  useEffect(() => {
    if (props.useOnChange) {
      props.setOnSearch(debounceValue);
    }
  }, [debounceValue]);

  return (
    <form
      onSubmit={(ev) => {
        ev.preventDefault();
        !props.useOnChange && props.setState(search);
      }}
      className="hidden sm:inline-block md:hidden lg:inline-block w-full"
    >
      <div className="flex flex-wrap items-stretch w-full relative">
        <input
          type="text"
          className="flex-shrink flex-grow max-w-full leading-5 relative text-sm py-2 px-4 ltr:rounded-l rtl:rounded-r text-gray-800 bg-gray-100 overflow-x-auto focus:outline-none border border-gray-100 focus:border-gray-200 focus:ring-0 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
          placeholder="Search…"
          aria-label="Search"
          // value={props.value}
          onChange={(ev) => setSearch(ev.target.value)}
        />
        <div className="flex -mr-px">
          <button
            className="flex items-center py-2 px-4 ltr:-ml-1 rtl:-mr-1 ltr:rounded-r rtl:rounded-l leading-5 text-gray-500 bg-gray-100 focus:outline-none focus:ring-0"
            type="submit"
          >
            <Search />
          </button>
        </div>
      </div>
    </form>
  );
}
