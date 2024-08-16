import { useMemo, useState } from "react";
import ModalBase from "@/components/global/Modal";
import { Button, Card, InputLabel, Textarea } from "@/components/reactdash-ui";
import AsyncSelect from "react-select/async";
import { useQuery } from "react-query";
import { getAgentBySearch, getAllProduct, getProductBySearch } from "./service";
import NumberFormat from "@/utils/numberFormat";
import InputLabelModified from "@/components/reactdash-ui/forms/InputLabelModified";
import TextareaModified from "@/components/reactdash-ui/forms/TextAreaModified";

const style = {
  control: (base) => ({
    ...base,
    // This line disable the blue border
    boxShadow: "none",
  }),
};

export default function ModalAddProduct({ open, setOpen, setItems }) {
  const [state, setState] = useState(null);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  const { data: agentList, isLoading } = useQuery(
    ["getAllProducts", { page: 1, search: "" }],
    getAllProduct
  );

  const defaultOptions = useMemo(() => {
    return agentList?.docs?.map((item) => {
      return { value: item, label: item.name };
    });
  }, [agentList]);

  const promise = async (q) => {
    const res = await getProductBySearch(q);
    return res.docs?.map((item) => {
      return { value: item, label: item.name };
    });
  };

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      {isLoading ? (
        <Card>
          <p>Loading Modal...</p>
        </Card>
      ) : (
        <div className="bg-white w-full max-w-lg p-3.5 rounded-lg">
          <p className="font-bold text-xl text-center mb-2">Add Product</p>
          <form>
            <div className="w-full">
              <label className="inline-block mb-2">
                Products
                <span className="text-red-500">*</span>
              </label>
              <AsyncSelect
                cacheOptions
                loadOptions={promise}
                defaultOptions={defaultOptions}
                className="w-full pb-4"
                styles={style}
                onChange={(event) => setState(event.value)}
                noOptionsMessage={() => "Product not found"}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InputLabel label="Code" value={state?.code || "-"} disabled />
              <InputLabel label="Name" value={state?.name || "-"} disabled />
              <InputLabel
                label="Price"
                value={NumberFormat(state?.price || 0)}
                disabled
              />
              <InputLabel label="Unit" value={state?.unit || "-"} disabled />
              <InputLabelModified
                label="qty"
                value={qty}
                type="number"
                min={0}
                max={state?.stock}
                onChange={(event) => setQty(event.target.value)}
              />
              <InputLabel
                label="Total Price"
                value={NumberFormat(state?.price * qty || 0)}
                disabled
              />
            </div>
            <TextareaModified
              label="Notes"
              onChange={(eve) => setNotes(eve.target.value)}
            />
          </form>
          <div className="pb-2.5" />
          <div className="flex justify-center items-center w-full space-x-5 my-2.5">
            <Button
              color="outline-gold"
              onClick={() => {
                setQty(1);
                setNotes("");
                setState(null);
                setOpen();
              }}
            >
              Batal
            </Button>
            <Button
              color="gold"
              onClick={() => {
                state.qty = qty;
                state.notes = notes;
                setItems((prev) => [...prev, state]);
                setState(null);
                setQty(1);
                setNotes("");
                setOpen();
              }}
            >
              Simpan
            </Button>
          </div>
        </div>
      )}
    </ModalBase>
  );
}
