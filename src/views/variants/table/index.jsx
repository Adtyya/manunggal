import React, { useState, useCallback } from "react";
import { PlusLg, PencilSquare, Trash } from "react-bootstrap-icons";
import {
  Pagination,
  Button,
  SearchForm,
} from "@/components/reactdash-ui";
import { Link } from "react-router-dom";
import ModalDelete from "../ModalDelete";
import useVariant from "../hook/useVariants";
import { formatDate } from "@/utils/formatdate";
import { useQuery } from "react-query";
import { getVariants } from "../service";
import useInformationUser from "@/components/global/useInformationUser";

export default function TableVariants() {
  const variant = useVariant();
  const user = useInformationUser();

  const { isLoading, data } = useQuery(
    [
      "variants",
      {
        page: variant.currentPage,
        search: variant.search,
      },
    ],
    getVariants
  );

  // pagination
  const [selectedId, setId] = useState(null);

  // page changed
  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      variant.setCurrentPage(page);
    },
    [variant.currentPage]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              variant.setSearch(ev);
            }}
            useOnChange
          />
        </div>
        <Link to="/dashboard/create-variant" className="w-48">
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
              <th>Variant</th>
              <th>Options</th>
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
                  return (
                    <tr key={id}>
                      <td>
                        <p className="text-center">{formatDate(item.date)}</p>
                      </td>
                      <td align="center">{item.name}</td>
                      <td align="center">{item.options.join(", ")}</td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/dashboard/edit-variant/${item._id}`}>
                            <Button color="light" size="small">
                              <PencilSquare className="inline text-primary-color" />
                            </Button>
                          </Link>
                          {user.role === "super admin" ? (
                            <Button
                              color="light"
                              size="small"
                              onClick={() => {
                                variant.setModalDelete(true);
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
        currentPage={variant.currentPage}
      />

      <ModalDelete
        selected={selectedId}
        open={variant.modalDelete}
        setOpen={() => variant.setModalDelete(false)}
      />
    </>
  );
}
