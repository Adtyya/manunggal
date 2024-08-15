import React, { useState, useCallback, useEffect } from "react";
import { PlusLg, PencilSquare, Trash } from "react-bootstrap-icons";
import {
  Pagination,
  Button,
  SearchForm,
} from "@/components/reactdash-ui";
import { Link } from "react-router-dom";
import ModalDelete from "../ModalDelete";
import ModalDetail from "../ModalDetail";
import useOrder from "../hook/useOrders";
import { formatDate } from "@/utils/formatdate";
import { useQuery } from "react-query";
import { getOrders } from "../service";
import { toNumberFormat } from "@/utils/toNumber";
import useInformationUser from "@/components/global/useInformationUser";

export default function TableOrders(props) {
  const order = useOrder();
  const user = useInformationUser();

  const { isLoading, data } = useQuery(
    [
      "orders",
      {
        page: order.currentPage,
        search: order.search,
        status: order.status,
      },
    ],
    getOrders
  );

  // pagination
  const [content, setContent] = useState(null);
  const [selectedId, setId] = useState(null);

  const bgColor = (status) => {
    if (status === 'paid') {
      return "text-green-700 bg-green-100";
    }
    if (status === 'pending') {
      return "text-yellow-700 bg-yellow-100";
    }
    if (status === 'cancel') {
      return "text-red-700 bg-red-100";
    }
    return "text-blue-700 bg-blue-100";
  }

  // page changed
  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      order.setCurrentPage(page);
    },
    [order.currentPage]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              order.setSearch(ev);
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
              onChange={(event) => order.setStatus(event.target.value)}
            >
              <option value="">select status</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancel">Cancel</option>
            </select>
          </label>
        </div>
        <Link to="/dashboard/create-order" className="w-48">
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
              <th width="10px">Date</th>
              <th width="100px">Order ID</th>
              <th width="400px">Customer</th>
              <th>Items</th>
              <th>Price</th>
              <th width="100px">Status</th>
              <th width="10px">Action</th>
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
                      <td className="text-center">{item.orderId}</td>
                      <td>
                        <div className="flex flex-col">
                          <div className="flex flex-col">
                            <span>{item.customer.name}</span>
                            <span>{item.customer.email}</span>
                            <span>{item.customer.phone}</span>
                          </div>
                          {item.customer.address && (
                            <div className="flex flex-col mt-2">
                              <span>
                                {item.customer.address}
                                {item.customer.addressDetail && ` (${item.customer.addressDetail})`}
                              </span>
                              <span>
                                {item.customer.subdistrict && `${item.customer.subdistrict}`}
                                {item.customer.city && `, ${item.customer.city}`}
                                {item.customer.province && `, ${item.customer.province}`}
                              </span>
                              <span>
                                {item.customer.zipCode && `Kode Pos : (${item.customer.zipCode})`}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <div className="flew flex row gap-1">
                            <span>
                              {item.items[0].qty} x
                            </span>
                            <div className="flex flex-col">
                              <span>{item.items[0].name}</span>
                              {item.items[0].variant && (
                                <span className="text-sm italic">
                                  {`${item.items[0].variant} ${item.items[0].subvariant}`}
                                </span>
                              )}
                            </div>
                          </div>
                          {item.items.length > 1 && (
                            <span
                              className="text-primary-color hover:underline hover:cursor-pointer"
                              onClick={() => {
                                order.setModalDetail(true);
                                setContent(item.items);
                              }}
                            >
                              {`+${item.items.length - 1} produk lainnya`}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="text-center">
                        Rp. {toNumberFormat(item.totalPrice)}
                      </td>
                      <td>
                        <div
                          className={`flex items-center justify-center text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full capitalize ${bgColor(item.status)}`}
                        >
                          {item.status}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/dashboard/edit-order/${item._id}`}>
                            <Button color="light" size="small">
                              <PencilSquare className="inline text-primary-color" />
                            </Button>
                          </Link>
                          {user.role === "super admin" ? (
                            <Button
                              color="light"
                              size="small"
                              onClick={() => {
                                order.setModalDelete(true);
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
        currentPage={order.currentPage}
      />

      <ModalDetail
        open={order.modalDetail}
        setOpen={() => order.setModalDetail(false)}
        content={content}
      />
      <ModalDelete
        selected={selectedId}
        open={order.modalDelete}
        setOpen={() => order.setModalDelete(false)}
      />
    </>
  );
}
