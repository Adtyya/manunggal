import React, { useState, useEffect } from "react";
import { BoxArrowInRight } from "react-bootstrap-icons";
import {
  Button,
  Heading,
  InputLabel,
  InputPassword,
  Alert,
} from "@/components/reactdash-ui";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { signin } from "./service";
import useAuth from "./hook/useAuth";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@uidotdev/usehooks";
import useInformationUser from "@/components/global/useInformationUser";

const schema = yup.object().shape({
  username: yup.string().required(),
  password: yup.string().min(6).max(32).required(),
});

export default function SignIn() {
  const auth = useAuth();
  const navigate = useNavigate();
  const hook = useInformationUser();

  const [key, setAccess] = useLocalStorage("token", null);
  const [loading, setLoading] = useState(false);
  const [openMessage, setOpenMessage] = useState("");
  const [message, setMessage] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (hook.role) {
      if (hook.role !== "front office") {
        navigate("/dashboard/main");
      } else {
        navigate("/dashboard/scan-qr");
      }
    }
  }, [hook]);


  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await signin(data);
      if (res?.message === "Login Successful") {
        if (res?.accessToken) {
          auth.setAccessToken(res?.accessToken);
          setAccess(res?.accessToken);
        }
        if (res?.user?.role !== "front office") {
          navigate("/dashboard/main");
        } else {
          navigate("/dashboard/scan-qr");
        }
      }
      if (res?.message) {
        setOpenMessage(true);
        setMessage(res?.message);
      }
    } catch (error) {
      console.warn("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      <div className="min-h-screen w-full sm:w-2/4 xl:w-1/3">
        <div className="max-w-full w-full h-full px-6 sm:px-12 bg-white dark:bg-gray-800 shadow-lg">
          <div className="p-6 sm:p-8">
            <Heading variant="h3" className="text-center">
              Login
            </Heading>
            <hr className="block w-12 h-0.5 mx-auto my-5 bg-primary-color border-primary-color" />
            {openMessage && <Alert color="danger" setState={() => setOpenMessage(false)}>{message}</Alert>}
            <form onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}>
              <InputLabel
                type="text"
                name="username"
                label="Username"
                register={register}
              />
              <div className="mb-4">
                <div className="flex flex-row justify-between items-center mb-2">
                  <label htmlFor="inputpass" className="inline-block">
                    Password
                  </label>
                </div>
                <InputPassword type="password" name="password" register={register} />
              </div>

              <div className="grid">
                <Button color="gold" type="submit" disabled={loading}>
                  {loading ? (
                    "Please wait"
                  ) : (
                    <>
                      <BoxArrowInRight className="inline-block w-4 h-4 ltr:mr-2 rtl:ml-2" />
                      Login
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="min-h-screen sm:w-2/4 xl:w-2/3"
        style={{
          backgroundImage: "url('/img/auth/cover.jpg')",
          backgroundColor: "#ffffff",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div className="min-h-screen w-full bg-black bg-opacity-20" />
      </div>
    </div>
  );
}
