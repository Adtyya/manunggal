import React, { useState, useCallback, useEffect } from "react";
import { PlusLg, PencilSquare, Trash } from "react-bootstrap-icons";
import { Pagination, Button, SearchForm } from "@/components/reactdash-ui";
import { Link } from "react-router-dom";
import ModalDelete from "../ModalDelete";
import useTicket from "../hook/useTickets";
import { formatDate } from "@/utils/formatdate";
import { useQuery, useQueryClient } from "react-query";
import { getTickets } from "../service";
import { toNumberFormat } from "@/utils/toNumber";
import useInformationUser from "@/components/global/useInformationUser";
import formatRupiah from "@/utils/formatRupiah";

export default function TableVisitors(props) {
  const ticket = useTicket();
  const user = useInformationUser();

  const { isLoading, data } = useQuery(
    [
      "products",
      {
        page: ticket.currentPage,
        search: ticket.search,
      },
    ],
    getTickets
  );

  const [selectedId, setSelectedId] = useState(null);

  const bgStatus = (val) => {
    if (!val) return "text-yellow-700 bg-yellow-100";
    return "text-green-700 bg-green-100";
  };

  // page changed
  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      ticket.setCurrentPage(page);
    },
    [ticket.currentPage]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              ticket.setSearch(ev);
            }}
            useOnChange
          />
        </div>
        <Link to="/dashboard/create-customer" className="w-48">
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
              <th className="text-left">Code</th>
              <th className="text-left">Name</th>
              <th className="text-left">Description</th>
              <th className="text-left">Stock</th>
              <th className="text-left">Unit</th>
              <th className="text-left">Price</th>
              <th>Action</th>
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
                  <td>Loading data....</td>
                </tr>
              ) : (
                data?.docs?.map((item, id) => {
                  return (
                    <tr key={id}>
                      <td className="text-center">{formatDate(item.date)}</td>
                      <td>
                        <p>{item.code}</p>
                      </td>
                      <td>
                        <p>{item.name}</p>
                      </td>
                      <td>
                        <p>{item.description}</p>
                      </td>
                      <td>
                        <p>
                          {item.stock} {item.unit}
                        </p>
                      </td>
                      <td>
                        <p>{item.unit}</p>
                      </td>
                      <td>
                        <p>{formatRupiah(item.price)}</p>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/dashboard/edit-customer/${item._id}`}>
                            <Button color="light" size="small">
                              <PencilSquare className="inline text-primary-color" />
                            </Button>
                          </Link>
                          {user.role === "super admin" && (
                            <Button
                              color="light"
                              size="small"
                              onClick={() => {
                                ticket.setModalDelete(true);
                                setSelectedId(item._id);
                              }}
                            >
                              <Trash className="inline text-primary-color" />
                            </Button>
                          )}
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
        currentPage={ticket.currentPage}
      />

      <ModalDelete
        selected={selectedId}
        open={ticket.modalDelete}
        setOpen={() => ticket.setModalDelete(false)}
      />
    </>
  );
}
