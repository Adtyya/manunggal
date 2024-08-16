import React, { useState } from "react";
// components
import {
  Alert,
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Uploader,
  Switch,
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

export default function CreateTicket() {
  const navigate = useNavigate();
  const ticket = useTicket();
  const today = new Date();

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
          <Card className="relative p-6">
            <form
              className="w-full"
              onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
            >
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
                <InputLabel
                  name="code"
                  id="name"
                  label="Prodcut Code"
                  register={register}
                  required
                  error={errors?.code?.message}
                />
                <InputLabel
                  name="name"
                  id="subname"
                  label="Product Name"
                  register={register}
                  required
                  error={errors?.name?.message}
                />
                <Textarea
                  name="description"
                  label="Description"
                  register={register}
                  required
                  error={errors?.description?.message}
                />
                <InputLabel
                  name="stock"
                  id="notes2"
                  label="Stock"
                  required
                  type="number"
                  register={register}
                  error={errors?.stock?.message}
                />

                <InputPrice
                  label="Price"
                  required
                  onChange={(val) =>
                    setValue(
                      "price",
                      parseInt(
                        val.target.value.replace("Rp.", "").replace(/\./g, "")
                      )
                    )
                  }
                  value={getValues("price")}
                />
              </div>

              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-product">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button type="submit" color="gold" disabled={isSubmitting}>
                  {isSubmitting ? "Please wait..." : "Save"}
                </Button>
              </div>
            </form>
          </Card>
        </Column>
      </Row>
    </>
  );
}
