import React, { useMemo, useState, useEffect } from "react";
// components
import {
  Row,
  Column,
  Card,
  Button,
  InputLabel,
} from "@/components/reactdash-ui";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { getVariantsById } from "./service";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { api } from "@/utils/axios";
import useVariant from "./hook/useVariants";
import { Alert } from "@/components/reactdash-ui";
import { Trash } from "react-bootstrap-icons";

export default function EditVariant() {
  const param = useParams();
  const variant = useVariant();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery(
    ["variantById", { id: param.id }],
    getVariantsById
  );

  const [error, setError] = useState(false);
  const [list, setList] = useState([""]);

  const schema = yup.object().shape({
    name: yup.string().required(),
  });

  const initializeValue = useMemo(() => {
    if (!isLoading && data) {
      setList(data?.options || [""]);
      return {
        name: data.name,
      };
    }
    return null;
  }, [data, isLoading]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initializeValue,
  });

  useEffect(() => {
    if (initializeValue) {
      Object.keys(initializeValue).forEach((key) => {
        setValue(key, initializeValue[key]);
      });
    }
  }, [initializeValue, setValue]);

  const updateOption = (val, idx) => {
    setList(prevList => {
      const newList = [...prevList];
      newList[idx] = val;
      return newList;
    });
  };

  async function onSubmit(data) {
    try {
      const objData = {
        name: data.name,
        options: list
      };

      await api.patch(`/variant/${param.id}`, objData);
      navigate("/dashboard/list-variants");
      variant.setEdit(true);
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
          <p className="text-xl font-bold mt-3 mb-5">Edit Variant</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error ? (
            <Alert color="danger">
              Terjadi kesalahan saat membuat variant baru. Mohon coba beberapa
              saat lagi
            </Alert>
          ) : null}
          <Card className="relative p-6">
            <form
              className="w-full"
              onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
            >
              <div className="grid grid-cols-12 gap-5">
                <div className="col-span-full lg:col-span-6">
                  <InputLabel
                    name="name"
                    id="name"
                    label="Name"
                    register={register}
                    required
                    error={errors?.name?.message}
                  />
                  <div className="mb-4">
                    <label className="inline-block mb-2">Options</label>
                    <div className="flex flex-col gap-4">
                      {list.map((item, i) => (
                        <div key={i} className="flex flex-row justify-center items-center gap-2">
                          <input
                            placeholder="Option"
                            className="w-full leading-5 py-2 px-4 rounded text-gray-800 bg-white border border-gray-300 overflow-x-auto focus:outline-none focus:border-gray-400 focus:ring-0 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-700 dark:focus:border-gray-600"
                            value={item}
                            onChange={(e) => updateOption(e.target.value, i)}
                            required
                          />
                          {list.length > 1 && (
                            <button
                              className="p-1 h-6 rounded bg-primary-color text-white"
                              title="Delete"
                              type="button"
                              onClick={() => setList(prev => prev.filter((_, index) => i !== index))}
                            >
                              <Trash />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-center my-3">
                      <span
                        className="text-primary-color hover:underline hover:cursor-pointer"
                        onClick={() => setList(prev => [...prev, ""])}
                      >
                        + Add Variant
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-variants">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button
                  type="submit"
                  color="gold"
                  disabled={isSubmitting || list.length === 0}
                >
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
