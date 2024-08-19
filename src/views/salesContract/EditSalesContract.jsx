import React, { useState, useMemo, useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import useTicket from "./hook/useTickets";
import { Link } from "react-router-dom";
import InputDate from "@/components/global/InputDate";
import AsyncSelect from "react-select/async";
import {
  getAgentById,
  getAgentBySearch,
  getAllAgent,
  getSalesContractById,
} from "./service";
import { useQuery } from "react-query";
import TableItems from "./table/items";
import ModalAddProduct from "./ModalAddProduct";
import NumberFormat from "@/utils/numberFormat";
import lodash from "lodash";
import ModalSetAsPaid from "./ModalSetAsPaid";

const style = {
  control: (base) => ({
    ...base,
    // This line disable the blue border
    boxShadow: "none",
  }),
};

export default function EditSalesContract() {
  const navigate = useNavigate();
  const ticket = useTicket();
  const param = useParams();
  const today = new Date();

  const { data: agentList, isLoading } = useQuery(
    ["getAllAgent", { page: 1, search: "" }],
    getAllAgent
  );

  const { data: salesContract, isLoading: loadingSalesContract } = useQuery(
    ["getSalesContractById", { id: param.id }],
    getSalesContractById
  );

  const [error, setError] = useState(false);
  const [contractDate, setContractDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), today.getDate())
  );
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [paid, setPaid] = useState(false);

  const schema = yup.object().shape({
    contractType: yup.string().required(),
    agent: yup.string().required(),
    deliveryFee: yup.number().required(),
    totalPrice: yup.number(),
    notes: yup.string(),
    payment: yup.string().required(),
    tax: yup.number(),
    dp: yup.number(),
  });

  const defaultOptions = useMemo(() => {
    return agentList?.docs?.map((item) => {
      return { value: item._id, label: item.name };
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

  const initializeValue = useMemo(() => {
    if (!loadingSalesContract && salesContract) {
      setItems(salesContract.items);
      setContractDate(salesContract.contractDate);
      return {
        contractType: salesContract?.contractType,
        agent: salesContract?.agent?._id,
        agentName: salesContract?.agent?.name,
        deliveryFee: salesContract?.deliveryFee,
        totalPrice: salesContract?.totalPrice,
        notes: salesContract?.notes,
        payment: salesContract?.payment,
        tax: salesContract?.tax.percentage,
        dp: salesContract?.dp.percentage,
      };
    }
    return null;
  }, [salesContract, loadingSalesContract]);

  useEffect(() => {
    if (initializeValue) {
      Object.keys(initializeValue).forEach((key) => {
        setValue(key, initializeValue[key]);
      });
    }
  }, [initializeValue, setValue]);

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
      contractDate: contractDate,
    };

    const res = await api.patch(`/sales-contract/${param.id}`, newData);
    if (res?.status === 201 || res?.status === 200) {
      navigate("/dashboard/list-sales-contract");
      ticket.setEdit(true);
    } else {
      setError(true);
    }
  }

  const promise = async (q) => {
    const res = await getAgentBySearch(q);
    return res.docs?.map((item) => {
      return { value: item._id, label: item.name };
    });
  };

  if (isLoading || loadingSalesContract) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <p className="capitalize">Loading sales contract...</p>
      </div>
    );
  }

  return (
    <>
      {/* page title  */}
      <Row>
        <Column className="w-full md:w-1/2 px-4">
          <p className="text-xl font-bold mt-3 mb-5">
            Edit Sales Contract - {salesContract?.contractId}
          </p>
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
                  <Select
                    name="contractType"
                    label="Contract Type"
                    disabled
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
                  <InputDate
                    label="Select Contract Date"
                    value={contractDate}
                    onChange={(e) => setContractDate(e)}
                    required
                  />
                  <div className="w-full">
                    <label className="inline-block mb-2">
                      Agent
                      <span className="text-red-500">*</span>
                    </label>
                    <AsyncSelect
                      cacheOptions
                      loadOptions={promise}
                      defaultOptions={defaultOptions}
                      className="w-full pb-4"
                      styles={style}
                      value={{
                        value: formState.agent,
                        label: formState.agentName,
                      }}
                      onChange={(event) => {
                        setValue("agent", event.value);
                        setValue("agentName", event.label);
                      }}
                      noOptionsMessage={() => "Agent not found"}
                    />
                  </div>
                </div>
              </Card>
              <Card>
                <TableItems
                  setOpen={() => setOpen(true)}
                  items={items}
                  setItems={setItems}
                />
              </Card>
              <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Textarea
                    name="notes"
                    label="Contract Notes"
                    register={register}
                    required
                    error={errors?.notes?.message}
                  />
                  <Select
                    name="payment"
                    label="Payment Type"
                    showInitialValue
                    options={[
                      {
                        title: "Cash",
                        value: "cash",
                      },
                      {
                        title: "Bank Transaction",
                        value: "bank transaction",
                      },
                    ]}
                    required
                    register={register}
                    error={errors?.payment?.message}
                  />
                </div>
              </Card>
              <div className="grid grid-cols-2 gap-5">
                <Card>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    <InputLabel
                      label="Delivery Fee"
                      type="number"
                      name="deliveryFee"
                      register={register}
                      required
                      placeholder="0"
                    />
                    <InputLabel
                      label="Tax (percent)"
                      type="number"
                      name="tax"
                      register={register}
                      required
                      placeholder="0"
                    />
                    <InputLabel
                      label="Dp (percent)"
                      type="number"
                      name="dp"
                      register={register}
                      required
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
                        price + Number(formState.deliveryFee) + tax
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

              <ModalSetAsPaid
                open={paid}
                setOpen={setPaid}
                selected={salesContract?._id}
              />

              <div className="flex justify-end items-center mt-8 space-x-3.5">
                <Link to="/dashboard/list-sales-contract">
                  <Button color="outline-gold">Back</Button>
                </Link>
                <Button
                  type="button"
                  color="gold"
                  onClick={() => setPaid(true)}
                >
                  {isSubmitting ? "Please wait..." : "Set as paid"}
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
