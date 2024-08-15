import React, { useState, useCallback } from "react";
import {
  // PlusLg,
  // PencilSquare,
  // Trash,
  // InfoCircleFill,
  Search,
  ArrowClockwise,
} from "react-bootstrap-icons";
import {
  Pagination,
  Button,
  SearchForm,
} from "@/components/reactdash-ui";
// import { Link } from "react-router-dom";
// import ModalDetail from "../ModalDetail";
import ModalFollowUp from "../ModalFollowUp";
import usePendingVisitor from "../hook/usePendingVisitors";
import { formatDate, formatDateTime } from "@/utils/formatdate";
import { useQuery } from "react-query";
import { getPendingVisitors } from "../service";
import { toNumberFormat } from "@/utils/toNumber";
import DateTimePicker from "react-datetime-picker";
// import useInformationUser from "@/components/global/useInformationUser";

export default function TableVisitors(props) {
  const pendingVisitor = usePendingVisitor();
  // const user = useInformationUser();

  const { isLoading, data } = useQuery(
    [
      "pendingVisitors",
      {
        page: pendingVisitor.currentPage,
        search: pendingVisitor.search,
        visitDate: pendingVisitor.visitDate,
      },
    ],
    getPendingVisitors
  );

  const [selectedId, setSelectedId] = useState(null);
  // const [selectedData, setSelectedData] = useState(null);
  const [visitDate, setVisitDate] = useState("");

  // page changed
  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      pendingVisitor.setCurrentPage(page);
    },
    [pendingVisitor.currentPage]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              pendingVisitor.setSearch(ev);
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
              pendingVisitor.setVisitDate(visitDate.toUTCString());
            }
          }}
        >
          <Search width={20} height={20} />
        </Button>
        <Button
          color="outline-gold"
          onClick={() => {
            setVisitDate("");
            pendingVisitor.setVisitDate("");
            pendingVisitor.setSearch("");
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
              <th className="text-left">Event</th>
              <th className="text-left">Visitor</th>
              <th>Qty</th>
              <th>Total Price</th>
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
                      <td className="text-center">{formatDateTime(item.visitDate)}</td>
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
                                pendingVisitor.setModalDelete(true);
                                setSelectedId(item._id);
                              }}
                            >
                              <Trash className="inline text-primary-color" />
                            </Button>
                          )} */}
                          <Button
                            color="gold"
                            size="small"
                            onClick={() => {
                              pendingVisitor.setModalFollowUp(true);
                              setSelectedId(item._id);
                            }}
                            title="Info"
                          >
                            Follow Up
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
        currentPage={pendingVisitor.currentPage}
      />

      <ModalFollowUp
        selected={selectedId}
        open={pendingVisitor.modalFollowUp}
        setOpen={() => pendingVisitor.setModalFollowUp(false)}
      />

      {/* <ModalDelete
        selected={selectedId}
        open={pendingVisitor.modalDelete}
        setOpen={() => pendingVisitor.setModalDelete(false)}
      /> */}
    </>
  );
}
