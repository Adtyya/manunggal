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
import {
  getAgentBySearch,
  getAllAgent,
  getAllSalesContract,
  getAllSalesOrder,
  getCustomerBySearch,
  getSalesContractBySearch,
  getSOBySearch,
} from "./service";
import { useQuery } from "react-query";
import TableItems from "./table/items";
import ModalAddProduct from "./ModalAddProduct";
import NumberFormat from "@/utils/numberFormat";
import lodash from "lodash";
import ModalSetAsPaidPost from "./ModalSetAsPaidPost";
import InputPriceMod from "@/components/global/InputPriceMod";

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

  const { data: SCList, isLoading: SCLoading } = useQuery(
    ["getAllSalesContract", { page: 1, search: "" }],
    getAllSalesContract
  );

  const { data: agentList, isLoading } = useQuery(
    ["getAllCustomer", { page: 1, search: "" }],
    getAllAgent
  );

  const { data: SOList, isLoading: SOLoading } = useQuery(
    ["getAllSalesOrder", { page: 1, search: "" }],
    getAllSalesOrder
  );

  const [error, setError] = useState(false);
  const [salesDate, setSalesDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [paid, setPaid] = useState(false);

  const schema = yup.object().shape({
    orderType: yup.string().required(),
    agent: yup.string(),
    salesContract: yup.string().required(),
    customer: yup.string().required(),
    shipTo: yup.string().required(),
    replacementFor: yup.string(),
    deliveryFee: yup.number(),
    totalPrice: yup.number(),
    notes: yup.string(),
    tax: yup.number(),
    dp: yup.number(),
  });

  const defaultOptionsSC = useMemo(() => {
    return SCList?.docs?.map((item) => {
      return {
        value: item._id,
        label: `${item?.contractId} - ${item?.agent?.name}`,
        item: item.items,
        type: item.contractType,
        dp: item.dp.percentage,
        tax: item.tax.percentage,
        deliveryFee: item.deliveryFee,
        agent: item.agent._id,
      };
    });
  }, [SCList]);

  const defaultOptionsSO = useMemo(() => {
    return SOList?.docs?.map((item) => {
      return {
        value: item._id,
        label: `${item?.salesId}`,
      };
    });
  }, [SOList]);

  const defaultOptions = useMemo(() => {
    return agentList?.docs?.map((item) => {
      return {
        value: item._id,
        label: item.name,
        address: `${item.name}, ${item?.phone} - ${item?.address}`,
      };
    });
  }, [agentList]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const formState = watch();
  const price = lodash.sumBy(items, (item) => item?.price * item?.qty);

  const tax = lodash.multiply(price, formState.tax / 100);
  const dp = lodash.multiply(price, formState.dp / 100);

  async function onSubmit(data) {
    const newData = {
      ...data,
      tax: {
        percentage: formState.tax,
        amount: tax,
      },
      dp: {
        percentage: formState.dp,
        amount: dp,
      },
      items: items,
      totalPrice: price + tax + Number(formState.deliveryFee),
    };

    const res = await api.post("/sales-order", newData);
    if (res?.status === 201 || res?.status === 200) {
      navigate("/dashboard/list-sales-order");
      ticket.setSuccess(true);
    } else {
      setError(true);
    }
  }

  const payload = {
    ...formState,
    tax: {
      percentage: formState.tax,
      amount: tax,
    },
    dp: {
      percentage: formState.dp,
      amount: dp,
    },
    items: items,
    totalPrice: price + tax + Number(formState.deliveryFee),
  };

  const promiseReplacement = async (q) => {
    const res = await getSOBySearch(q);
    return res.docs?.map((item) => {
      return {
        value: item._id,
        label: `${item?.contractId}`,
      };
    });
  };

  const promise = async (q) => {
    const res = await getCustomerBySearch(q);
    return res.docs?.map((item) => {
      return {
        value: item._id,
        label: item.name,
        address: `${item.name}, ${item?.phone} - ${item?.address}`,
      };
    });
  };

  const promiseSC = async (q) => {
    const res = await getSalesContractBySearch(q);
    return res.docs?.map((item) => {
      return {
        value: item._id,
        label: `${item?.contractId} - ${item?.agent?.name}`,
        item: item.items,
        type: item.contractType,
        dp: item.dp.percentage,
        tax: item.tax.percentage,
        deliveryFee: item.deliveryFee,
        agent: item.agent._id,
      };
    });
  };

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">Create Sales Order</p>
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
                  <div className="w-full">
                    <label className="inline-block mb-2">
                      Sales Contract No.
                      <span className="text-red-500">*</span>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      loadOptions={promiseSC}
                      defaultOptions={defaultOptionsSC}
                      className="w-full pb-4"
                      styles={style}
                      onChange={(event) => {
                        setValue("salesContract", event.value);
                        setItems(event.item);
                        setValue("orderType", event.type);
                        setValue("dp", event.dp);
                        setValue("tax", event.tax);
                        setValue("deliveryFee", event.deliveryFee);
                        setValue("agent", event.agent);
                      }}
                      noOptionsMessage={() => "Data not found"}
                    />
                  </div>
                  <Select
                    name="orderType"
                    label="Order Type"
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
                    showInitialValue
                  />
                  <div className="w-full">
                    <label className="inline-block mb-2">
                      Replacement For SO
                    </label>
                    <AsyncSelect
                      cacheOptions
                      loadOptions={promiseReplacement}
                      defaultOptions={defaultOptionsSO}
                      className="w-full pb-4"
                      styles={style}
                      onChange={(event) =>
                        setValue("replacementFor", event.value)
                      }
                      noOptionsMessage={() => "Data not found"}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="w-full">
                    <label className="inline-block mb-2">
                      Customer
                      <span className="text-red-500">*</span>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      loadOptions={promise}
                      defaultOptions={defaultOptions}
                      className="w-full pb-4"
                      styles={style}
                      onChange={(event) => setValue("customer", event.value)}
                      noOptionsMessage={() => "Data not found"}
                    />
                  </div>
                  <div className="w-full">
                    <label className="inline-block mb-2">
                      Ship To
                      <span className="text-red-500">*</span>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      loadOptions={promise}
                      defaultOptions={defaultOptions}
                      className="w-full pb-4"
                      styles={style}
                      onChange={(event) => setValue("shipTo", event.address)}
                      noOptionsMessage={() => "Agent not found"}
                    />
                  </div>
                </div>
              </Card>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="col-auto md:col-span-2">
                  <TableItems
                    // setOpen={() => setOpen(true)}
                    items={items}
                    // setItems={setItems}
                  />
                </Card>
                <Card className="col-auto md:col-span-1">
                  <Textarea
                    name="notes"
                    label="Order Notes"
                    register={register}
                    error={errors?.notes?.message}
                  />
                </Card>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <InputPriceMod
                      label="Delivery Fee"
                      placeholder="0"
                      onChange={(val) =>
                        setValue(
                          "deliveryFee",
                          parseInt(
                            val.target.value
                              .replace("Rp.", "")
                              .replace(/\./g, "")
                          )
                        )
                      }
                      value={formState.deliveryFee}
                    />
                    <InputLabel
                      label="Tax (percent)"
                      type="number"
                      name="tax"
                      register={register}
                      placeholder="0"
                    />
                    <InputLabel
                      label="Dp (percent)"
                      type="number"
                      name="dp"
                      register={register}
                      placeholder="0"
                    />
                  </div>
                </Card>
                <Card className="w-full">
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Delivery Fee</p>
                    <p className="font-bold">
                      : {`${NumberFormat(formState.deliveryFee || 0)}`}
                    </p>
                  </div>

                  <div className="grid grid-cols-2">
                    <p className="font-medium">Tax</p>
                    <p className="font-bold">
                      :{" "}
                      {`${NumberFormat(formState?.tax || 0)}% - ${NumberFormat(
                        tax?.toFixed(0) || 0
                      )}`}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Total Contract Amount</p>
                    <p className="font-bold">
                      :{" "}
                      {NumberFormat(
                        price + Number(formState.deliveryFee || 0) + tax
                      )}
                    </p>
                  </div>
                  <div className="grid grid-cols-2">
                    <p className="font-medium">Dp</p>
                    <p className="font-bold">
                      :{" "}
                      {`${NumberFormat(formState?.dp || 0)}% - ${NumberFormat(
                        dp?.toFixed(0) || 0
                      )}`}
                    </p>
                  </div>
                </Card>
              </div>

              <ModalAddProduct
                open={open}
                setOpen={() => setOpen(false)}
                setItems={setItems}
              />
              <ModalSetAsPaidPost
                open={paid}
                setOpen={setPaid}
                data={payload}
              />

              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-sales-order">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button
                  type="button"
                  color="gold"
                  onClick={() => setPaid(true)}
                  disabled={items.length === 0}
                >
                  {"Save & Set as paid"}
                </Button>
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
