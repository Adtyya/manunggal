import React, { useState, useCallback } from "react";
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
} from "@/components/reactdash-ui";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import DatePicker from "react-date-picker";
import { api } from "@/utils/axios";
import { formatDate } from "@/utils/formatdate";
import { useNavigate } from "react-router-dom";
import SimpleMDE from "react-simplemde-editor";
import useTicket from "./hook/useTickets";
import { Link } from "react-router-dom";
import PreviewImage from "@/components/global/PreviewImage";
import InputPrice from "@/components/global/InputPrice";
import { Trash, PlusLg } from "react-bootstrap-icons";

export default function CreateTicket() {
  const navigate = useNavigate();
  const ticket = useTicket();

  const [error, setError] = useState(false);
  const [available, setAvailable] = useState(true);

  const schema = yup.object().shape({
    name: yup.string().required(),
    phone: yup.string().required(),
    email: yup.string().email().required(),
    address: yup.string(),
    isAvailable: yup.bool(),
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
    data.isActive = available;
    const res = await api.post("/customer", data);
    if (res?.status === 201 || res?.status === 200) {
      navigate("/dashboard/list-customer");
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
          <p className="text-xl font-bold mt-3 mb-5">Create Customer</p>
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
                  name="name"
                  id="name"
                  label="Name"
                  register={register}
                  required
                  error={errors?.name?.message}
                />
                <InputLabel
                  name="phone"
                  id="subname"
                  label="Phone"
                  register={register}
                  required
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  error={errors?.phone?.message}
                />
                <InputLabel
                  name="email"
                  type="email"
                  id="notes1"
                  label="Email"
                  register={register}
                  required
                  error={errors?.email?.message}
                />
                <Textarea
                  name="address"
                  id="notes2"
                  label="Address"
                  register={register}
                  error={errors?.address?.message}
                />
                <div className="flex justify-between items-center w-fit space-x-4">
                  <p>Active</p>
                  <Switch
                    onChange={() => setAvailable((prev) => !prev)}
                    checked={available}
                  />
                </div>
              </div>

              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-customer">
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
