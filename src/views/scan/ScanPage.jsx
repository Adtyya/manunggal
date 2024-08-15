import React, { useState, useRef, useEffect } from "react";
// components
import {
  Alert,
  Row,
  Column,
  Card,
  Button,
} from "@/components/reactdash-ui";
import { Search } from "react-bootstrap-icons";
import { formatDate, formatDateTime } from "@/utils/formatdate";
import { api } from "@/utils/axios";
import { toNumberFormat } from "@/utils/toNumber";
import LoadingIcon from "@/components/sidebar/icons/loading";

export default function ScanPage() {

  const [searchId, setSearchId] = useState("");
  const [exist, setExist] = useState({});
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const [loadingValidate, setLoadingValidate] = useState(false);
  const [success, setSuccess] = useState(false);
  const [failed, setFailed] = useState(false);
  const [canValidate, setCanValidate] = useState(true);

  const scanRef = useRef(null);

  const bgTicket = (val) => {
    if (val === "open") return "text-yellow-700 bg-yellow-100";
    if (val === "combo" || val === "half used") return "text-indigo-700 bg-indigo-100";
    return "text-green-700 bg-green-100";
  }

  const handleSearch = async (id) => {
    setSuccess(false);
    setFailed(false);
    setLoading(true);
    const res = await api.get(`/visit/scan/${id}`);
    if (res.data && res.data.status === "paid") {
      setExist(res.data);
      setNotFound(false);
    } else {
      setNotFound(true);
      setExist({});
    }
    setLoading(false);
  }

  const handleValidate = async (id) => {
    setLoadingValidate(true);
    let ticketStatus = "used";
    const today = new Date();
    if (exist?.isCombo && exist?.ticketStatus === "open") {
      ticketStatus = "combo";
    }
    const res = await api.patch(`/visit/${id}`, { scanDate: today, ticketStatus });
    if (res.status === 200) {
      setSuccess(true);
      setExist((prev) => ({ ...prev, scanDate: today, ticketStatus }));
    } else {
      setFailed(true);
    }
    setLoadingValidate(false);
  }

  useEffect(() => {
    if (exist && exist?.isCombo && exist?.scanDate && exist?.ticketStatus === "combo") {
      const currDate = new Date();
      const nextScan = new Date(exist?.scanDate);
      // nextScan.setHours(nextScan.getHours() + 1);
      nextScan.setMinutes(nextScan.getMinutes() + 30);
      if (currDate.toISOString() >= nextScan.toISOString()) {
        setCanValidate(true);
      } else {
        setCanValidate(false);
      }
    }
  }, [exist]);

  useEffect(() => {
    setTimeout(() => {
      setSuccess(false);
      setFailed(false);
    }, 6000);
  }, [success, failed]);

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Scan QR</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          <Card>
            <div className="flex flex-col sm:flex-row sm:justify-start gap-3">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSearch(searchId);
                }}
                className="w-full"
              >
                <div className="flex flex-wrap items-stretch w-full relative">
                  <input
                    type="text"
                    className="flex-shrink flex-grow max-w-full leading-5 relative text-sm py-2 px-4 ltr:rounded-l rtl:rounded-r text-gray-800 bg-gray-100 overflow-x-auto focus:outline-none border border-gray-100 focus:border-gray-200 focus:ring-0 dark:text-gray-400 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                    placeholder="Search Ticket ID…"
                    aria-label="Search"
                    autoFocus
                    value={searchId}
                    ref={scanRef}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(e.target.value)
                      }
                    }}
                  />
                  <div className="flex -mr-px">
                    <button
                      className="flex items-center py-2 px-4 ltr:-ml-1 rtl:-mr-1 ltr:rounded-r rtl:rounded-l leading-5 text-gray-500 bg-gray-100 focus:outline-none focus:ring-0"
                      type="submit"
                    >
                      <Search />
                    </button>
                  </div>
                </div>
              </form>
              <Button
                className="mb-4 block sm:inline-block"
                color="gold"
                onClick={() => {
                  setSearchId("");
                  setExist({});
                  setNotFound(false);
                  setSuccess(false);
                  setFailed(false);
                  if (scanRef.current) {
                    scanRef.current.focus();
                  }

                }}
              >
                Clear
              </Button>
            </div>
            {notFound && (
              <Alert color="danger" setState={() => setNotFound(false)}>
                Data tidak ditemukan!
              </Alert>
            )}
          </Card>
          <br />
          <Card className="relative p-6">
            <form
              className="w-full"
              onSubmit={(e) => {
                e.preventDefault();
                handleValidate(exist?._id);
              }}
            >
              <p className="text-center text-xl font-bold mt-3 mb-5">Detail Pengunjung</p>
              {success && (
                <Alert color="success" setState={() => setSuccess(false)}>
                  Validasi data sukses!
                </Alert>
              )}
              {failed && (
                <Alert color="danger" setState={() => setFailed(false)}>
                  Validasi data gagal!
                </Alert>
              )}
              <p className="flex flex-row font-bold mt-3 mb-5 gap-1">
                Ticket Status:
                {loading ? (
                  <LoadingIcon width={30} height={30} />
                ) : (
                  <span className={`flex items-center justify-center text-sm px-2 py-1 font-semibold leading-tight text-center rounded-full capitalize ${exist?.ticketStatus ? bgTicket(exist?.ticketStatus) : ""}`}>
                    {exist?.ticketStatus || "-"}
                  </span>
                )}
              </p>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm">Ticket ID</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold">{exist?.visitId || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm">Event</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold">{exist?.event || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm">Visit Date</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      exist?.isCombo ? (
                        <p className="font-bold">{exist?.visitDate ? `${formatDate(exist?.visitDate)} | Valid for 7 Days` : "-"}</p>
                      ) : (
                        <p className="font-bold">{exist?.visitDate ? formatDateTime(exist?.visitDate) : "-"}</p>
                      )
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm">Jumlah</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold">{exist?.visitor || "-"}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm">Nama</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold">{exist?.customer?.name || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm">Gender / Usia</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold capitalize">{exist?.customer?.gender ? `${exist?.customer?.gender} / ${exist?.customer?.ageGroup}` : "-"}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm">Email</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold">{exist?.customer?.email || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm">Phone</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold">{exist?.customer?.phone || "-"}</p>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-5">
                  <div>
                    <h3 className="text-sm">Status</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold capitalize">{exist?.status || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm">Payment</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold capitalize">{exist?.payment || "-"}</p>
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm">Total Price</h3>
                    {loading ? (
                      <LoadingIcon width={30} height={30} />
                    ) : (
                      <p className="font-bold capitalize">{exist?.totalPrice >= 0 ? `Rp. ${toNumberFormat(exist?.totalPrice)}` : "-"}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center space-x-3.5 mt-8">
                <Button
                  type="submit"
                  color={exist && (exist.ticketStatus === "open" || exist.ticketStatus === "combo") && canValidate ? "gold" : "gray"}
                  disabled={exist && (exist.ticketStatus === "open" || exist.ticketStatus === "combo") && canValidate && !loadingValidate ? false : true}
                >
                  {loadingValidate ? "Please wait..." : "Validate"}
                </Button>
              </div>
            </form>
          </Card>
        </Column>
      </Row>
    </>
  );
}
