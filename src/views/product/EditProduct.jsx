import React, { useMemo, useState, useEffect } from "react";
// components
import {
  Alert,
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Switch,
  Textarea,
  Select,
} from "@/components/reactdash-ui";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { getTicketsById } from "./service";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import useTicket from "./hook/useTickets";
import { Link } from "react-router-dom";
import InputPrice from "@/components/global/InputPrice";
import { data } from "./data";

export default function EditTicket() {
  const param = useParams();
  const ticket = useTicket();
  const navigate = useNavigate();

  const { data: datas, isLoading } = useQuery(
    ["productById", { id: param.id }],
    getTicketsById
  );

  const [error, setError] = useState(false);

  const schema = yup.object().shape({
    code: yup.string().required(),
    name: yup.string().required(),
    description: yup.string().required(),
    stock: yup.number().required(),
    unit: yup.string(),
    price: yup.string().required(),
  });

  const initializeValue = useMemo(() => {
    if (!isLoading && datas) {
      return {
        name: datas.name,
        code: datas.code,
        description: datas.description,
        stock: datas.stock,
        unit: datas.unit.toLowerCase(),
        price: datas.price,
      };
    }
    return null;
  }, [datas, isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (initializeValue) {
      Object.keys(initializeValue).forEach((key) => {
        setValue(key, initializeValue[key]);
      });
    }
  }, [initializeValue, setValue]);

  async function onSubmit(data) {
    const res = await api.patch(`/product/${param.id}`, data);
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
          <p className="text-xl font-bold mt-3 mb-5">Edit Product</p>
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
              <div className="grid grid-cols-2 gap-5">
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
                <Select
                  name="unit"
                  label="Unit"
                  options={data}
                  required
                  register={register}
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
