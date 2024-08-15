import React, { useState } from "react";
// components
import {
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Select,
  Switch,
  InputPassword,
} from "@/components/reactdash-ui";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import { Link, useNavigate } from "react-router-dom";
import useUser from "./hook/useUser";
import { Alert } from "@/components/reactdash-ui";

const schema = yup.object().shape({
  fullname: yup.string().required(),
  role: yup.string().required().notOneOf(["Select"]),
  email: yup.string().email(),
  phone: yup.string(),
  username: yup.string().required(),
  password: yup.string().required().min("6", "Minimum 6 karakter"),
});

export default function CreateUser() {
  const user = useUser();
  const [error, setError] = useState(false);
  const [active, setActive] = useState(true);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    data.isActive = active;
    const res = await api.post("/user", data);
    if (res?.status === 201 || res?.status === 200) {
      user.setSuccess(true);
      navigate("/dashboard/list-users");
    } else {
      setError(true);
    }
  }

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Create User</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error ? (
            <Alert color="danger">
              Terjadi kesalahan saat membuat produk baru. Mohon coba beberapa
              saat lagi
            </Alert>
          ) : null}
          <Card className="relative p-6">
            <form
              className="w-full"
              onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-4">
                <InputLabel
                  label="Full Name"
                  required
                  name="fullname"
                  register={register}
                />
                <Select
                  label="role"
                  name="role"
                  options={[
                    {
                      title: "Super Admin",
                      value: "super admin",
                    },
                    {
                      title: "Admin",
                      value: "admin",
                    },
                    {
                      title: "Sales",
                      value: "sales",
                    },
                  ]}
                  register={register}
                  required
                />
                <InputLabel
                  label="Email"
                  name="email"
                  type="email"
                  register={register}
                />
                <InputLabel
                  label="Phone"
                  // required
                  onKeyPress={(event) => {
                    if (!/[0-9]/.test(event.key)) {
                      event.preventDefault();
                    }
                  }}
                  name="phone"
                  register={register}
                />
                <InputLabel
                  label="Username"
                  name="username"
                  register={register}
                  required
                />
                <InputPassword
                  label="Password"
                  name="password"
                  register={register}
                  required
                  error={errors?.password?.message}
                />
              </div>
              <div className="flex justify-end items-center mt-8 mb-4 space-x-5">
                <p>Active</p>
                <Switch onChange={() => setActive(!active)} checked={active} />
              </div>
              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-users">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button color="gold" type="submit" disabled={isSubmitting}>
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
