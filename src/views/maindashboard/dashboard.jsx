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
      <div className="mt-3 mb-5">
        <p className="text-xl font-bold">Dashboard</p>
      </div>
    </div>
  );
}
