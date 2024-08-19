import React, { useState, useEffect } from "react";
import {
  ArrowUpRightSquare,
  ChevronRight,
  TicketPerforatedFill,
  Coin,
  ArchiveFill,
  CurrencyExchange,
  ArrowClockwise,
  ImageFill
} from "react-bootstrap-icons";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { getTicketsAvailable, getSummary, getChart, getMapping } from "./service";
import DatePicker from "react-date-picker";
import { toNumberFormat } from "@/utils/toNumber";
import { formatDay, formatDate } from "@/utils/formatdate";
import {
  Button, Card
} from "@/components/reactdash-ui";
import useInformationUser from "@/components/global/useInformationUser";
import GenderMapping from "./GenderMapping";
import AgeMapping from "./AgeMapping";
import VisitorChart from "./VisitorChart";

export default function MainDashboard() {
  const hook = useInformationUser();
  const today = new Date();
  const [selectedTicket, setSelectedTicket] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date(today.getFullYear(), today.getMonth(), today.getDate()));
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [dateRange, setDateRange] = useState("");
  const [filterBy, setFilterBy] = useState("this-week");
  const filterChoices = [
    { label: "This Week", value: "this-week" },
    { label: "This Month", value: "this-month" },
    { label: "This Year", value: "this-year" },
  ]

  const { data: ticket, isLoading: ticketLoading } = useQuery(
    ["ticket"],
    getTicketsAvailable
  );

  const { data: summary, isLoading: loadingSummary } = useQuery(
    [
      "summary",
      {
        filter: `?startDate=${selectedDate}${selectedTicket ? `&ticket=${selectedTicket}` : "&ticket"}`
      },
    ],
    getSummary
  );

  const { data: chart, isLoading: loadingChart } = useQuery(
    [
      "chart",
      {
        filter: `?filter=${filterBy}${dateRange}${selectedTicket ? `&ticket=${selectedTicket}` : "&ticket"}`
      },
    ],
    getChart
  );

  const { data: mapping } = useQuery(
    [
      "mapping",
      {
        filter: `?filter=${filterBy}${dateRange}${selectedTicket ? `&ticket=${selectedTicket}` : "&ticket"}&limitCity=10`
      },
    ],
    getMapping
  );

  useEffect(() => {
    if (startDate && endDate) {
      setDateRange(`&startDate=${startDate}&endDate=${endDate}`);
      setFilterBy("");
    }
  }, [startDate, endDate]);

  useEffect(() => {
    if (ticket?.docs?.length > 0) {
      const available = ticket?.docs;
      setSelectedTicket(available[available.length - 1]._id);
    }
  }, [ticketLoading]);

  return (
    <div className="w-full px-4">
      <div className="flex flex-col lg:flex-row items-center lg:justify-between gap-3 mt-3 mb-5">
        <p className="text-xl font-bold">Dashboard</p>
        <select
          className="leading-5 py-2 pl-3 pr-8 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600 select-caret appearance-none capitalize"
          onChange={(e) => setSelectedTicket(e.target.value)}
          value={selectedTicket}
        >
          <option value="">All Ticket</option>
          {ticket?.docs?.map((item, index) => {
            return (
              <option key={index} value={item._id}>
                {item.name}
              </option>
            );
          })}
        </select>
      </div>
      <Card className="w-full">
        <div className="flex flex-row items-center justify-between">
          <div>
            <p className="text-lg font-bold">Report</p>
            <p className="text-base">{selectedDate ? formatDay(selectedDate) : formatDay(today)}</p>
          </div>
          <div className="flex flex-row items-center justify-center">
            <div className="w-40">
              <DatePicker
                value={selectedDate}
                onChange={(e) => setSelectedDate(e)}
                clearIcon={null}
                format="dd/MM/yyyy"
                className="w-full"
              />
            </div>
            <Button
              color="gold"
              onClick={() => setSelectedDate(new Date(today.getFullYear(), today.getMonth(), today.getDate()))}
            >
              <ArrowClockwise width={20} height={20} />
            </Button>
          </div>
        </div>
        <hr className="my-2" />
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-5">
          <div className="hidden xl:flex flex-col xl:flex-row gap-3">
            {summary?.[0]?.ticketData?.image ? (
              <img
                className="h-52 w-52"
                src={summary?.[0]?.ticketData?.image}
                alt={summary?.[0]?.ticketData?.nama}
              />
            ) : (
              <div className="h-52 w-52 flex flex-col items-center justify-center outline outline-1 outline-primary-color">
                <ImageFill
                  width={100}
                  height={100}
                  className="text-primary-color"
                />
              </div>
            )}
            <div className="flex flex-col justify-between">
              <div>
                <a
                  href="https://www.tumurunmuseum.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-row gap-3 items-center text-primary-color"
                >
                  <ArrowUpRightSquare
                    width={18}
                    height={18}
                  />
                  Website Tumurun
                </a>
                <div className="mt-2">
                  <p className="text-lg font-bold text-primary-color">{loadingSummary ? "..." : summary?.[0]?.ticketData?.name}</p>
                  {summary?.[0]?.ticketData?.artworkBy && (
                    <p>Artwork by {summary?.[0]?.ticketData?.artworkBy}</p>
                  )}
                  {summary?.[0]?.ticketData?.curatedBy && (
                    <p>Curated by {summary?.[0]?.ticketData?.curatedBy}</p>
                  )}
                </div>
              </div>
              <Link to={summary?.[0]?.ticketData?._id ? `/dashboard/edit-ticket/${summary?.[0]?.ticketData?._id}` : "#"}>
                <Button
                  color={hook?.role !== "front office" && selectedTicket !== "" ? "gold" : "gray"}
                  className="flex flex-row gap-3 items-center"
                  disabled={hook?.role !== "front office" && selectedTicket !== "" ? false : true}
                >
                  Edit Informasi
                  <ChevronRight
                    width={18}
                    height={18}
                  />
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-5 border rounded p-5 bg-gray-50 h-24">
              <div className="flex items-center justify-center bg-secondary-color w-12 h-12 rounded-2xl">
                <TicketPerforatedFill
                  width={20}
                  height={20}
                  className="text-primary-color"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Tiket Terjual</p>
                <p className="text-xl text-primary-color font-bold">
                  {loadingSummary ? "..." : `${summary[0]?.ticket?.sales || 0} Tiket`}
                </p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5 border rounded p-5 bg-gray-50 h-24">
              <div className="flex items-center justify-center bg-orange-100 w-12 h-12 rounded-2xl">
                <Coin
                  width={20}
                  height={20}
                  className="text-orange-500"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Pendapatan Tiket</p>
                <p className="text-xl text-orange-500 font-bold">
                  {loadingSummary ? "..." : `Rp. ${toNumberFormat(summary[0]?.ticket?.revenue || 0)}`}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row items-center gap-5 border rounded p-5 bg-gray-50 h-24">
              <div className="flex items-center justify-center bg-green-100 w-12 h-12 rounded-2xl">
                <ArchiveFill
                  width={20}
                  height={20}
                  className="text-green-500"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Produk Terjual</p>
                <p className="text-xl text-green-500 font-bold">0 Produk</p>
              </div>
            </div>
            <div className="flex flex-row items-center gap-5 border rounded p-5 bg-gray-50 h-24">
              <div className="flex items-center justify-center bg-blue-100 w-12 h-12 rounded-2xl">
                <CurrencyExchange
                  width={20}
                  height={20}
                  className="text-blue-500"
                />
              </div>
              <div>
                <p className="text-sm font-semibold">Pendapatan Produk</p>
                <p className="text-xl text-blue-500 font-bold">Rp 0</p>
              </div>
            </div>
          </div>
        </div>
      </Card>
      <br />
      <Card>
        <p className="text-lg font-bold">Ringkasan Pengunjung</p>
        <p className="text-base mb-3">{`Periode: ${loadingChart ? "-" : `${formatDate(chart?.[0]?.period?.start)} - ${formatDate(chart?.[0]?.period?.end)}`}`}</p>
        <div className="flex flex-row flex-wrap items-center gap-4 mb-3">
          <div>
            {filterChoices.map((item, i) => (
              <button
                key={i}
                className={`p-3 font-semibold ${item.value === filterBy ? "bg-secondary-color text-primary-color" : "hover:bg-gray-100"}`}
                onClick={() => {
                  setFilterBy(item.value);
                  setStartDate(null);
                  setEndDate(null);
                  setDateRange("");
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="flex flex-row flex-wrap gap-1">
            <div className="w-40">
              <DatePicker
                value={startDate}
                onChange={(e) => setStartDate(e)}
                clearIcon={null}
                format="dd/MM/yyyy"
                className="w-full"
              />
            </div>
            <div className="w-40">
              <DatePicker
                value={endDate}
                onChange={(e) => setEndDate(e)}
                clearIcon={null}
                format="dd/MM/yyyy"
                className="w-full"
              />
            </div>
            <Button
              color="gold"
              onClick={() => {
                setStartDate(null);
                setEndDate(null);
                setDateRange("");
                setFilterBy("this-week");
              }}
            >
              <ArrowClockwise width={20} height={20} />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="flex flex-row items-center gap-5 border rounded p-5 bg-gray-50 h-24">
            <div className="flex items-center justify-center bg-secondary-color w-12 h-12 rounded-2xl">
              <TicketPerforatedFill
                width={20}
                height={20}
                className="text-primary-color"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Tiket Terjual</p>
              <p className="text-xl text-primary-color font-bold">
                {loadingChart ? "..." : `${chart[0]?.totalSales || 0} Tiket`}
              </p>
            </div>
          </div>
          <div className="flex flex-row items-center gap-5 border rounded p-5 bg-gray-50 h-24">
            <div className="flex items-center justify-center bg-orange-100 w-12 h-12 rounded-2xl">
              <Coin
                width={20}
                height={20}
                className="text-orange-500"
              />
            </div>
            <div>
              <p className="text-sm font-semibold">Pendapatan Tiket</p>
              <p className="text-xl text-orange-500 font-bold">
                {loadingChart ? "..." : `Rp. ${toNumberFormat(chart[0]?.totalRevenue || 0)}`}
              </p>
            </div>
          </div>
        </div>
      </Card>
      <br />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <VisitorChart
          title="Pengunjung"
          label={chart?.[0]?.label || []}
          dataset={[
            {
              title: "Penjualan Tiket",
              color: "#AC0A6D",
              data: chart?.[0]?.sales || [],
              total: chart?.[0]?.totalSales || 0
            },
          ]}
        />
        <VisitorChart
          title="Pendapatan"
          label={chart?.[0]?.label || []}
          dataset={[
            {
              title: "Pendapatan Tiket",
              color: "#F97316",
              data: chart?.[0]?.revenue || [],
              total: chart?.[0]?.totalRevenue || 0
            },
          ]}
        />
      </div>
      <br />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <GenderMapping
          title="Gender Mapping"
          label={mapping?.[0]?.gender?.label || ["Laki-laki", "Perempuan"]}
          dataset={mapping?.[0]?.gender?.value || [0, 0]}
          total={mapping?.[0]?.gender?.total || 0}
        />
        <AgeMapping
          title="Age Mapping"
          label={mapping?.[0]?.ageGroup?.label || [
            "Anak-anak (≤12 Tahun)",
            "Remaja (12-15 Tahun)",
            "Dewasa (25-45 Tahun)",
            "Lansia (≥45 Tahun)"
          ]}
          dataset={mapping?.[0]?.ageGroup?.value || [0, 0, 0, 0]}
          total={mapping?.[0]?.ageGroup?.total || 0}
        />
      </div>
      <br />
      <div className="grid grid-cols-1 gap-4">
        <AgeMapping
          title="City Mapping"
          label={mapping?.[0]?.city?.label || ["", "", "", "", "", "", "", "", "", ""]}
          dataset={mapping?.[0]?.city?.value || [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]}
          total={mapping?.[0]?.city?.total || 0}
        />
      </div>
    </div>
  );
}
