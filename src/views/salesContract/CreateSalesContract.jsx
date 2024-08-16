import React, { useState, useMemo } from "react";
// components
import {
  Alert,
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Textarea,
  Select,
} from "@/components/reactdash-ui";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import { useNavigate } from "react-router-dom";
import useTicket from "./hook/useTickets";
import { Link } from "react-router-dom";
import InputPrice from "@/components/global/InputPrice";
import InputDate from "@/components/global/InputDate";
import AsyncSelect from "react-select/async";
import { getAgentBySearch, getAllAgent } from "./service";
import { useQuery } from "react-query";
import TableItems from "./table/items";

const style = {
  control: (base) => ({
    ...base,
    // This line disable the blue border
    boxShadow: "none",
  }),
};

export default function CreateTicket() {
  const navigate = useNavigate();
  const ticket = useTicket();
  const today = new Date();

  const { data: agentList, isLoading } = useQuery(
    ["getAllAgent", { page: 1, search: "" }],
    getAllAgent
  );

  const [error, setError] = useState(false);
  const [contractDate, setContractDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );

  const schema = yup.object().shape({
    contractType: yup.string().required(),
    agent: yup.string().required(),
    deliveryFee: yup.number().required(),
    totalPrice: yup.number().required(),
    notes: yup.string(),
    payment: yup.string().required(),
  });

  const defaultOptions = useMemo(() => {
    return agentList?.docs?.map((item) => {
      return { value: item._id, label: item.name };
    });
  }, [agentList]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    data.unit.toLowerCase();
    const res = await api.post("/product", data);
    if (res?.status === 201 || res?.status === 200) {
      navigate("/dashboard/list-product");
      ticket.setSuccess(true);
    } else {
      setError(true);
    }
  }

  const promise = async (q) => {
    const res = await getAgentBySearch(q);
    return res.docs?.map((item) => {
      return { value: item._id, label: item.name };
    });
  };

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Create Sales Contract</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error && (
            <Alert color="danger">
              Terjadi kesalahan saat membuat data baru. Mohon coba beberapa saat
              lagi
            </Alert>
          )}
          <div className="relative p-6">
            <form
              className="w-full space-y-5"
              onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
            >
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Select
                    name="contractType"
                    label="Contract Type"
                    options={[
                      {
                        title: "Export",
                        value: "EXPORT",
                      },
                      {
                        title: "Local",
                        value: "LOCAL",
                      },
                      {
                        title: "Kaber",
                        value: "KABER",
                      },
                      {
                        title: "Stock Order",
                        value: "STOCK ORDER",
                      },
                      {
                        title: "AFVAL",
                        value: "AFVAL",
                      },
                    ]}
                    required
                    register={register}
                  />
                  <InputDate
                    label="Select Contract Date"
                    value={contractDate}
                    onChange={(e) => setContractDate(e)}
                    required
                  />
                  <div className="w-full">
                    <label className="inline-block mb-2">
                      Agent
                      <span className="text-red-500">*</span>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      loadOptions={promise}
                      defaultOptions={defaultOptions}
                      className="w-full pb-4"
                      styles={style}
                      onChange={(event) => setValue("agent", event.value)}
                      noOptionsMessage={() => "Agent not found"}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <TableItems />
              </Card>
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  <Textarea
                    name="note"
                    label="Contract Notes"
                    register={register}
                    required
                    error={errors?.notes?.message}
                  />
                  <Select
                    name="payment"
                    label="Payment Type"
                    options={[
                      {
                        title: "Cash",
                        value: "cash",
                      },
                      {
                        title: "Bank Transaction",
                        value: "bank transaction",
                      },
                    ]}
                    required
                    register={register}
                    error={errors?.payment?.message}
                  />
                </div>
              </Card>

              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-product">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button type="submit" color="gold" disabled={isSubmitting}>
                  {isSubmitting ? "Please wait..." : "Save"}
                </Button>
              </div>
            </form>
          </div>
        </Column>
      </Row>
    </>
  );
}
