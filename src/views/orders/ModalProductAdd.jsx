import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useQuery } from "react-query";
import { getAvailableProducts } from "./service";
import ModalBase from "@/components/global/Modal";
import { X } from "react-bootstrap-icons";
import Select from "react-select";
import { InputLabel, Button } from "@/components/reactdash-ui";
import InputPrice from "@/components/global/InputPrice";

export default function ModalProductAdd({ open, setOpen, setItems }) {
  const { data: products } = useQuery(
    [
      "products",
      {
        page: 1,
        limit: 50,
      },
    ],
    getAvailableProducts
  );

  const [variantLabel, setVariantLabel] = useState([]);
  const [variantList, setVariantList] = useState([]);

  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSubvariant, setSelectedSubvariant] = useState("");

  const schema = yup.object().shape({
    id: yup.string().required(),
    name: yup.string().required(),
    price: yup.number().required(),
    discountPercentage: yup.number(),
    discountAmount: yup.number(),
    qty: yup.number().required(),
    image: yup.string(),
    category: yup.string(),
    variant: yup.string(),
    subvariant: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const currData = watch();

  const isActive = (i, val) => {
    if (i === 0 && val === selectedVariant) {
      return "bg-primary-color text-white";
    }
    if (i === 1 && val === selectedSubvariant) {
      return "bg-primary-color text-white";
    }
    return "outline outline-1 outline-primary-color text-black";
  };

  const handleClose = () => {
    setOpen();
    reset();
    setSelectedVariant("");
    setSelectedSubvariant("");
    setVariantLabel([]);
    setVariantList([]);
  };

  async function onSubmit(data) {
    const objData = {
      id: data.id,
      name: data.name,
      image: data.image,
      category: data.category,
      variant: selectedVariant,
      subvariant: selectedSubvariant,
      price: data.price,
      qty: data.qty,
      discount: {
        percentage: data.discountPercentage,
        amount: data.discountAmount,
      },
    };

    setItems((prev) => [...prev, objData]);

    handleClose();
  }

  const getStock = useMemo(() => {
    const get = products?.docs?.filter((val) => val._id === currData?.id)[0];

    const isMultipleVariant = get?.variantLabel?.length === 2;
    const isSingleVariant = get?.variantLabel?.length === 1;

    const getStockMultipleVariant = get?.variant
      ?.filter(
        (val) => val.name?.toLowerCase() === selectedVariant.toLowerCase()
      )[0]
      ?.subvariant?.filter(
        (val) => val?.name?.toLowerCase() === selectedSubvariant?.toLowerCase()
      )[0]?.stock;

    const getStockSingleVariant = get?.variant?.filter(
      (val) => val.name?.toLowerCase() === selectedVariant.toLowerCase()
    )[0]?.stock;

    return isMultipleVariant
      ? getStockMultipleVariant
      : isSingleVariant
      ? getStockSingleVariant
      : get?.variantLabel.length === 0
      ? get?.stock
      : 0;
  }, [currData.id, selectedVariant, selectedSubvariant]);

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="w-full max-w-md rounded-lg bg-white p-3.5">
        <div className="w-full text-center relative">
          <p className="font-semibold text-lg">Modal Product</p>
          <button
            className="absolute right-0 top-1/2 -translate-y-1/2"
            onClick={() => handleClose()}
          >
            <X className="text-2xl" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}>
          <div className="grid grid-cols-1 gap-3">
            <div>
              <label className="inline-block mb-2">
                Name
                <span className="text-red-500">*</span>
              </label>
              <Select
                options={products?.docs?.map((item) => {
                  return {
                    value: item._id,
                    label: item.name,
                    image: item.image,
                    category: item.category,
                    price: item.price,
                    discountPercentage: item.discount.percentage,
                    discountAmount: item.discount.amount,
                    variantLabel: item.variantLabel,
                    variant: item.variant,
                  };
                })}
                onChange={(e) => {
                  setSelectedVariant("");
                  setSelectedSubvariant("");
                  setValue("id", e.value);
                  setValue("name", e.label);
                  setValue("image", e.image);
                  setValue("category", e.category);
                  setValue("price", e.price);
                  setValue("discountPercentage", e.discountPercentage);
                  setValue("discountAmount", e.discountAmount);
                  setVariantLabel(e.variantLabel);
                  setVariantList(e.variant);
                }}
              />
            </div>
            <div className="flex flex-col gap-3 mb-3">
              {variantLabel.length > 0 &&
                variantLabel.map((item, i) => (
                  <div key={i}>
                    <label>{item.name}</label>
                    <div>
                      <div className="flex flex-row flex-wrap gap-3">
                        {item.options.map((op, n) => (
                          <div
                            key={n}
                            className={`text-center py-2 px-4 rounded cursor-pointer ${isActive(
                              i,
                              op
                            )}`}
                            onClick={() =>
                              i === 0
                                ? setSelectedVariant(op)
                                : setSelectedSubvariant(op)
                            }
                          >
                            <div className="flex flex-row items-center gap-2">
                              <span>{op}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
            <InputPrice
              label="Price"
              value={(currData?.price || 0) - (currData?.discountAmount || 0)}
              disabled
            />
            <InputLabel
              name="qty"
              label="Qty"
              type="number"
              required
              min={1}
              max={getStock}
              register={register}
            />
            <InputPrice
              label="Subtotal"
              value={
                ((currData?.price || 0) - (currData?.discountAmount || 0)) *
                (currData?.qty || 0)
              }
              disabled
            />
          </div>
          <div className="flex justify-center items-center mt-5 space-x-3.5">
            <Button color="outline-gold" onClick={() => handleClose()}>
              Cancel
            </Button>
            <Button color="gold" type="submit">
              {isSubmitting ? "Please wait..." : "Save"}
            </Button>
          </div>
        </form>
      </div>
    </ModalBase>
  );
}
