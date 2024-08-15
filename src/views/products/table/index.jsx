import React, { useState, useCallback, useEffect } from "react";
import { PlusLg, PencilSquare, Trash } from "react-bootstrap-icons";
import {
  Pagination,
  Button,
  Checkbox,
  SearchForm,
} from "@/components/reactdash-ui";
import { Link } from "react-router-dom";
import ModalDelete from "../ModalDelete";
import ModalDescription from "../ModalDescription";
import useProduct from "../hook/useProducts";
import { formatDate } from "@/utils/formatdate";
import { useQuery, useQueryClient } from "react-query";
import { getProducts } from "../service";
import { toNumberFormat } from "@/utils/toNumber";
import useInformationUser from "@/components/global/useInformationUser";

export default function TableProducts(props) {
  const product = useProduct();
  const user = useInformationUser();

  const { isLoading, data } = useQuery(
    [
      "products",
      {
        page: product.currentPage,
        search: product.search,
        stock: product.stock,
      },
    ],
    getProducts
  );

  // data text
  const action_text = {
    instock: "Ready stock",
    outstock: "Out of stock",
  };

  // pagination
  const [content, setContent] = useState(null);
  const [selectedId, setId] = useState(null);

  // page changed
  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      product.setCurrentPage(page);
    },
    [product.currentPage]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              product.setSearch(ev);
            }}
            useOnChange
          />
        </div>
        <div className="w-max">
          <label className="flex flex-wrap flex-row">
            <select
              id="bulk_actions"
              name="bulk_actions"
              className="inline-block leading-5 relative py-2 ltr:pl-3 ltr:pr-8 rtl:pr-3 rtl:pl-8 mb-3 rounded bg-gray-100 border border-gray-200 overflow-x-auto focus:outline-none focus:border-gray-300 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 select-caret appearance-none capitalize"
              onChange={(event) => product.setStock(event.target.value)}
            >
              <option>select availabilty</option>
              <option value="onstock">{action_text.instock}</option>
              <option value="outstock">{action_text.outstock}</option>
            </select>
          </label>
        </div>
        <Link to="/dashboard/create-product" className="w-48">
          <Button
            className="mb-4 block sm:inline-block w-full sm:w-full"
            color="gold"
          >
            Add New
            <PlusLg className="inline-block ltr:ml-1 rtl:mr-1 bi bi-plus-lg" />
          </Button>
        </Link>
      </div>

      <div className="overflow-auto">
        <table className="table-sorter table-bordered-bottom w-full text-gray-500 dark:text-gray-400 dataTable-table">
          <thead>
            <tr className="!bg-secondary-color dark:bg-gray-900 dark:bg-opacity-40 rounded-2xl">
              <th>Date</th>
              <th>Product</th>
              <th>Description</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          {!isLoading && data?.docs?.length === 0 ? (
            <tbody>
              <tr>
                <td colSpan={4}>Modul ini belum memiliki data</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={4}>Loading data....</td>
                </tr>
              ) : (
                data?.docs?.map((item, id) => {
                  const bg_color =
                    item.stock > 0 && item.isAvailable
                      ? "text-green-700 bg-green-100"
                      : "text-yellow-700 bg-yellow-100";

                  return (
                    <tr key={id}>
                      <td>
                        <p className="text-center">{formatDate(item.date)}</p>
                      </td>
                      <td>
                        <div className="flex flex-wrap flex-row items-center">
                          <div className="self-center hidden md:block">
                            <img
                              className="h-8 w-8"
                              src={item.image}
                              alt={item.name}
                            />
                          </div>
                          <div className="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                            {item.name}
                            <div className="pt-1 text-sm italic text-gray-500 w-full capitalize">
                              {item.category}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="w-80">
                        <p className="line-clamp-2">{item.description}</p>
                        {item.description.length > 98 ? (
                          <p
                            onClick={() => {
                              product.setModalDescription(true);
                              setContent(item.description);
                            }}
                            className="text-blue-500 cursor-pointer"
                          >
                            Lihat detail
                          </p>
                        ) : null}
                      </td>
                      <td>
                        <div className="flex items-center justify-center leading-5">
                          {item.discount.amount ? (
                            <div className="flex flex-col items-center gap-2">
                              <p className="text-red-400 opacity-75 italic">
                                <span className="line-through">{`Rp. ${toNumberFormat(item.price)}`}</span> Disc {item.discount.percentage}%
                              </p>
                              <span>
                                {`Rp. ${toNumberFormat(item.price - item.discount.amount)}`}
                              </span>
                            </div>
                          ) : (
                            `Rp. ${toNumberFormat(item.price)}`
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="leading-5 flex items-center justify-center">
                          {toNumberFormat(item.stock)}
                        </div>
                      </td>
                      <td className="hidden lg:table-cell">
                        <div
                          className={`flex items-center justify-center text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full ${bg_color}`}
                        >
                          {item.stock > 0 && item.isAvailable
                            ? "Ready Stock"
                            : "Out of Stock"}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/dashboard/edit-product/${item._id}`}>
                            <Button color="light" size="small">
                              <PencilSquare className="inline text-primary-color" />
                            </Button>
                          </Link>
                          {user.role === "super admin" ? (
                            <Button
                              color="light"
                              size="small"
                              onClick={() => {
                                product.setModalDelete(true);
                                setId(item._id);
                              }}
                            >
                              <Trash className="inline text-primary-color" />
                            </Button>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          )}
        </table>
      </div>

      <Pagination
        totalData={data?.totalDocs}
        perPage={10}
        className="mt-8"
        onPageChanged={onPageChanged}
        currentPage={product.currentPage}
      />

      <ModalDescription
        open={product.modalDescription}
        setOpen={() => product.setModalDescription(false)}
        content={content}
      />
      <ModalDelete
        selected={selectedId}
        open={product.modalDelete}
        setOpen={() => product.setModalDelete(false)}
      />
    </>
  );
}
