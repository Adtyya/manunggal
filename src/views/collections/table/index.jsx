import React, { useState, useCallback, useRef } from "react";
import {
  PlusLg,
  PencilSquare,
  Trash,
  Printer,
  Download,
} from "react-bootstrap-icons";
import { Pagination, Button, SearchForm } from "@/components/reactdash-ui";
import { Link } from "react-router-dom";
import ModalDelete from "../ModalDelete";
import useCollection from "../hook/useCollections";
import { formatDate } from "@/utils/formatdate";
import { useQuery } from "react-query";
import { getCollections } from "../service";
import useInformationUser from "@/components/global/useInformationUser";
import { useReactToPrint } from "react-to-print";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";

export default function TableCollections(props) {
  const collection = useCollection();
  const user = useInformationUser();
  const ref = useRef();
  const [printContent, setPrintContent] = useState({});

  const handlePrint = useReactToPrint({
    content: () => ref.current,
    documentTitle: "Collection QR",
  });

  const { isLoading, data } = useQuery(
    [
      "collections",
      {
        page: collection.currentPage,
        search: collection.search,
      },
    ],
    getCollections
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
      collection.setCurrentPage(page);
    },
    [collection.currentPage]
  );

  const handleDownloadImage = async (by, title) => {
    const element = document.getElementById("qrimage"),
      canvas = await html2canvas(element),
      data = canvas.toDataURL("image/jpg"),
      link = document.createElement("a");

    link.href = data;
    link.download = `${title} - ${by}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:justify-start mb-3 space-x-3.5">
        <div className="w-full">
          <SearchForm
            setOnSearch={(ev) => {
              collection.setSearch(ev);
            }}
            useOnChange
          />
        </div>
        <Link to="/dashboard/create-collection" className="w-48">
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
              <th className="text-left w-96">Title</th>
              {/* <th className="text-left w-96">Notes</th> */}
              <th className="text-left">Artwork By</th>
              <th>Type</th>
              <th>Category</th>
              <th>Year</th>
              <th>Status</th>
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
                        <div className="flex flex-wrap flex-row items-center">
                          <div className="self-center hidden md:block">
                            <img
                              className="h-8 w-10"
                              src={item.image}
                              alt={item.title}
                            />
                          </div>
                          <div className="leading-5 dark:text-gray-300 flex-1 ltr:ml-2 rtl:mr-2">
                            {item.title}
                          </div>
                        </div>
                      </td>
                      {/* <td>
                        <p dangerouslySetInnerHTML={{ __html: item.notes.replace(/\r\n/g, '<br />').replace(/\n/g, '<br />') }} />
                      </td> */}
                      <td>{item.artworkBy}</td>
                      <td className="capitalize text-center">
                        {item?.collectionType || "-"}
                      </td>
                      <td className="capitalize text-center">
                        {item?.category || "-"}
                      </td>
                      <td className="text-center">{item?.year || "-"}</td>
                      <td>
                        <div
                          className={`flex items-center justify-center text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full capitalize 
                            ${bgStatus(item.isActive)}`}
                        >
                          {item.isActive ? "Active" : "Not Active"}
                        </div>
                      </td>
                      <td className="text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/dashboard/edit-collection/${item._id}`}>
                            <Button color="light" size="small">
                              <PencilSquare className="inline text-primary-color" />
                            </Button>
                          </Link>
                          <Button
                            color="light"
                            size="small"
                            onClick={() => {
                              setPrintContent(item);
                              setTimeout(() => {
                                // handlePrint();
                                handleDownloadImage(
                                  item?.artworkBy,
                                  item?.title
                                );
                              }, 0);
                            }}
                          >
                            <Download className="inline text-primary-color" />
                          </Button>
                          {user.role === "super admin" && (
                            <Button
                              color="light"
                              size="small"
                              onClick={() => {
                                collection.setModalDelete(true);
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
        currentPage={collection.currentPage}
      />

      <ModalDelete
        selected={selectedId}
        open={collection.modalDelete}
        setOpen={() => collection.setModalDelete(false)}
      />
      <div className="overflow-hidden">
        <div id="qrimage" className="absolute -right-96 top-0">
          <PrintUI
            ref={ref}
            artistName={printContent?.artworkBy}
            name={printContent?.title}
            notes={printContent?.notes}
            subtitle={printContent?.subtitle}
            slug={printContent?.slug}
          />
        </div>
      </div>
    </>
  );
}

const PrintUI = React.forwardRef(
  ({ artistName, name, notes, subtitle, slug }, ref) => {
    return (
      <div className="w-full h-full p-5" ref={ref}>
        <div className="flex items-center justify-center">
          <QRCodeSVG
            height={250}
            width={250}
            value={`https://www.tumurunmuseum.org/collection/${slug}`}
          />
        </div>
      </div>
    );
  }
);
