import React, { useState, useMemo, useEffect } from "react";
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
import { useParams } from "react-router-dom";
import { getUserById } from "./service";
import { useQuery } from "react-query";

const schema = yup.object().shape({
  fullname: yup.string().required(),
  role: yup.string().required().notOneOf(["Select"]),
  email: yup.string().email(),
  phone: yup.string(),
  username: yup.string().required(),
  password: yup.string(),
});

export default function CreateUser() {
  const user = useUser();
  const param = useParams();
  const [error, setError] = useState(false);
  const [active, setActive] = useState(true);

  const { data, isLoading } = useQuery(
    ["userDetail", { id: param.id }],
    getUserById
  );

  const initializeValue = useMemo(() => {
    if (!isLoading && data) {
      return {
        fullname: data?.fullname,
        role: data?.role,
        email: data?.email,
        phone: data?.phone,
        username: data?.username,
        password: data?.displayPass,
      };
    }
  }, [data, isLoading]);

  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (initializeValue) {
      setActive(data?.isActive);
      Object.keys(initializeValue).forEach((key) => {
        setValue(key, initializeValue[key]);
      });
    }
  }, [initializeValue, setValue]);

  async function onSubmit(data) {
    data.isActive = active;
    const res = await api.patch(`/user/${param.id}`, data);
    if (
      res?.status === 201 ||
      res?.status === 200 ||
      res?.status === 200
    ) {
      user.setEdit(true);
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
          <p className="text-xl font-bold mt-3 mb-5">Edit User</p>
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
                      title: "Front Office",
                      value: "front office",
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
                  type="password"
                  register={register}
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
                  {isSubmitting ? "Please wait..." : "Update data"}
                </Button>
              </div>
            </form>
          </Card>
        </Column>
      </Row>
    </>
  );
}
