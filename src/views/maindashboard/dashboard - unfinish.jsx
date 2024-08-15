import { Card } from "@/components/reactdash-ui";
import TotalRevenue from "./component/Revenue";
import TotalTreatment from "./component/Treatment";
import TotalProduct from "./component/Product";
import TotalPatient from "./component/Patient";
import MonthlySales from "@/components/charts/ecommerce/MonthlySales";
import TrafficSource from "@/components/charts/ecommerce/TrafficSource";
import { useQuery } from "react-query";
import { getRevenue, getChart, getPayment, getPopular } from "./service";
import { useState, useMemo } from "react";
import SelectCustom from "@/components/reactdash-ui/forms/SelectCustom";
import { toNumberFormat } from "@/utils/toNumber";
import InputDate from "@/components/global/InputDate";

export default function MainDashboard() {
  const [filterRevenue, setFilterRevenue] = useState("today");
  const [startRevenue, setStartRevenue] = useState(new Date());
  const [endRevenue, setEndRevenue] = useState(new Date());
  const [revenueCustomDate, setRevenueCustomDate] = useState(false);

  const [chart, setFilterChart] = useState("monthly");
  const [startChart, setStartChart] = useState(new Date());
  const [endChart, setEndChart] = useState(new Date());
  const [chartCustomDate, setChartCustomDate] = useState(false);

  const [payment, setFilterPayment] = useState("this-month");
  const [startPayment, setStartPayment] = useState(new Date());
  const [endPayment, setEndPayment] = useState(new Date());
  const [paymentCustomDate, setPaymentCustomDate] = useState(false);

  const [popular, setFilterPopular] = useState("product");

  const { data: revenue, isLoading: loadingRevenue } = useQuery(
    [
      "revenues",
      {
        range: revenueCustomDate
          ? `by-date?start=${startRevenue}&end=${endRevenue}`
          : filterRevenue,
      },
    ],
    getRevenue
  );

  const { data: populars, isLoading: loadingPopulars } = useQuery(
    ["populars", { range: payment }],
    getPopular
  );
  const { data: payments, isLoading: loadingPayment } = useQuery(
    ["payments", { range: payment }],
    getPayment
  );
  const { data: charts, isLoading: loadingChart } = useQuery(
    ["charts", { range: chart }],
    getChart
  );

  const filterPopular = useMemo(() => {
    const data =
      popular === "product"
        ? populars?.data[0]?.product
        : populars?.data[0]?.treatment;
    return data;
  }, [popular, populars]);

  return (
    <div className="px-1">
      <div className="flex justify-end items-center my-5">
        <div>
          <SelectCustom
            options={[
              { title: "Perbulan", value: "this-month" },
              { title: "Perhari", value: "today" },
              { title: "Pilih tanggal", value: "custom" },
            ]}
            defaultValue={filterRevenue}
            onChange={(event) => {
              if (event.target.value !== "custom") {
                setFilterRevenue(event.target.value);
                setRevenueCustomDate(false);
                setStartRevenue(new Date());
                setEndRevenue(new Date());
              } else {
                setFilterRevenue(null);
                setRevenueCustomDate(true);
              }
            }}
          />
          {revenueCustomDate ? (
            <div className="flex space-x-2.5 items-center">
              <InputDate
                label="From"
                value={startRevenue}
                onChange={setStartRevenue}
              />
              <InputDate
                label="To"
                value={endRevenue}
                onChange={setEndRevenue}
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {loadingRevenue ? (
          <p>Please wait...</p>
        ) : (
          <>
            <TotalRevenue
              total={`Rp. ${toNumberFormat(revenue?.data[0]?.revenue)}`}
            />
            <TotalTreatment total={revenue?.data[0]?.treatment} />
            <TotalProduct total={revenue?.data[0]?.product} />
            <TotalPatient total={revenue?.data[0]?.visitor} />
          </>
        )}
      </div>
      <div className="flex justify-end items-center my-5">
        <SelectCustom
          options={[
            { title: "Perbulan", value: "monthly" },
            { title: "Perhari", value: "daily" },
          ]}
          defaultValue={chart}
          onChange={(event) => setFilterChart(event.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <MonthlySales
          title="Revenue"
          label="Revenue"
          labelRange={charts?.data[0]?.label}
          dataset={charts?.data[0]?.revenue}
        />
        <MonthlySales
          title="Patient Visit"
          label="Patient Visit"
          labelRange={charts?.data[0]?.label}
          dataset={charts?.data[0]?.visitor}
        />
        <MonthlySales
          title="Product Sales"
          label="Product Sales"
          labelRange={charts?.data[0]?.label}
          dataset={charts?.data[0]?.product}
        />
        <MonthlySales
          title="Treatment Sales"
          label="Treatment Sales"
          labelRange={charts?.data[0]?.label}
          dataset={charts?.data[0]?.treatment}
        />
      </div>
      <div className="flex justify-end items-center my-5">
        <SelectCustom
          options={[
            { title: "Perbulan", value: "this-month" },
            { title: "Perhari", value: "today" },
          ]}
          defaultValue={payment}
          onChange={(event) => setFilterPayment(event.target.value)}
        />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="overflow-auto h-full max-h-96">
          <SelectCustom
            options={[
              { title: "Best Seller Product", value: "product" },
              { title: "Best Seller Treatment", value: "treatment" },
            ]}
            defaultValue={popular}
            onChange={(event) => setFilterPopular(event.target.value)}
          />
          {filterPopular?.length < 1 ? (
            <p>No data to show for {payment}</p>
          ) : null}
          {filterPopular?.map((item, i) => {
            return (
              <div key={i} className="flex items-center justify-between mb-3.5">
                <div className="flex items-center">
                  <img
                    alt={item.name}
                    src={item.image}
                    className="object-cover mr-2 rounded-lg h-10 w-10"
                  />
                  <p>
                    {item.name} {item?.subname}
                  </p>
                </div>
                <div className="text-blue-500">
                  Rp. {toNumberFormat(item.price)}
                </div>
              </div>
            );
          })}
        </Card>
        <TrafficSource
          title="Payment Method"
          label={["Tunai", "Kartu", "Transfer"]}
          dataset={payments?.data[0]?.value}
        />
      </div>
    </div>
  );
}
