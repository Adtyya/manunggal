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

export default function ModalProductEdit({ state, open, setOpen, setItems }) {
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
  const [qty, setQty] = useState(state?.qty || 0);

  const [selectedVariant, setSelectedVariant] = useState("");
  const [selectedSubvariant, setSelectedSubvariant] = useState("");

  const schema = yup.object().shape({
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

  useEffect(() => {
    setValue("qty", state?.qty);
  }, [state]);

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
      id: state?.id,
      name: state?.name,
      image: state?.image,
      category: state?.category,
      variant: state?.variant,
      subvariant: state?.subvariant,
      price: state?.price,
      qty: data?.qty,
      discount: {
        percentage: state?.discountPercentage || 0,
        amount: state?.discountAmount || 0,
      },
    };
    setItems((prev) =>
      prev.map((item) =>
        item.id === objData.id ? { ...item, ...objData } : item
      )
    );

    handleClose();
  }

  console.log(state);

  const getStock = useMemo(() => {
    const get = products?.docs?.filter((val) => val._id === state?.id)[0];

    const isMultipleVariant = get?.variantLabel?.length === 2;
    const isSingleVariant = get?.variantLabel?.length === 1;

    const getStockMultipleVariant = get?.variant
      ?.filter(
        (val) => val.name?.toLowerCase() === state?.variant?.toLowerCase()
      )[0]
      ?.subvariant?.filter(
        (val) => val?.name?.toLowerCase() === state?.subvariant?.toLowerCase()
      )[0]?.stock;

    const getStockSingleVariant = get?.variant?.filter(
      (val) => val.name?.toLowerCase() === state?.variant?.toLowerCase()
    )[0]?.stock;

    return isMultipleVariant
      ? getStockMultipleVariant
      : isSingleVariant
      ? getStockSingleVariant
      : get?.variantLabel.length === 0
      ? get?.stock
      : 0;
  }, [currData.id, state]);

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
              <InputLabel
                name="Name"
                value={state.name}
                label="Name"
                disabled
              />
            </div>
            <InputLabel
              label="Variant"
              value={state?.variant || "-"}
              disabled
            />
            <InputLabel
              label="Subvariant"
              value={state?.subvariant || "-"}
              disabled
            />
            <InputPrice
              label="Price"
              value={state.price * currData?.qty}
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
              value={state.price * currData?.qty}
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
