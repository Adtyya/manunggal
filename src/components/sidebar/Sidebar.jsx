import React from "react";
import {
  HouseDoor,
  Shop,
  Briefcase,
  FileEarmarkRichtext,
  BoxArrowInRight,
  WindowSidebar,
  LayoutSidebarInset,
  Layers,
  ColumnsGap,
  CardList,
  BlockquoteRight,
  BarChartLine,
  FileText,
  Diamond,
} from "react-bootstrap-icons";
import { Banner } from "@/components/widgets";
import { SubmenuAccordion } from "@/components/reactdash-ui";

export default function Sidebar(props) {
  // Data sidebar menu (props.data)
  const sideitems = [
    {
      id: 88,
      title: "under development",
      url: "/dashboard",
      icon: <Diamond />,
      submenu: [
        { id: 801, title: "Products", url: "/dashboard/list-products" },
        { id: 802, title: "Treatments", url: "/dashboard/list-treatment" },
        { id: 803, title: "Promotions", url: "/dashboard/list-promotions" },
        { id: 804, title: "Articles", url: "/dashboard/list-articles" },
      ],
    },
    {
      id: 1,
      title: "Dashboards",
      url: "/home/",
      icon: <HouseDoor />,
      submenu: [
        { id: 101, title: "CMS", url: "/dashboard/home/cms" },
        { id: 102, title: "Analytics", url: "/dashboard/home/analytics" },
        { id: 103, title: "Ecommerce", url: "/dashboard/home/ecommerce" },
        { id: 104, title: "Projects", url: "/dashboard/home/projects" },
        { id: 105, title: "CRM", url: "/dashboard/home/crm" },
        { id: 106, title: "Hosting", url: "/dashboard/home/hosting" },
        { id: 107, title: "Saas", url: "/dashboard/home/saas" },
        { id: 108, title: "Sales", url: "/dashboard/home/sales" },
        { id: 109, title: "Marketing", url: "/dashboard/home/marketing" },
      ],
    },
    {
      id: 3,
      title: "Ecommerce",
      url: "/ecommerce/",
      icon: <Shop />,
      submenu: [
        { id: 301, title: "Products", url: "/dashboard/ecommerce/products" },
        {
          id: 302,
          title: "Product detail",
          url: "/dashboard/ecommerce/product-detail",
        },
        { id: 303, title: "Orders", url: "/dashboard/ecommerce/orders" },
        {
          id: 304,
          title: "Order detail",
          url: "/dashboard/ecommerce/order-detail",
        },
        { id: 305, title: "Customers", url: "/dashboard/ecommerce/customers" },
        {
          id: 306,
          title: "Shopping Cart",
          url: "/dashboard/ecommerce/shopping-cart",
        },
        { id: 307, title: "Checkout", url: "/dashboard/ecommerce/checkout" },
        { id: 308, title: "Sellers", url: "/dashboard/ecommerce/sellers" },
        { id: 309, title: "Invoice", url: "/dashboard/ecommerce/invoice" },
      ],
    },
    {
      id: 4,
      title: "Projects",
      url: "/project/",
      icon: <Briefcase />,
      submenu: [
        { id: 401, title: "Lists", url: "/dashboard/project/project-lists" },
        { id: 402, title: "Details", url: "/dashboard/project/project-detail" },
        { id: 403, title: "Kanban", url: "/dashboard/project/kanban" },
        { id: 404, title: "Create", url: "/dashboard/project/create-project" },
      ],
    },
    {
      id: 5,
      title: "Pages",
      url: "/pages",
      icon: <FileEarmarkRichtext />,
      submenu: [
        { id: 501, title: "Profile", url: "/dashboard/pages/profile" },
        { id: 502, title: "Services", url: "/dashboard/pages/services" },
        { id: 503, title: "Faq", url: "/dashboard/pages/faq" },
        { id: 504, title: "Pricing", url: "/dashboard/pages/pricing" },
        { id: 505, title: "Maintenance", url: "/maintenance" },
        { id: 506, title: "404", url: "/dashboard/pages/404" },
        { id: 507, title: "Starter", url: "/dashboard/pages/starter" },
      ],
    },
    {
      id: 6,
      title: "Auth",
      url: "/auth",
      icon: <BoxArrowInRight />,
      submenu: [
        { id: 601, title: "Register Cover", url: "/auth2/register" },
        { id: 602, title: "Login Cover", url: "/auth2/login" },
        { id: 603, title: "Register Ilustration", url: "/auth3/register" },
        { id: 604, title: "Login Ilustration", url: "/auth3/login" },
        { id: 605, title: "Register Basic", url: "/auth/register" },
        { id: 606, title: "Login Basic", url: "/auth/login" },
        { id: 607, title: "Forgot Password", url: "/auth/forgot" },
        { id: 608, title: "Confirm Email", url: "/auth/confirm" },
        { id: 609, title: "Change Password", url: "/auth/change-password" },
        { id: 610, title: "Logout Page", url: "/auth/logout" },
      ],
    },
    {
      id: 7,
      title: "Landing Page",
      url: "/landing-page",
      icon: <WindowSidebar />,
    },
    {
      id: 8,
      title: "Layouts",
      url: "/layouts",
      icon: <LayoutSidebarInset />,
      submenu: [
        { id: 801, title: "Side Dark", url: "/side-dark" },
        { id: 802, title: "Compact", url: "/compact" },
      ],
    },
    {
      id: 9,
      title: "Components",
      url: "/components",
      icon: <Layers />,
      submenu: [
        { id: 901, title: "Accordion", url: "/docs/components/accordion" },
        { id: 902, title: "Alerts", url: "/docs/components/alerts" },
        { id: 903, title: "Avatar", url: "/docs/components/avatar" },
        { id: 904, title: "Badge", url: "/docs/components/badge" },
        { id: 905, title: "Breadcrumb", url: "/docs/components/breadcrumb" },
        { id: 906, title: "Buttons", url: "/docs/components/buttons" },
        { id: 907, title: "Card", url: "/docs/components/cards" },
        { id: 908, title: "Carousel", url: "/docs/components/carousel" },
        { id: 909, title: "Collapse", url: "/docs/components/collapse" },
        { id: 910, title: "Devices", url: "/docs/components/devices" },
        { id: 911, title: "Dropdowns", url: "/docs/components/dropdowns" },
        { id: 912, title: "Grid", url: "/docs/components/grid" },
        { id: 913, title: "List Group", url: "/docs/components/list-group" },
        { id: 915, title: "Map", url: "/docs/components/map" },
        { id: 916, title: "Modal", url: "/docs/components/modal" },
        { id: 917, title: "Navbar", url: "/docs/components/navbar" },
        {
          id: 918,
          title: "Notification",
          url: "/docs/components/notification",
        },
        { id: 920, title: "Offcanvas", url: "/docs/components/offcanvas" },
        { id: 921, title: "Pagination", url: "/docs/components/pagination" },
        { id: 922, title: "Popovers", url: "/docs/components/popovers" },
        { id: 923, title: "Progress", url: "/docs/components/progress" },
        { id: 924, title: "Ribbon", url: "/docs/components/ribbon" },
        { id: 925, title: "Scrollbar", url: "/docs/components/scrollbar" },
        { id: 926, title: "Spinner", url: "/docs/components/spinner" },
        { id: 927, title: "Sweet Alert", url: "/docs/components/sweetalert" },
        { id: 928, title: "Tabs", url: "/docs/components/tabs" },
        { id: 929, title: "Tooltips", url: "/docs/components/tooltips" },
        { id: 930, title: "Submenu", url: "/docs/components/submenu" },
        { id: 931, title: "Formatter", url: "/docs/components/formatter" },
        { id: 932, title: "Rating", url: "/docs/components/rating" },
      ],
    },
    {
      id: 10,
      title: "Widgets",
      url: "/dashboard/app/widgets",
      icon: <ColumnsGap />,
    },
    {
      id: 11,
      title: "Forms",
      url: "/forms",
      icon: <CardList />,
      submenu: [
        { id: 1101, title: "Input", url: "/docs/forms/input" },
        { id: 1102, title: "Input Label", url: "/docs/forms/inputlabel" },
        { id: 1103, title: "Input Group", url: "/docs/forms/inputgroup" },
        { id: 1104, title: "Select", url: "/docs/forms/select" },
        {
          id: 1105,
          title: "Checkbox Radio",
          url: "/docs/forms/checkbox-radio",
        },
        { id: 1106, title: "Switch Range", url: "/docs/forms/switch-range" },
        { id: 1107, title: "Advance", url: "/docs/forms/advance" },
        { id: 1108, title: "Example Forms", url: "/docs/forms/forms-example" },
      ],
    },
    {
      id: 12,
      title: "Content",
      url: "/content",
      icon: <BlockquoteRight />,
      submenu: [
        { id: 1201, title: "Typography", url: "/docs/content/typography" },
        { id: 1202, title: "Tables", url: "/docs/content/tables" },
        { id: 1203, title: "Icons", url: "/docs/content/icons" },
      ],
    },
    {
      id: 13,
      title: "Charts",
      url: "/docs/components/chart",
      icon: <BarChartLine />,
    },
    {
      id: 15,
      title: "Documentation",
      url: "/start",
      icon: <FileText />,
      submenu: [
        { id: 1501, title: "Introduction", url: "/docs/start/introduction" },
        { id: 1503, title: "Customize", url: "/docs/start/customize" },
        { id: 1505, title: "Credits", url: "/docs/start/credits" },
        { id: 1506, title: "Changelogs", url: "/docs/start/changelogs" },
      ],
    },
  ];
  // logo (props.logo)
  const logo = { img: "/img/logo.png", text: "Reactdash" };
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
      <div className="h-full bg-white dark:bg-gray-800 overflow-y-auto scrollbars">
        {/* logo */}
        {logo ? (
          <div className="mh-18 text-center py-5">
            <h2 className="text-2xl font-semibold text-gray-200 px-4 max-h-9 overflow-hidden hidden-compact">
              <img
                className="inline-block w-8 h-8 ltr:mr-2 rtl:ml-2 -mt-1"
                src={logo.img}
              />
              <span className="text-gray-700 dark:text-gray-200">
                {logo.text}
              </span>
            </h2>
            <h2 className="text-3xl font-semibold mx-auto logo-compact hidden">
              <img className="inline-block w-8 h-8 -mt-1" src={logo.img} />
            </h2>
          </div>
        ) : (
          ""
        )}

        {/* sidebar menu */}
        <ul
          id="side-menu"
          className="w-full float-none flex flex-col font-medium ltr:pl-1.5 rtl:pr-1.5"
        >
          <SubmenuAccordion data={sideitems} />
        </ul>

        {/* Banner */}
        <div className="px-4">
          <Banner />
        </div>
      </div>
    </nav>
  );
}
