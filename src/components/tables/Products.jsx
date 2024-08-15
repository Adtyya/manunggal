import React, { useState, useCallback } from "react";
import { PlusLg, PencilSquare, Trash } from "react-bootstrap-icons";
import {
  Pagination,
  Button,
  Checkbox,
  SearchForm,
} from "@/components/reactdash-ui";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import useProduct from "@/views//products/hook/useProducts";
import ModalDescription from "@/views//products/ModalDescription";

export default function EcommerceProducts(props) {
  // data text
  const action_text = {
    instock: "Ready stock",
    outstock: "Out of stock",
  };
  // data table
  const table_title = {
    name: "Products",
    category: "Category",
    price: "Pricing",
    date: "Update",
    stock: "Stock",
    qty: "Qty",
    action: "Action",
  };
  const data_table = [
    {
      id: "0",
      code: "nike1",
      name: "Nike Womens Free RN Flyknit 2018",
      img: "/img/products/product_1.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 87,
      currency: "Rp.",
      qty: 568,
      stock: "In stock",
    },

    {
      id: "1",
      code: "nike2",
      name: "Nike Women's Sneaker Running Shoes",
      img: "/img/products/product_2.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 77,
      currency: "Rp.",
      qty: 999,
      stock: "In stock",
    },

    {
      id: "2",
      code: "nike3",
      name: "Nike Women's Air Zoom Pegasus 36 Running Shoes",
      img: "/img/products/product_3.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      currency: "Rp.",
      qty: 0,
      stock: "Not active",
    },

    {
      id: "3",
      code: "nike4",
      name: "Nike Women's Air Max 270 Running Shoe",
      img: "/img/products/product_4.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      currency: "Rp.",
      qty: 56,
      stock: "In stock",
    },

    {
      id: "4",
      code: "nike5",
      name: "Nike Women's Flex Trainer 9 Sneaker",
      img: "/img/products/product_5.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      currency: "Rp.",
      qty: 0,
      stock: "Out stock",
    },

    {
      id: "5",
      code: "nike6",
      name: "Nike Women's Gymnastics Tennis Shoes",
      img: "/img/products/product_1.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      currency: "Rp.",
      qty: 56,
      stock: "In stock",
    },

    {
      id: "6",
      code: "nike7",
      name: "Nike Women's Court Lite 2 Tennis Shoe",
      img: "/img/products/product_2.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      discount: 79,
      currency: "Rp.",
      qty: 6,
      stock: "Low stock",
    },

    {
      id: "7",
      code: "nike8",
      name: "Nike Women's Low-Top Basketball Shoe",
      img: "/img/products/product_3.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 87,
      currency: "Rp.",
      qty: 56,
      stock: "In stock",
    },

    {
      id: "8",
      code: "nike9",
      name: "Nike Reposto Womens Running Casual Shoe Cz5630-002",
      img: "/img/products/product_4.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      currency: "Rp.",
      qty: 56,
      stock: "In stock",
    },

    {
      id: "9",
      code: "nike10",
      name: "Nike Womens Air Max Torch 4 Running Shoe",
      img: "/img/products/product_5.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      discount: 69,
      currency: "Rp.",
      qty: 56,
      stock: "In stock",
    },

    {
      id: "10",
      code: "nike11",
      name: "Nike in-Season TR 9 Womens Running Shoe",
      img: "/img/products/product_1.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      currency: "Rp.",
      qty: 56,
      stock: "In stock",
    },

    {
      id: "11",
      code: "nike12",
      name: "Nike Men's Training Shoes, Plum Dust Black Pink Blast",
      img: "/img/products/product_2.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      currency: "Rp.",
      qty: 56,
      stock: "In stock",
    },

    {
      id: "12",
      code: "nike13",
      name: "Nike Unisex-Child Free Rn (Big Kid)",
      img: "/img/products/product_3.jpg",
      url: "/",
      category: "Women Shoes",
      date: "20/05/2022",
      price: 97,
      currency: "Rp.",
      qty: 56,
      stock: "In stock",
    },
  ];
  // total data & max item per page
  let total_data = data_table.length;
  let data_per_page = 8;
  const latestdata = [...data_table].sort((a, b) => b.id - a.id);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  // page changed
  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      setCurrentPage(page);
    },
    [setCurrentPage]
  );
  // slice data_table
  const currentData = latestdata.slice(
    (currentPage - 1) * data_per_page,
    (currentPage - 1) * data_per_page + data_per_page
  );

  // Check all
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const handleSelectAll = (e) => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(currentData.map((li) => li.id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };
  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  const product = useProduct();

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm />
        </div>
        <div className="w-max">
          <label className="flex flex-wrap flex-row">
            <select
              id="bulk_actions"
              name="bulk_actions"
              className="inline-block leading-5 relative py-2 ltr:pl-3 ltr:pr-8 rtl:pr-3 rtl:pl-8 mb-3 rounded bg-gray-100 border border-gray-200 overflow-x-auto focus:outline-none focus:border-gray-300 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 select-caret appearance-none capitalize"
            >
              <option>select availabilty</option>
              <option value="activate">{action_text.instock}</option>
              <option value="out">{action_text.outstock}</option>
            </select>
            {/* <input
              type="submit"
              id="bulk_apply"
              className="ltr:ml-2 rtl:mr-2 py-2 px-4 inline-block text-center mb-3 rounded leading-5 border hover:bg-gray-300 dark:bg-gray-900 dark:bg-opacity-40 dark:border-gray-800 dark:hover:bg-gray-900 focus:outline-none focus:ring-0 cursor-pointer"
              value={action_text.apply}
            /> */}
          </label>
        </div>
        <Link to="/dashboard/create-product" className="w-48">
          <Button
            className="mb-4 block sm:inline-block w-full sm:w-auto"
            color="gold"
          >
            Add new
            <PlusLg className="inline-block ltr:ml-1 rtl:mr-1 bi bi-plus-lg" />
          </Button>
        </Link>
      </div>

      <div className="overflow-auto">
        <table className="table-sorter table-bordered-bottom w-full text-gray-500 dark:text-gray-400 dataTable-table">
          <thead>
            <tr className="!bg-secondary-color dark:bg-gray-900 dark:bg-opacity-40 rounded-2xl">
              {/* <th>
                <Checkbox
                  name="selectAll"
                  id="selectAll"
                  onChange={handleSelectAll}
                  checked={isCheckAll}
                />
              </th> */}
              <th>Date</th>
              <th>{table_title.name}</th>
              <th>Description</th>
              <th>{table_title.price}</th>
              <th>{table_title.qty}</th>
              {/* <th className="hidden lg:table-cell">{table_title.date}</th> */}
              <th className="hidden lg:table-cell">{table_title.stock}</th>
              <th>{table_title.action}</th>
            </tr>
          </thead>

          <tbody>
            {currentData.map((item, id) => {
              const bg_color =
                item.stock === "In stock"
                  ? "text-green-700 bg-green-100"
                  : item.stock === "Low stock"
                  ? "text-yellow-700 bg-yellow-100"
                  : item.stock === "Out stock"
                  ? "text-red-700 bg-red-100"
                  : item.stock === "Not active"
                  ? "text-gray-700 bg-gray-100"
                  : "text-pink-700 bg-pink-100";
              return (
                <tr key={id}>
                  {/* <td>
                    <Checkbox
                      name={item.code}
                      id={item.id}
                      onChange={handleClick}
                      checked={isCheck.includes(item.id)}
                    />
                  </td> */}
                  <td>
                    <p className="text-center">01/10/2025</p>
                  </td>
                  <td>
                    <a href={item.url}>
                      <div className="flex flex-wrap flex-row items-center">
                        <div className="self-center hidden md:block">
                          <img
                            className="h-8 w-8"
                            src={item.img}
                            alt={item.name}
                          />
                        </div>
                        <div className="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                          {item.name}
                          <div className="pt-1 text-sm italic text-gray-500 w-full">
                            {item.category}
                          </div>
                        </div>
                      </div>
                    </a>
                  </td>
                  <td>
                    <p className="line-clamp-2 w-52">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                      Non, ullam!
                    </p>
                    <p
                      onClick={() => product.setModalDescription(true)}
                      className="text-blue-500 cursor-pointer"
                    >
                      Lihat detail
                    </p>
                  </td>
                  <td>
                    <div className="flex items-center justify-center leading-5">
                      {item.discount
                        ? parse(
                            `<span className="line-through mr-2">${item.currency}${item.price}</span><span className="text-green-500">${item.currency}${item.discount}</span>`
                          )
                        : item.currency + item.price}
                    </div>
                  </td>
                  <td>
                    <div className="leading-5 flex items-center justify-center">
                      {item.qty}
                    </div>
                  </td>
                  {/* <td className="hidden lg:table-cell">
                    <div className="leading-5 flex items-center justify-center">
                      {item.date}
                    </div>
                  </td> */}
                  <td className="hidden lg:table-cell">
                    <div
                      className={`flex items-center justify-center text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full ${bg_color}`}
                    >
                      {item.stock}
                    </div>
                  </td>
                  <td className="text-center space-x-1.5">
                    <Link to="/dashboard/edit-product">
                      <Button color="light" size="small">
                        <PencilSquare className="inline text-primary-color" />
                      </Button>
                    </Link>
                    <Button
                      color="light"
                      size="small"
                      onClick={() => product.setModalDelete(true)}
                    >
                      <Trash className="inline text-primary-color" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination
        totalData={total_data}
        perPage={data_per_page}
        className="mt-8"
        onPageChanged={onPageChanged}
        currentPage={currentPage}
      />

      <ModalDescription
        open={product.modalDescription}
        setOpen={() => product.setModalDescription(false)}
        content="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste cum exercitationem quibusdam molestiae. Beatae itaque minus repudiandae ipsa commodi doloribus recusandae, non quis voluptatem fugiat dicta eligendi explicabo quibusdam cum."
      />
    </>
  );
}
