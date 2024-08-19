import React, { useMemo } from "react";
import { SubmenuAccordion } from "@/components/reactdash-ui";
import useInformationUser from "../global/useInformationUser";
import ContentIcon from "./icons/content";
import UserIcon from "./icons/user";
import DashboardIcon from "./icons/dashboard";
import VisitorIcon from "./icons/visitor";
import PendingIcon from "./icons/visitorPending";
import TicketIcon from "./icons/ticket";
import LibraryIcon from "./icons/library";
import ScanIcon from "./icons/scan";
import ShopIcon from "./icons/shop";

export default function Sidebar(props) {
  const hook = useInformationUser();
  // Data sidebar menu (props.data)
  const sideitems = [
    {
      id: 1,
      title: "Dashboard",
      url: "/dashboard/main",
      icon: <DashboardIcon />,
      user: ["admin", "super admin"],
    },
    {
      id: 2,
      title: "Customer",
      url: "/dashboard/list-customer",
      icon: <VisitorIcon />,
      user: ["admin", "super admin", "front office"],
    },
    {
      id: 2,
      title: "Agent",
      url: "/dashboard/list-agent",
      icon: <VisitorIcon />,
      user: ["admin", "super admin", "front office"],
    },
    {
      id: 2,
      title: "Product",
      url: "/dashboard/list-product",
      icon: <PendingIcon />,
      user: ["admin", "super admin"],
    },
    {
      id: 2,
      title: "Sales Contract",
      url: "/dashboard/list-sales-contract",
      icon: <PendingIcon />,
      user: ["admin", "super admin"],
    },
    {
      id: 8,
      title: "User",
      url: "/dashboard/list-users",
      icon: <UserIcon />,
      user: ["super admin"],
    },
  ];

  const filteredItems = useMemo(() => {
    return sideitems.filter((item) => item.user.includes(hook.role));
  }, [hook.role]);
  // logo (props.logo)
  const logo = { img: "/img/logos/tumurun_logo.png", text: null };
  const models = {
    compact: "sidebar-compact w-0 md:w-20",
    default: "sidebar-area w-64",
  };
  const colors = {
    dark: "dark",
    light: "light",
  };
  const addmodel = props.model ? models[props.model] : "sidebar-area w-64";
  const addcolor = props.color ? colors[props.color] : "";
  const addClass = props.className ? `${props.className} ` : "";

  return (
    <nav
      id="sidebar-menu"
      className={`${addClass}fixed ${addmodel} ${addcolor} transition-all duration-500 ease-in-out h-screen shadow-sm`}
    >
      <div className="h-full bg-white relative dark:bg-gray-800 overflow-y-auto scrollbars">
        {/* logo */}
        {logo ? (
          <div className="mh-18 text-center py-5">
            <h2 className="text-2xl font-bold px-4 max-h-52 overflow-hidden hidden-compact">
              {/* <img
                className="inline-block w-36 h-20 object-contain ltr:mr-2 rtl:ml-2 -mt-1"
                src={logo.img}
              /> */}
              MANUNGGAL
            </h2>
            <h2 className="text-3xl font-semibold mx-auto logo-compact hidden">
              <img className="inline-block w-8 h-8 -mt-1" src={logo.img} />
            </h2>
          </div>
        ) : (
          ""
        )}

        {/* sidebar menu */}
        <div className="flex flex-col justify-between h-4/5">
          <ul
            id="side-menu"
            className="w-full float-none flex flex-col font-medium ltr:pl-1.5 rtl:pr-1.5"
          >
            <SubmenuAccordion data={filteredItems} />
          </ul>

          {/* Banner */}
          {/* <div className="px-4">
          <Banner />
        </div> */}
          <div className="mt-16 w-full text-center h-max pb-2">
            <a
              href="https://evetechsolution.com/"
              target="_blank"
              className="text-sm hover:text-blue-500 text-primary-color"
            >
              Powered by Evetech Solution <br /> Version 1.01
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
