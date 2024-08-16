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

export default function TableItems(props) {
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

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <div></div>
        </div>
        <Link to="/dashboard/create-sales-contract" className="w-48">
          <Button
            className="mb-4 block sm:inline-block w-full sm:w-full"
            color="gold"
          >
            Add Product
            <PlusLg className="inline-block ltr:ml-1 rtl:mr-1 bi bi-plus-lg" />
          </Button>
        </Link>
      </div>

      <div className="overflow-auto">
        <table className="table-sorter table-bordered-bottom w-full text-gray-500 dark:text-gray-400 dataTable-table">
          <thead>
            <tr className="!bg-secondary-color dark:bg-gray-900 dark:bg-opacity-40 rounded-2xl">
              <th>Code</th>
              <th className="text-left">Name</th>
              <th className="text-left">Qty</th>
              <th className="text-left">Price</th>
              <th className="text-left">Unit</th>
              <th className="text-left">Notes</th>
              <th>Action</th>
            </tr>
          </thead>
          {0 === 0 ? (
            <tbody>
              <tr>
                <td colSpan={7} className="text-center">
                  Belum memiliki data
                </td>
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
                        <p className="w-52">{item.description}</p>
                      </td>
                      <td>
                        <p>
                          {item.stock} {item.unit}
                        </p>
                      </td>
                      <td></td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/dashboard/m/edit-product/${item._id}`}>
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
    </>
  );
}
