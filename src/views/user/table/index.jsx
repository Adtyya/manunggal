import React, { useState, useCallback } from "react";
import { PlusLg, PencilSquare, Trash } from "react-bootstrap-icons";
import {
  Pagination,
  Button,
  SearchForm,
} from "@/components/reactdash-ui";
import { Link } from "react-router-dom";
import ModalDelete from "../ModalDelete";
import useUser from "../hook/useUser";
import { useQuery } from "react-query";
import { getUsers } from "../service";

export default function TableUser(props) {
  const userData = useUser();
  const [selectedId, setId] = useState(null);

  const { isLoading, data } = useQuery(
    ["users", { page: userData.currentPage, search: userData.search }],
    getUsers
  );

  // page changed
  const onPageChanged = useCallback(
    (event, page) => {
      event.preventDefault();
      userData.setCurrentPage(page);
    },
    [userData.currentPage]
  );

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              userData.setSearch(ev);
            }}
            useOnChange
          />
        </div>
        <Link to="/dashboard/create-user" className="w-48">
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
              <th>Name</th>
              <th>Username</th>
              <th>Role</th>
              <th>Action</th>
            </tr>
          </thead>
          {!isLoading && data?.docs?.length < 1 ? (
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
                      <td className="w-80">
                        <p className="text-center">{item?.fullname}</p>
                      </td>
                      <td className="w-80">
                        <p className="text-center">{item?.username}</p>
                      </td>
                      <td>
                        <p className="text-center capitalize">{item?.role}</p>
                      </td>
                      <td className="text-center space-x-1.5">
                        <Link to={`/dashboard/edit-user/${item._id}`}>
                          <Button color="light" size="small">
                            <PencilSquare className="inline text-primary-color" />
                          </Button>
                        </Link>
                        {item?.role !== 'super admin' && (
                          <Button
                            color="light"
                            size="small"
                            onClick={() => {
                              userData.setModalDelete(true);
                              setId(item._id);
                            }}
                          >
                            <Trash className="inline text-primary-color" />
                          </Button>
                        )}
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
        currentPage={userData.currentPage}
      />
      <ModalDelete
        open={userData.modalDelete}
        setOpen={() => userData.setModalDelete(false)}
        selected={selectedId}
      />
    </>
  );
}
