import React, { useMemo, useState, useEffect } from "react";
// components
import {
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Select
} from "@/components/reactdash-ui";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import useVisitor from "./hook/useVisitors";
import { Alert } from "@/components/reactdash-ui";
import { Link } from "react-router-dom";
import InputPrice from "@/components/global/InputPrice";
import AsyncSelect from "react-select/async";
import InputDate from "@/components/global/InputDate";
import { getVisitorsById } from "./service";
import { getAvailableTickets } from "../tickets/service";

const schema = yup.object().shape({
  visitDate: yup.date().required(),
  customerName: yup.string().required(),
  customerEmail: yup.string(),
  customerPhone: yup.string(),
  customerGender: yup.string(),
  customerAge: yup.string(),
  event: yup.string(),
  ticket: yup.string().required(),
  visitor: yup.number().required(),
  price: yup.number().required(),
  totalPrice: yup.number().required(),
  status: yup.string(),
  payment: yup.string(),
  ticketStatus: yup.string(),
});

export default function EditVisitor() {
  const param = useParams();
  const visitor = useVisitor();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: visit, isLoading } = useQuery(
    ["visitorById", { id: param.id }],
    getVisitorsById
  );

  const initializeValue = useMemo(() => {
    if (!isLoading && visit) {
      setSelectedDate(new Date(visit.visitDate));
      return {
        visitDate: new Date(visit.visitDate),
        customerName: visit.customer.name,
        customerEmail: visit.customer.email,
        customerPhone: visit.customer.phone,
        customerGender: visit.customer.gender,
        customerAge: visit.customer.ageGroup,
        event: visit.event,
        ticket: visit.ticket,
        visitor: visit.visitor,
        price: visit.price,
        totalPrice: visit.totalPrice,
        status: visit.status,
        payment: visit.payment,
        ticketStatus: visit.ticketStatus,
      };
    }
    return null;
  }, [visit, isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initializeValue,
  });

  const currentData = watch();


  useEffect(() => {
    if (initializeValue) {
      Object.keys(initializeValue).forEach((key) => {
        setValue(key, initializeValue[key]);
      });
    }
  }, [initializeValue, setValue]);

  const generateTimes = useMemo(() => {
    const generateOptions = () => {
      const startHour = 10;
      const endHour = 18;
      const recommendations = [];

      const currentDate = new Date(selectedDate);
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.toLocaleString("default", {
        month: "long",
      });
      const currentDay = currentDate.getDate();

      for (let hour = startHour; hour <= endHour; hour++) {
        const timestamp = new Date(
          currentYear,
          currentDate.getMonth(),
          currentDay,
          hour,
          0
        );
        const option = {
          title: `${currentDay} ${currentMonth} ${hour}:00`,
          value: timestamp,
        };
        recommendations.push(option);
      }

      return recommendations;
    }

    return generateOptions();

  }, [selectedDate, initializeValue, isLoading]);

  useEffect(() => {
    setValue("totalPrice", Number(currentData.price) * Number(currentData.visitor));
  }, [currentData.visitor]);

  const { data: ticket, isLoading: loadingTickets } = useQuery(
    "tickets",
    getAvailableTickets
  );

  const defaultOptions = useMemo(() => {
    return ticket?.docs?.map((item) => {
      return { value: item._id, label: item.name, price: item.price };
    });
  }, [ticket]);

  const promise = async (q) => {
    const res = await getAvailableTickets({ page: 1, search: q });
    return res?.docs?.map((item) => {
      return { value: item._id, label: item.name, price: item.price };
    });
  };

  const style = {
    control: (base) => ({
      ...base,
      // This line disable the blue border
      boxShadow: "none",
    }),
  };

  async function onSubmit(data) {
    try {
      const objData = {
        visitDate: data.visitDate,
        customer: {
          name: data.customerName,
          email: data.customerEmail,
          phone: data.customerPhone,
          gender: data.customerGender,
          ageGroup: data.customerAge,
          address: ""
        },
        event: data.event,
        ticket: data.ticket,
        visitor: data.visitor,
        price: data.price,
        totalPrice: data.totalPrice,
        status: data.status,
        payment: data.payment,
        ticketStatus: data.ticketStatus,
      }

      await api.patch(`/visit/${param.id}`, objData);
      navigate("/dashboard/list-visitors");
      visitor.setEdit(true);
    } catch (error) {
      console.warn("Something went wrong");
      setError(true);
    }
  }

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Edit Visitor</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error && (
            <Alert color="danger">
              Terjadi kesalahan saat mengedit data. Mohon coba beberapa saat
              lagi
            </Alert>
          )}
          <Card className="relative p-6">
            {isLoading || loadingTickets ? (
              <p>Loading...</p>
            ) : (
              <form
                className="w-full"
                onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
                  <div>
                    <InputDate
                      label="Select Date"
                      value={selectedDate}
                      onChange={(e) => {
                        setSelectedDate(e);
                        setValue("visitDate", null);
                      }}
                      required
                    />
                    <Select
                      label="Select Times"
                      name="visitDate"
                      register={register}
                      className="w-full"
                      options={generateTimes.map((item) => {
                        return { title: item.title, value: item.value };
                      })}
                      required
                    />
                    <div className="w-full mb-1.5">
                      <label className="inline-block">
                        Ticket
                        <span className="text-red-500">*</span>
                      </label>
                      <AsyncSelect
                        cacheOptions
                        loadOptions={promise}
                        defaultOptions={defaultOptions}
                        defaultValue={{ value: visit.ticket, label: visit.event, price: visit.price }}
                        className="w-full py-2"
                        styles={style}
                        onChange={(event) => {
                          setValue("ticket", event.value);
                          setValue("event", event.label);
                          setValue("price", event.price);
                          setValue("totalPrice", Number(event.price) * Number(currentData.visitor));
                        }}
                        noOptionsMessage={() => "Ticket not found"}
                      />
                    </div>
                    {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5"> */}
                    <InputPrice
                      label="Price"
                      required
                      disabled
                      value={currentData.price}
                    />
                    <InputLabel
                      name="visitor"
                      id="visitor"
                      label="Qty"
                      register={register}
                      type="number"
                      required
                      min={1}
                      error={errors?.visitor?.message}
                    />
                    {/* </div> */}
                    <InputPrice
                      label="Total Price"
                      required
                      disabled
                      value={currentData.totalPrice}
                    />
                  </div>
                  <div>
                    <InputLabel
                      name="customerName"
                      id="customerName"
                      label="Name"
                      register={register}
                      required
                      error={errors?.customerName?.message}
                    />
                    <InputLabel
                      name="customerEmail"
                      id="customerEmail"
                      label="Email"
                      type="email"
                      register={register}
                      error={errors?.customerEmail?.message}
                    />
                    <InputLabel
                      name="customerPhone"
                      id="customerPhone"
                      label="Phone"
                      register={register}
                      error={errors?.customerPhone?.message}
                    />
                    <Select
                      label="Gender"
                      name="customerGender"
                      register={register}
                      options={[
                        {
                          title: "L",
                          value: "laki-laki",
                        },
                        {
                          title: "P",
                          value: "perempuan",
                        },
                      ]}
                      required
                    />
                    <Select
                      label="Age Group"
                      name="customerAge"
                      register={register}
                      options={[
                        {
                          title: "Dewasa",
                          value: "dewasa",
                        },
                        {
                          title: "Remaja",
                          value: "remaja",
                        },
                        {
                          title: "Lansia",
                          value: "lansia",
                        },
                        {
                          title: "Anak-anak",
                          value: "anak-anak",
                        },
                      ]}
                      required
                    />
                  </div>
                  <div>
                    <Select
                      label="Status"
                      name="status"
                      register={register}
                      options={[
                        {
                          title: "Paid",
                          value: "paid",
                        },
                        {
                          title: "Pending",
                          value: "pending",
                        },
                        {
                          title: "Cancel",
                          value: "cancel",
                        },
                        // {
                        //   title: "Refund",
                        //   value: "refund",
                        // },
                      ]}
                      required
                    />
                    <Select
                      label="Payment"
                      name="payment"
                      register={register}
                      options={[
                        {
                          title: "Cash",
                          value: "cash",
                        },
                        {
                          title: "Bank Transfer",
                          value: "bank transfer",
                        },
                        {
                          title: "E-Wallet",
                          value: "e-wallet",
                        },
                        {
                          title: "Online Payment",
                          value: "online payment",
                        },
                        // {
                        //   title: "Credit Card",
                        //   value: "credit card",
                        // },
                      ]}
                      required
                    />
                    <Select
                      label="Ticket Status"
                      name="ticketStatus"
                      register={register}
                      options={[
                        {
                          title: "Used",
                          value: "used",
                        },
                        {
                          title: "Open",
                          value: "open",
                        },
                      ]}
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-end items-center space-x-3.5 mt-8">
                  <Link to="/dashboard/list-visitors">
                    <Button color="outline-gold">Back</Button>
                  </Link>
                  <Button type="submit" color="gold" disabled={isSubmitting}>
                    {isSubmitting ? "Please wait..." : "Save"}
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </Column>
      </Row>
    </>
  );
}
