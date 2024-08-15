import React, { useState, useCallback } from "react";
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
import useArticle from "../hook/useArticle";
import { formatDate } from "@/utils/formatdate";
import { useQuery } from "react-query";
import { getArticles } from "../service";
import useInformationUser from "@/components/global/useInformationUser";

export default function TableArticles(props) {
  const article = useArticle();
  const user = useInformationUser();
  const [content, setContent] = useState("");
  const [selectedId, setId] = useState(null);

  const { isLoading, data } = useQuery(
    [
      "articles",
      {
        page: article.currentPage,
        search: article.search,
        status: article.status,
      },
    ],
    getArticles
  );

  // data table
  const table_title = {
    name: "Treatments",
    category: "Category",
    price: "Pricing",
    date: "Update",
    stock: "Stock",
    qty: "Qty",
    action: "Action",
  };

  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      article.setCurrentPage(page);
    },
    [article.currentPage]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              article.setSearch(ev);
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
              onChange={(ev) => article.setStatus(ev.target.value)}
            >
              <option>select Status</option>
              <option value="active">Aktif</option>
              <option value="notactive">Non Aktif</option>
            </select>
          </label>
        </div>
        <Link to="/dashboard/create-article" className="w-48">
          <Button
            className="mb-4 block sm:inline-block w-full sm:w-full"
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
              <th>Date</th>
              <th>Article</th>
              <th>Description</th>
              <th>Status</th>
              <th>{table_title.action}</th>
            </tr>
          </thead>
          {!isLoading && data?.docs?.length === 0 ? (
            <tbody>
              <tr>
                <td>Modul ini belum memiliki data</td>
              </tr>
            </tbody>
          ) : (
            <tbody>
              {isLoading ? (
                <tr>
                  <td>Loading data...</td>
                </tr>
              ) : (
                data?.docs?.map((item, id) => {
                  const bg_color = item.isActive
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
                              src={item.image ?? "/img/products/product_3.jpg"}
                              alt={item.name}
                            />
                          </div>
                          <div className="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2 mb-1">
                            {item.title}
                          </div>
                        </div>
                      </td>
                      <td className="w-96">
                        <p className="line-clamp-2 w-96">{item.description}</p>
                        {item.description.length > 98 ? (
                          <p
                            onClick={() => {
                              article.setModalDescription(true);
                              setContent(item.description);
                            }}
                            className="text-blue-500 cursor-pointer"
                          >
                            Lihat detail
                          </p>
                        ) : null}
                      </td>
                      <td className="hidden lg:table-cell">
                        <div
                          className={`flex items-center justify-center text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full whitespace-nowrap ${bg_color}`}
                        >
                          {item.isActive ? "Aktif" : "Non Aktif"}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/dashboard/edit-article/${item._id}`}>
                            <Button color="light" size="small">
                              <PencilSquare className="inline text-primary-color" />
                            </Button>
                          </Link>
                          {user.role === "super admin" ? (
                            <Button
                              color="light"
                              size="small"
                              onClick={() => {
                                article.setModalDelete(true);
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
        currentPage={article.currentPage}
      />

      <ModalDescription
        open={article.modalDescription}
        setOpen={() => article.setModalDescription(false)}
        content={content}
      />
      <ModalDelete
        selected={selectedId}
        open={article.modalDelete}
        setOpen={() => article.setModalDelete(false)}
      />
    </>
  );
}
