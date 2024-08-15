import React, { useState, useEffect } from "react";
// components
import {
  Row,
  Column,
  Card,
  Button,
  InputLabel,
  Select as SelectDefault,
} from "@/components/reactdash-ui";
import { useForm } from "react-hook-form";
import Select from "react-select";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { api } from "@/utils/axios";
import { useNavigate, Link } from "react-router-dom";
import useOrder from "./hook/useOrders";
import { Alert } from "@/components/reactdash-ui";
import InputPrice from "@/components/global/InputPrice";
import { toNumberFormat } from "@/utils/toNumber";
import ModalAddProduct from "./ModalProductAdd";
import ModalPaid from "./ModalPaid";
import region from "@/utils/region.json";

export default function CreateOrder() {
  const order = useOrder();
  const navigate = useNavigate();

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [list, setList] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  const schema = yup.object().shape({
    name: yup.string().required(),
    email: yup.string(),
    phone: yup.string(),
    province: yup.string(),
    city: yup.string(),
    subdistrict: yup.string(),
    address: yup.string(),
    addressDetail: yup.string(),
    zipCode: yup.string(),
    discountPercentage: yup.string(),
    discountAmount: yup.number(),
    payment: yup.string(),
    status: yup.string(),
    isOnline: yup.bool(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch
  } = useForm({
    resolver: yupResolver(schema),
  });

  const currData = watch();

  useEffect(() => {
    setValue("discountAmount", (Number(subtotal) * Number(currData?.discountPercentage || 0)) / 100);
  }, [currData.discountPercentage, subtotal]);

  const calculateSubtotal = () => {
    let subtotal = 0;
    if (list.length > 0) {
      list.forEach(item => {
        subtotal += (item.price - item.discount.amount) * item.qty;
      });
    }
    return subtotal;
  };

  useEffect(() => {
    setSubtotal(calculateSubtotal());
  }, [list]);

  const objData = {
    customer: {
      name: currData.name,
      email: currData.email,
      phone: currData.phone,
      province: currData.province,
      city: currData.city,
      subdistrict: currData.subdistrict,
      zipCode: currData.zipCode,
      address: currData.address,
      addressDetail: currData.addressDetail,
    },
    items: list.map(item => ({
      id: item.id,
      name: item.name,
      image: item.image,
      category: item.category,
      variant: item.variant,
      subvariant: item.subvariant,
      qty: item.qty,
      price: item.price,
      discount: {
        percentage: item?.discount?.percentage || 0,
        amount: item?.discount?.amount || 0
      }
    })),
    discount: {
      percentage: Number(currData.discountPercentage),
      amount: currData.discountAmount,
    },
    totalPrice: subtotal - currData.discountAmount,
    payment: currData?.payment || "cash"
  };

  async function onSubmit() {
    try {

      await api.post("/order", objData);
      navigate("/dashboard/list-orders");
      order.setSuccess(true);
    } catch (error) {
      console.warn("Something went wrong");
      setError(true);
    }
  }

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: state.isDisabled ? 'rgb(239 240 254)' : provided.backgroundColor,
      borderColor: state.isDisabled ? 'rgb(224 224 252)' : 'rgb(224 224 252)',
    }),
    singleValue: (provided, state) => ({
      ...provided,
      color: state.isDisabled ? 'rgb(20 20 48)' : 'rgb(20 20 48)',
    }),
    valueContainer: (provided, state) => ({
      ...provided,
      padding: '2px 14px'
    }),
  };

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Create Order</p>
        </Column>
      </Row>

      {/* content  */}
      <Row>
        <Column className="w-full px-4">
          {error ? (
            <Alert color="danger">
              {errorMessage
                ? errorMessage
                : `Terjadi kesalahan saat mengedit order. Mohon coba beberapa
              saat lagi`}
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
                  <InputLabel
                    name="email"
                    id="email"
                    label="Email"
                    register={register}
                    error={errors?.email?.message}
                  />
                  <InputLabel
                    name="phone"
                    id="phone"
                    label="Phone"
                    register={register}
                    error={errors?.phone?.message}
                  />
                  <div className="w-full mb-4">
                    <label className="inline-block mb-2">Province</label>
                    <Select
                      styles={customStyles}
                      options={region.map((item) => (
                        { value: item.provinsi, label: item.provinsi }
                      ))}
                      value={{ value: currData.province, label: currData.province }}
                      onChange={(e) => {
                        setValue("province", e.label);
                        setValue("city", "");
                        setValue("subdistrict", "");
                      }}
                    />
                  </div>
                  <div className="w-full mb-4">
                    <label className="inline-block mb-2">City</label>
                    <Select
                      styles={customStyles}
                      options={region.find((item) => item.provinsi === currData.province)?.kota?.map((field) => (
                        { value: field, label: field }
                      ))}
                      value={{ value: currData.city, label: currData.city }}
                      onChange={(e) => {
                        setValue("city", e.label);
                        setValue("subdistrict", "");
                      }}
                    />
                  </div>
                  <InputLabel
                    name="subdistrict"
                    id="subdistrict"
                    label="Subdistrict"
                    register={register}
                    error={errors?.subdistrict?.message}
                  />
                  <InputLabel
                    name="zipCode"
                    id="zipCode"
                    label="Postal Code"
                    register={register}
                    error={errors?.zipCode?.message}
                  />
                  <InputLabel
                    name="address"
                    id="address"
                    label="Address"
                    register={register}
                    error={errors?.address?.message}
                  />
                  <InputLabel
                    name="addressDetail"
                    id="addressDetail"
                    label="Address Detail (Optional)"
                    register={register}
                    error={errors?.addressDetail?.message}
                  />
                </div>
                <div className="col-span-full lg:col-span-6">
                  <div className="mb-4">
                    <p>List of Order</p>
                    <div className="overflow-x-auto">
                      <table width="100%">
                        <thead>
                          <tr>
                            <td className="text-center px-2 py-4 bg-secondary-color border-b-2 border-pink-300">
                              Product
                            </td>
                            <td className="text-center px-2 py-4 bg-secondary-color border-b-2 border-pink-300">
                              Price
                            </td>
                            <td className="text-center px-2 py-4 bg-secondary-color border-b-2 border-pink-300">
                              Qty
                            </td>
                            <td className="text-center px-2 py-4 bg-secondary-color border-b-2 border-pink-300">
                              Subtotal
                            </td>
                            <td className="text-center px-2 py-4 bg-secondary-color border-b-2 border-pink-300">
                              Action
                            </td>
                          </tr>
                        </thead>
                        <tbody>
                          {list.length > 0 ? (
                            list.map((item, i) => (
                              <tr key={i}>
                                <td>
                                  <div className="flex flex-wrap flex-row items-center gap-2 py-2">
                                    <div className="hidden md:block">
                                      <img
                                        className="h-8 w-8"
                                        src={item.image}
                                        alt={item.name}
                                      />
                                    </div>
                                    <div className="flex flex-col">
                                      <span>{item.name}</span>
                                      {item.variant && (
                                        <span className="text-sm italic">
                                          {`${item.variant} ${item.subvariant}`}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </td>
                                <td align="center">Rp. {toNumberFormat(item.price - item.discount.amount)}</td>
                                <td align="center">{item.qty}</td>
                                <td align="center">Rp. {toNumberFormat((item.price - item.discount.amount) * item.qty)}</td>
                                <td align="center">
                                  <div className="flex justify-center items-center gap-1">
                                    <button
                                      className="p-1 h-6 rounded bg-pink-300 text-primary-color"
                                      title="Edit"
                                      type="button"
                                    >
                                      <PencilSquare />
                                    </button>
                                    <button
                                      className="p-1 h-6 rounded bg-primary-color text-white"
                                      title="Delete"
                                      type="button"
                                      onClick={() => setList(prev => prev.filter((_, index) => i !== index))}
                                    >
                                      <Trash />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td className="p-2 border-b-2 border-gray-300 text-center" colSpan={5}><em>No data</em></td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                      <div className="flex justify-center my-3">
                        <span
                          className="text-primary-color hover:underline hover:cursor-pointer"
                          onClick={() => {
                            order.setModalAddProduct(true);
                          }}
                        >
                          + Add Product
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="mb-2 capitalize">Discount %</label>
                    <div className="flex flex-row gap-2">
                      <InputLabel
                        className="mt-2"
                        name="discountPercentage"
                        id="discountPercentage"
                        register={register}
                        type="number"
                        error={errors?.discountPercentage?.message}
                        min={0}
                        max={100}
                      />
                      <InputPrice
                        disabled
                        value={currData.discountAmount}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold">Subtotal</label>
                    <span className="font-bold">Rp. {toNumberFormat(subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold">Discount</label>
                    <span className="font-bold">-Rp. {toNumberFormat(currData?.discountAmount || 0)}</span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold">Total</label>
                    <span className="font-bold">Rp. {toNumberFormat(subtotal - (currData?.discountAmount || 0))}</span>
                  </div>
                  <div className="flex flex-row gap-2">
                    <SelectDefault
                      label="Payment"
                      id="payment"
                      name="payment"
                      register={register}
                      className="w-full mt-5"
                      options={[
                        { title: "Cash", value: "cash" },
                        { title: "Bank Transfer", value: "bank transfer" },
                        { title: "Online Payment", value: "online payment" },
                        { title: "E-wallet", value: "e-wallet" },
                      ]}
                    />
                    {/* <SelectDefault
                      label="Status"
                      id="status"
                      name="status"
                      register={register}
                      className="w-full mt-5"
                      showInitialValue
                      options={[
                        { title: "Pending", value: "pending" },
                        { title: "Paid", value: "paid" },
                        { title: "Refund", value: "refund" },
                        { title: "Cancel", value: "cancel" },
                      ]}
                    /> */}
                  </div>
                </div>
              </div>
              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-orders">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button
                  className="capitalize"
                  color="gold"
                  onClick={() => order.setModalPaid(true)}
                  disabled={
                    list.length === 0 ||
                    currData.name === "" ||
                    isSubmitting
                  }
                >
                  Set as Paid
                </Button>
                <Button
                  type="submit"
                  color="gold"
                  disabled={
                    list.length === 0 ||
                    currData.name === "" ||
                    isSubmitting
                  }
                >
                  {isSubmitting ? "Please wait..." : "Save"}
                </Button>
              </div>
            </form>
          </Card>
        </Column>
      </Row>

      <ModalAddProduct
        open={order.modalAddProduct}
        setOpen={() => order.setModalAddProduct(false)}
        items={list}
        setItems={setList}
      />

      <ModalPaid
        open={order.modalPaid}
        setOpen={() => order.setModalPaid(false)}
        id={null}
        currentData={objData}
        setError={setError}
        setErrorMessage={setErrorMessage}
      />
    </>
  );
}
