import React, { useState } from "react";
import { X } from "react-bootstrap-icons";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import { useQueryClient } from "react-query";
import ModalBase from "@/components/global/Modal";
import {
  Alert,
  Button,
  InputLabel,
} from "@/components/reactdash-ui";

export default function ModalCategory({ open, setOpen }) {
  const client = useQueryClient();

  const [error, setError] = useState(false);
  

  const schema = yup.object().shape({
    name: yup.string().required(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  async function onSubmit(data) {
    try {
      const res = await api.post(`/product-category`, { name: data.name });
      if (res.status === 200) {
        setOpen();
        reset();
        client.invalidateQueries("categories");
      } else {
        setError(true);
      }
    } catch (error) {
      console.warn("Something went wrong");
      setError(true);
    }
  }

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="bg-white w-full max-w-md flex flex-col items-center justify-center p-3.5 rounded-lg">
        <div className="w-full text-center relative">
          <p className="font-semibold text-lg">Add New Category</p>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={() => {
              setOpen();
              setError(false);
              reset();
            }}
          >
            <X className="text-2xl" />
          </button>
        </div>
        <form
          className="w-full"
          onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
        >
          {error && (
            <div className="mt-3">
              <Alert
                color="danger"
                setState={() => setError(false)}
              >
                Terjadi kesalahan, pastikan tidak ada duplikasi.
              </Alert>
            </div>
          )}
          <div className="grid grid-cols-1 gap-2">
            <InputLabel
              name="name"
              id="name"
              label="Category Name"
              register={register}
              required
              error={errors?.name?.message}
            />
          </div>
          <div className="flex justify-center items-center mt-8 space-x-3.5">
            <Button
              color="outline-gold"
              onClick={() => {
                setOpen();
                setError(false);
                reset();
              }}
            >
              Close
            </Button>
            <Button
              type="submit"
              color="gold"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Please wait..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </ModalBase>
  );
}
