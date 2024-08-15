import ModalBase from "@/components/global/Modal";
import { Button } from "@/components/reactdash-ui";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { api } from "@/utils/axios";
import useOrder from "./hook/useOrders";
import { useNavigate } from "react-router-dom";

export default function ModalPaid({
  open,
  setOpen,
  id,
  currentData,
  setError,
  setErrorMessage,
}) {
  const client = useQueryClient();
  const order = useOrder();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handlePaid = async () => {
    try {
      setLoading(true);
      currentData.status = "paid";
      let res = await api.post("/order", currentData);
      if (id) {
        res = await api.patch(`/order/${id}`, currentData);
      }
      if (res?.status !== 200) {
        setError(true);
        setErrorMessage("An error occured");
      } else {
        order.setPaid(true);
        navigate("/dashboard/list-orders");
        setOpen();
        client.invalidateQueries("orders");
      }
    } catch (error) {
      console.warn("Something went wrong");
    } finally {
      setOpen();
      setLoading(false);
    }
  };

  return (
    <ModalBase isOpen={open} closeModal={setOpen}>
      <div className="bg-white w-full max-w-md flex flex-col items-center justify-center p-3.5 rounded-lg">
        {/* <img alt="modal-delete" src="/img/ilustration/paid.png" /> */}
        <p className="font-semibold text-lg">
          Are you sure want to set this order as paid ?
        </p>
        <div className="pb-2.5" />
        <div className="flex justify-center items-center w-full space-x-5 my-2.5">
          <Button color="outline-gold" onClick={() => setOpen()}>
            No
          </Button>
          <Button color="gold" onClick={() => handlePaid()} disabled={loading}>
            {loading ? "Please wait..." : "Yes"}
          </Button>
        </div>
      </div>
    </ModalBase>
  );
}
