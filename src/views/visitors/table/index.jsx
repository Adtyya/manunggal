import React, { useState, useCallback } from "react";
import {
  // PlusLg,
  // PencilSquare,
  // Trash,
  InfoCircleFill,
  Search,
  ArrowClockwise
} from "react-bootstrap-icons";
import {
  Pagination,
  Button,
  SearchForm,
} from "@/components/reactdash-ui";
// import { Link } from "react-router-dom";
// import ModalDelete from "../ModalDelete";
import ModalDetail from "../ModalDetail";
import useVisitor from "../hook/useVisitors";
import { formatDate, formatDateTime } from "@/utils/formatdate";
import { useQuery } from "react-query";
import { getVisitors } from "../service";
import { toNumberFormat } from "@/utils/toNumber";
import DateTimePicker from "react-datetime-picker";
// import useInformationUser from "@/components/global/useInformationUser";

export default function TableVisitors(props) {
  const visitor = useVisitor();
  // const user = useInformationUser();

  const { isLoading, data } = useQuery(
    [
      "visitors",
      {
        page: visitor.currentPage,
        search: visitor.search,
        visitDate: visitor.visitDate,
      },
    ],
    getVisitors
  );

  // const [selectedId, setSelectedId] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [visitDate, setVisitDate] = useState("");

  // page changed
  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      visitor.setCurrentPage(page);
    },
    [visitor.currentPage]
  );

  // const bgStatus = (val) => {
  //   if (val === "pending") return "text-yellow-700 bg-yellow-100";
  //   if (val === "cancel") return "text-red-700 bg-red-100";
  //   if (val === "paid") return "text-green-700 bg-green-100";
  //   return "text-gray-700 bg-gray-100";
  // }

  const bgTicket = (val) => {
    if (val === "open") return "text-yellow-700 bg-yellow-100";
    if (val === "combo" || val === "half used") return "text-indigo-700 bg-indigo-100";
    return "text-green-700 bg-green-100";
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              visitor.setSearch(ev);
            }}
            useOnChange
          />
        </div>
        <DateTimePicker
          className="w-64"
          value={visitDate}
          onChange={(e) => setVisitDate(e)}
          format="dd/MM/yyyy HH:mm"
          clearIcon={null}
        />
        <Button
          color="gold"
          onClick={() => {
            if (visitDate) {
              visitor.setVisitDate(visitDate.toUTCString());
            }
          }}
        >
          <Search width={20} height={20} />
        </Button>
        <Button
          color="outline-gold"
          onClick={() => {
            setVisitDate("");
            visitor.setVisitDate("");
            visitor.setSearch("");
          }}
        >
          <ArrowClockwise width={20} height={20} />
        </Button>
        {/* <Link to="/dashboard/create-visitor" className="w-48">
          <Button
            className="mb-4 block sm:inline-block w-full sm:w-full"
            color="gold"
          >
            Add new
            <PlusLg className="inline-block ltr:ml-1 rtl:mr-1 bi bi-plus-lg" />
          </Button>
        </Link> */}
      </div>

      <div className="overflow-auto">
        <table className="table-sorter table-bordered-bottom w-full text-gray-500 dark:text-gray-400 dataTable-table">
          <thead>
            <tr className="!bg-secondary-color dark:bg-gray-900 dark:bg-opacity-40 rounded-2xl">
              <th>Date</th>
              <th>Visit Date</th>
              <th>Ticket ID</th>
              <th className="text-left">Event</th>
              <th className="text-left">Visitor</th>
              <th>Qty</th>
              <th>Total Price</th>
              {/* <th>Payment</th>
              <th>Status</th> */}
              <th>Ticket Status</th>
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
                      <td className="text-center">{item.isCombo ? formatDate(item.visitDate) : formatDateTime(item.visitDate)}</td>
                      <td className="text-center">{item.visitId}</td>
                      <td>{item.event}</td>
                      <td>
                        <p>{item.customer.name}</p>
                        <p>{item.customer.gender === "laki-laki" ? "L" : "P"} / <span className="capitalize">{item.customer.ageGroup}</span></p>
                        <p>{item.customer.email}</p>
                        <p>{item.customer.phone}</p>
                      </td>
                      <td className="text-center">{item.visitor}</td>
                      <td className="text-center">
                        Rp. {toNumberFormat(item.totalPrice)}
                      </td>
                      {/* <td className="text-center capitalize">{item.payment || "-"}</td>
                      <td>
                        <div
                          className={
                            `flex items-center justify-center text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full capitalize 
                            ${bgStatus(item.status)}`
                          }
                        >
                          {item.status}
                        </div>
                      </td> */}
                      <td>
                        <div
                          className={
                            `flex items-center justify-center text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full capitalize 
                            ${bgTicket(item.ticketStatus)}`
                          }
                        >
                          {item.ticketStatus}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* <Link to={`/dashboard/edit-visitor/${item._id}`}>
                            <Button color="light" size="small">
                              <PencilSquare className="inline text-primary-color" />
                            </Button>
                          </Link>
                          {user.role === "super admin" && (
                            <Button
                              color="light"
                              size="small"
                              onClick={() => {
                                visitor.setModalDelete(true);
                                setSelectedId(item._id);
                              }}
                            >
                              <Trash className="inline text-primary-color" />
                            </Button>
                          )} */}
                          <Button
                            color="light"
                            size="small"
                            onClick={() => {
                              visitor.setModalDetail(true);
                              setSelectedData(item);
                            }}
                          >
                            <InfoCircleFill className="inline text-primary-color" />
                          </Button>
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
        currentPage={visitor.currentPage}
      />

      <ModalDetail
        selected={selectedData}
        open={visitor.modalDetail}
        setOpen={() => visitor.setModalDetail(false)}
      />

      {/* <ModalDelete
        selected={selectedId}
        open={visitor.modalDelete}
        setOpen={() => visitor.setModalDelete(false)}
      /> */}
    </>
  );
}
